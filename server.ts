import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { marketEngine } from './src/services/marketEngine';
import { DEMO_PRICE_HISTORY, PRODUCTS } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily / safely
let aiClient: GoogleGenAI | null = null;
let geminiCooldownUntil = 0; // Cooldown timestamp when 429 is hit

// In-memory cache for API responses to avoid hitting Gemini rate limits
const marketInsightCache = new Map<string, { data: any; expiry: number }>();
const explainCache = new Map<string, { data: any; expiry: number }>();
const queryCache = new Map<string, { data: any; expiry: number }>();
const matchCache = new Map<string, { data: any; expiry: number }>();

function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  // If in cooldown period after a 429, skip calling to prevent rate limit pile-up
  if (Date.now() < geminiCooldownUntil) return null;

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function handleGeminiError(err: any, endpointName: string) {
  const errMsg = err?.message || String(err);
  if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
    // Set 60-second cooldown to protect quota
    geminiCooldownUntil = Date.now() + 60 * 1000;
  }
}

// -------------------------------------------------------------
// 1. PRODUCTS & MARKETS API
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Zeitgeist B2B Intelligence Engine v1.0' });
});

app.get('/api/products', (req, res) => {
  try {
    const products = marketEngine.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.get('/api/markets', (req, res) => {
  try {
    const markets = marketEngine.getMarkets();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve markets' });
  }
});

app.get('/api/listings', (req, res) => {
  try {
    const productId = req.query.productId as string | undefined;
    const marketId = req.query.marketId as string | undefined;
    const listings = marketEngine.getListings(productId, marketId);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

// -------------------------------------------------------------
// 2. OPPORTUNITIES & ANOMALY API
// -------------------------------------------------------------
app.get('/api/opportunities', (req, res) => {
  try {
    const productId = req.query.productId as string | undefined;
    const opportunities = marketEngine.detectOpportunities(productId);
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect opportunities' });
  }
});

app.get('/api/opportunities/:id', (req, res) => {
  try {
    const opportunities = marketEngine.detectOpportunities();
    const found = opportunities.find((o) => o.id === req.params.id);
    if (!found) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(found);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get opportunity details' });
  }
});

app.get('/api/anomalies', (req, res) => {
  try {
    const productId = (req.query.productId as string) || 'prod-cement-m500';
    const anomalies = marketEngine.calculateAnomalies(productId);
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate price anomalies' });
  }
});

app.get('/api/snapshot', (req, res) => {
  try {
    const productId = (req.query.productId as string) || 'prod-cement-m500';
    const snapshot = marketEngine.getMarketSnapshot(productId);
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get market snapshot' });
  }
});

app.get('/api/history', (req, res) => {
  try {
    res.json(DEMO_PRICE_HISTORY);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get price history' });
  }
});

// -------------------------------------------------------------
// 3. SCAN PIPELINE API (FEATURE 15)
// -------------------------------------------------------------
app.post('/api/scan', (req, res) => {
  try {
    const productId = req.body?.productId as string | undefined;
    const snapshot = marketEngine.getMarketSnapshot(productId || 'prod-cement-m500');
    const opportunities = marketEngine.detectOpportunities(productId);
    const anomalies = marketEngine.calculateAnomalies(productId || 'prod-cement-m500');

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      listingsAnalyzed: snapshot.totalListings,
      productsMatched: 38,
      anomaliesDetected: anomalies.length,
      opportunitiesCalculated: opportunities.length,
      highValueCount: snapshot.highValueOpportunitiesCount,
      topOpportunities: opportunities.slice(0, 5),
      snapshot,
    });
  } catch (error) {
    res.status(500).json({ error: 'Market scan pipeline failed' });
  }
});

// -------------------------------------------------------------
// 4. PRODUCT MATCHING API (FEATURE 3)
// -------------------------------------------------------------
app.post('/api/product-match', (req, res) => {
  try {
    const query = req.body?.query as string;
    if (!query) {
      return res.status(400).json({ error: 'Query string required' });
    }
    const match = marketEngine.matchProduct(query);
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Product matching failed' });
  }
});

// -------------------------------------------------------------
// 5. ARBITRAGE SIMULATOR (INTERACTIVE SANDBOX)
// -------------------------------------------------------------
app.post('/api/simulate', (req, res) => {
  try {
    const {
      productId = 'prod-cement-m500',
      buyMarketId = 'mkt-qarshi',
      sellMarketId = 'mkt-tashkent',
      units = 400,
      customQuantity,
      customLogisticsRate,
      transitCostPerKmTon,
      customFeeRate,
      customBuyPrice,
      customSellPrice,
    } = req.body;

    const actualUnits = customQuantity ?? units ?? 400;
    const actualLogisticsRate = transitCostPerKmTon ?? customLogisticsRate;

    const product = marketEngine.getProducts().find((p) => p.id === productId) || marketEngine.getProducts()[0];
    const buyPrice = customBuyPrice ?? (productId === 'prod-cement-m500' ? 78000 : 9200000);
    const sellPrice = customSellPrice ?? (productId === 'prod-cement-m500' ? 96000 : 10600000);

    const breakdown = marketEngine.calculateCostBreakdown(
      product,
      buyMarketId,
      sellMarketId,
      buyPrice,
      sellPrice,
      actualUnits,
      actualLogisticsRate,
      customFeeRate
    );

    const demandSignal = marketEngine.getDemandSignal(product.id, sellMarketId);
    const scoreBreakdown = marketEngine.scoreOpportunity(
      breakdown.roiPercent,
      8.0,
      demandSignal.demandScore,
      5000,
      breakdown.distanceKm
    );

    const viabilityVerdict =
      breakdown.roiPercent >= 15
        ? 'High Arbitrage Viability'
        : breakdown.roiPercent >= 8
        ? 'Viable Trade Margin'
        : 'Tight Margin';

    res.json({
      ...breakdown,
      costBreakdown: {
        totalCost: breakdown.totalInvestment,
        totalCostPerUnit: breakdown.totalCostPerUnit,
        logisticsCost: breakdown.totalLogisticsCost,
        logisticsCostPerUnit: breakdown.logisticsCostPerUnit,
        totalRevenue: breakdown.grossRevenue,
        sellingPricePerUnit: breakdown.sellingPricePerUnit,
        totalNetProfit: breakdown.totalNetProfit,
        netProfitPerUnit: breakdown.netProfitPerUnit,
        roiPercent: breakdown.roiPercent,
        breakEvenPrice: breakdown.breakEvenSellPrice,
      },
      opportunityScore: scoreBreakdown.totalScore,
      viabilityVerdict,
    });
  } catch (error) {
    res.status(500).json({ error: 'Simulation failed' });
  }
});

// -------------------------------------------------------------
// 5.5 GEMINI AI PRODUCT SPECIFICATION MATCHER
// -------------------------------------------------------------
app.post('/api/match-product', async (req, res) => {
  try {
    const { rawTitle, language = 'uz' } = req.body || {};
    if (!rawTitle || typeof rawTitle !== 'string') {
      return res.status(400).json({ error: 'rawTitle is required' });
    }

    const trimmed = rawTitle.trim();
    const cacheKey = `${trimmed.toLowerCase()}_${language}`;
    const cached = matchCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }

    const ai = getAI();
    let matchResult: any = null;

    if (ai) {
      try {
        const catalog = PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          standardUnit: p.standardUnit,
          weightKg: p.weightKg,
          description: p.description,
        }));

        const systemPrompt = `You are Zeitgeist's AI B2B Product Normalizer & Specification Matcher.
Given a raw, unstandardized B2B supplier listing title (which may be in Uzbek, Russian, Latin, Cyrillic, or English with colloquial abbreviations, packing sizes, or regional trade terms), semantically match it to the best catalog product.

CATALOG PRODUCTS:
${JSON.stringify(catalog, null, 2)}

INSTRUCTIONS:
1. Semantically match the input title to the most relevant catalog product.
2. Determine confidence score as a number between 0.0 and 1.0 (e.g. 0.95 for exact grade match, 0.82 for plausible grade match, 0.60 for generic match).
3. Assign status:
   - "Same Product (>0.85)" if confidence >= 0.85
   - "Possible Match (0.70–0.85)" if confidence >= 0.70 and < 0.85
   - "Different Product (<0.70)" if confidence < 0.70
4. Extract key specification attributes:
   - grade: e.g. "M500", "M400", "A500C 12mm", "12.5mm Moisture Resistant", "M100"
   - weightKg: standard weight per unit in kg (e.g. 50 for 50kg bag, 1000 for ton, 25 for gypsum sheet, 3500 for 1000 bricks)
   - packaging: e.g. "50kg paper bag", "bundle", "sheet", "pallet (1000 pcs)"
   - brand: manufacturer/mill brand if mentioned (e.g. "Qizilqum", "Bekabad / O'zmetkombinat", "Knauf", "Bukhara Gips")
5. Provide a short 1-sentence reasoning in ${language === 'uz' ? 'Uzbek' : 'English'}.

Return ONLY valid JSON matching this exact schema:
{
  "matchedProductId": "prod-cement-m500",
  "matchedProductName": "Cement M500 (50kg bag)",
  "confidence": 0.95,
  "category": "Cement & Binders",
  "standardUnit": "50kg bag",
  "status": "Same Product (>0.85)",
  "extractedAttributes": {
    "grade": "M500",
    "weightKg": 50,
    "packaging": "50kg paper bag",
    "brand": "Qizilqum"
  },
  "reasoning": "M500 markali sement va 50kg qadoqlash spetsifikatsiyasi bo'yicha to'liq mos keladi."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Supplier Listing Title: "${trimmed}"\n\n${systemPrompt}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed && parsed.matchedProductId) {
            const matchedProd = PRODUCTS.find((p) => p.id === parsed.matchedProductId);
            matchResult = {
              rawTitle: trimmed,
              matchedProductId: parsed.matchedProductId,
              matchedProductName: parsed.matchedProductName || matchedProd?.name || 'Standardized Product',
              confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.92,
              category: parsed.category || matchedProd?.category || 'Building Materials',
              standardUnit: parsed.standardUnit || matchedProd?.standardUnit || 'unit',
              status: parsed.status || (parsed.confidence >= 0.85 ? 'Same Product (>0.85)' : parsed.confidence >= 0.7 ? 'Possible Match (0.70–0.85)' : 'Different Product (<0.70)'),
              extractedAttributes: parsed.extractedAttributes || {},
              reasoning: parsed.reasoning || 'Gemini 3.7 Flash AI Semantic Match',
              source: 'gemini',
            };
          }
        }
      } catch (err) {
        handleGeminiError(err, 'match-product');
      }
    }

    // Fallback to deterministic matcher if Gemini unavailable, cooled down, or errored
    if (!matchResult) {
      const fallback = marketEngine.matchProduct(trimmed);
      matchResult = {
        ...fallback,
        source: 'deterministic_fallback',
      };
    }

    // Cache result for 30 minutes
    matchCache.set(cacheKey, { data: matchResult, expiry: Date.now() + 30 * 60 * 1000 });

    res.json(matchResult);
  } catch (error) {
    res.status(500).json({ error: 'Product matching failed' });
  }
});

// -------------------------------------------------------------
// 6. GEMINI AI EXPLANATION (FEATURE 9 & 11)
// -------------------------------------------------------------
app.post('/api/explain', async (req, res) => {
  try {
    const { opportunity, language = 'uz' } = req.body;
    if (!opportunity) {
      return res.status(400).json({ error: 'Opportunity payload required' });
    }

    const cacheKey = `${opportunity.id || opportunity.corridorId}_${language}`;
    const cached = explainCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }

    const ai = getAI();
    let explanationText = '';

    if (ai) {
      try {
        const langInstruction =
          language === 'uz'
            ? 'Respond entirely in professional, high-standard Uzbek language (O\'zbek tili, Lotin yozuvida).'
            : 'Respond in professional English.';

        const prompt = `You are the lead B2B Market Arbitrage Analyst at Zeitgeist.
Analyze the following verified deterministic market arbitrage opportunity and explain to an entrepreneur or procurement director why this trade exists, the structural market dynamics causing the price spread, and actionable operational risks to watch for.
${langInstruction}

STRUCTURED CALCULATED FACTS:
- Product: ${opportunity.productName} (${opportunity.standardUnit})
- Buy Market: ${opportunity.buyMarketName} at ${opportunity.buyPrice.toLocaleString()} UZS
- Sell Market: ${opportunity.sellMarketName} at ${opportunity.sellEstimatedPrice.toLocaleString()} UZS
- Freight/Logistics Cost: ${opportunity.logisticsCost.toLocaleString()} UZS (${opportunity.distanceKm} km transit)
- Transaction/Handling Fees: ${opportunity.fees.toLocaleString()} UZS
- Total Landed Cost: ${opportunity.totalCost.toLocaleString()} UZS
- Net Profit per unit: ${opportunity.netProfit.toLocaleString()} UZS
- Net ROI: ${opportunity.roi}%
- Target Market Demand Level: ${opportunity.demandLevel} (WoW Velocity: +${opportunity.demandWow}%)
- Zeitgeist Opportunity Score: ${opportunity.scoreBreakdown?.totalScore || 91}/100 (${opportunity.scoreBreakdown?.classification || 'Exceptional'})
- Product Match Confidence: ${opportunity.productMatchConfidence}%

RULES:
1. Ground your explanation STRICTLY in the numbers above. Do not invent any different numbers.
2. Structure into 3 brief sections:
   - "Market Thesis & Why This Exists" / "Bozor Tezisi va Sabablar Tahlili" (e.g. supply glut at manufacturing hub vs high infrastructure consumption in capital)
   - "Financial & Unit Economics Breakdown" / "Moliyaviy va Yagona Birlik Xarajatlari" (net spread after freight)
   - "Execution Advice & Risk Management" / "Amaliy Tavsiyalar va Xavflarni Boshqarish" (verify batch quality, secure flatbed carrier before lock-in)
3. Keep it punchy, professional, and directly actionable.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        explanationText = response.text || '';
      } catch (geminiError) {
        handleGeminiError(geminiError, 'explain');
      }
    }

    // High quality deterministic fallback
    if (!explanationText) {
      if (language === 'uz') {
        explanationText = `### Bozor Tezisi va Sabablar Tahlili
Ushbu yuqori rentabelli arbitraj imkoniyati hududlararo narxlar nomutanosibligiga asoslangan. **${opportunity.buyMarketName}** hududidagi to'g'ridan-to'g'ri ishlab chiqarish quvvatlari va ortiqcha zaxiralar narxni **${opportunity.buyPrice.toLocaleString()} UZS** darajasida ushlab turibdi. Aksincha, **${opportunity.sellMarketName}** bozorida faol qurilish mavsumi hisobiga talab kuchli o'smoqda (+${opportunity.demandWow}% haftalik o'sish) va bu mahsulotni **${opportunity.sellEstimatedPrice.toLocaleString()} UZS** narxida sotish imkonini bermoqda.

### Moliyaviy va Yagona Birlik Xarajatlari
- **Yalpi narxlar spredi:** ${(opportunity.sellEstimatedPrice - opportunity.buyPrice).toLocaleString()} UZS / ${opportunity.standardUnit}
- **Logistika va yo'l xarajati:** ${opportunity.logisticsCost.toLocaleString()} UZS (${opportunity.distanceKm} km masofaga 20t fura hisobida).
- **Sof foyda marjasi:** **+${opportunity.netProfit.toLocaleString()} UZS sof foyda** (Barcha terminal va to'lovlardan so'ng **+${opportunity.roi}% Net ROI**).

### Amaliy Tavsiyalar va Xavflarni Boshqarish
1. **Shartnomani band qilish:** Tashishdan oldin ${opportunity.buySeller || 'depo yetkazib beruvchisi'} bilan narx va hajmni qat'iy kelishib oling.
2. **Yuk hajmini optimallashtirish:** Transport xarajatini birlik uchun ${opportunity.logisticsCost.toLocaleString()} UZS dan oshirmaslik uchun kamida 20 tonnalik partiyada yuklang.
3. **Ijro tezligi:** Qabul qiluvchi bozor talabi (${opportunity.demandLevel}) yuqori bo'lgan 48-72 soatlik oynada yetkazib berishni bajaring.`;
      } else {
        explanationText = `### Market Thesis & Why This Exists
This high-conviction arbitrage opportunity is driven by strong regional price divergence. **${opportunity.buyMarketName}** benefits from local production capacity and surplus inventory, keeping prices depressed at **${opportunity.buyPrice.toLocaleString()} UZS**. In contrast, **${opportunity.sellMarketName}** is experiencing an aggressive demand surge (+${opportunity.demandWow}% WoW) from commercial construction projects, creating pricing power at **${opportunity.sellEstimatedPrice.toLocaleString()} UZS**.

### Financial & Unit Economics Breakdown
- **Gross Price Spread:** ${(opportunity.sellEstimatedPrice - opportunity.buyPrice).toLocaleString()} UZS per ${opportunity.standardUnit}
- **Logistics & Freight Buffer:** ${opportunity.logisticsCost.toLocaleString()} UZS over ${opportunity.distanceKm} km road freight.
- **Net Margin:** **${opportunity.netProfit.toLocaleString()} UZS net profit per unit** delivering an estimated **${opportunity.roi}% Net ROI** after all handling and transaction fees.

### Execution Advice & Risk Management
1. **Contract Lock-in:** Secure fixed wholesale allocation with ${opportunity.buySeller || 'depot suppliers'} prior to transit dispatch.
2. **Freight Optimization:** Consolidate in 20-ton payloads to maintain logistics cost under ${opportunity.logisticsCost.toLocaleString()} UZS/unit.
3. **Turnaround Time:** Execute within the current 72-hour window while target market demand remains at ${opportunity.demandLevel}.`;
      }
    }

    const payload = {
      explanation: explanationText,
      confidence: 89,
      timestamp: new Date().toISOString(),
    };

    // Cache result for 30 minutes
    explainCache.set(cacheKey, { data: payload, expiry: Date.now() + 30 * 60 * 1000 });

    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// -------------------------------------------------------------
// 7. GEMINI AI MARKET MACRO INSIGHT (FEATURE 22)
// -------------------------------------------------------------
app.post('/api/market-insight', async (req, res) => {
  try {
    const { language = 'uz' } = req.body || {};
    const cacheKey = `market_insight_${language}`;
    const cached = marketInsightCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }

    const ai = getAI();
    let insightData: any = null;

    if (ai) {
      try {
        const langPrompt = language === 'uz' ? 'Output all text fields in Uzbek language (O\'zbek tili Lotin yozuvida).' : 'Output in English.';
        const prompt = `You are Zeitgeist's Chief Market Intelligence AI.
Synthesize the current B2B construction materials market in Uzbekistan based on these calculated signals:
- Cement M500 prices in Tashkent (+19.3% anomaly, 96,000 UZS) vs Qarshi (78,000 UZS) and Navoi (76,500 UZS).
- Tashkent cement demand velocity up +18% WoW with supply deficit.
- Rebar 12mm spread between Samarkand (9.2M UZS/t) and Tashkent (10.6M UZS/t).
- Gypsum board spread between Bukhara (38k UZS) and Tashkent (49k UZS).
${langPrompt}

Return a JSON object with:
{
  "headline": "Short bold headline about market pressure",
  "summary": "2-3 concise sentences summarizing key opportunities",
  "marketPressures": [
    {"market": "Tashkent", "product": "Cement M500", "type": "Elevated Demand", "detail": "19.3% above regional median driven by urban building pace"},
    {"market": "Qarshi", "product": "Cement M500", "type": "Supply Surplus", "detail": "Depot inventory at 78,000 UZS creates 17.1% arbitrage window to capital"}
  ],
  "recommendation": "Clear procurement recommendation for business buyers",
  "confidence": 89
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          insightData = JSON.parse(response.text);
        }
      } catch (err) {
        handleGeminiError(err, 'market-insight');
      }
    }

    if (!insightData) {
      if (language === 'uz') {
        insightData = {
          headline: 'Toshkent Koridorida Kuchli Arbitraj Bosimi va Talab O\'sishi',
          summary:
            'Toshkent bozorida Tsement M500 narxi hududiy o\'rtacha narxdan +19.3% yuqorilab bormoqda, haftalik xarid talabi esa 18.0% ga oshgan. Qashqadaryo (Qarshi) va Navoiy bazalaridagi ortiqcha zaxiralar poytaxtga yuk tashishda yuqori rentabellikni ta\'minlaydi.',
          marketPressures: [
            {
              market: 'Toshkent',
              product: 'Cement M500',
              type: 'Elevated Demand',
              detail: 'Narxlar 96,000 UZS gacha ko\'tarilgan, yirik qurilish obyektlarida mahsulotga talab yuqori.',
            },
            {
              market: 'Qarshi',
              product: 'Cement M500',
              type: 'Supply Surplus',
              detail: 'Zavod omborida 78,000 UZS narx belgilangan, poytaxtga yetkazilganda har bir qopdan 14,000 UZS sof foyda beradi.',
            },
            {
              market: 'Samarqand',
              product: 'Rebar 12mm',
              type: 'Arbitrage Corridor',
              detail: 'Bekobod armaturasi 9.2M UZS atrofida sotilmoqda, poytaxtda esa 10.6M UZS (+13.8% Net ROI).',
            },
          ],
          recommendation:
            'Ta\'minotchilar va qurilish kompaniyalariga ommaviy tsement xaridlarini Qarshi va Navoiy tugunlari orqali amalga oshirish tavsiya etiladi. Bu amaldagi Toshkent narxlariga nisbatan 17.1% tejamkorlik va sof marja beradi.',
          confidence: 89,
          timestamp: new Date().toISOString(),
        };
      } else {
        insightData = {
          headline: 'Heavy Inflow Arbitrage Pressure on Tashkent Corridor',
          summary:
            'Cement M500 prices in Tashkent are currently +19.3% above the regional median while weekly procurement demand increased by 18.0%. Active supply gluts in Kashkadarya and Navoi provide optimal margin absorption for regional haulage.',
          marketPressures: [
            {
              market: 'Tashkent',
              product: 'Cement M500',
              type: 'Elevated Demand',
              detail: 'Prices elevated at 96,000 UZS with structural inventory deficit in high-density development zones.',
            },
            {
              market: 'Qarshi',
              product: 'Cement M500',
              type: 'Supply Surplus',
              detail: 'Direct depot pricing at 78,000 UZS enables 14,000 UZS net profit per bag after 4,000 UZS road logistics.',
            },
            {
              market: 'Samarkand',
              product: 'Rebar 12mm',
              type: 'Arbitrage Corridor',
              detail: 'Bekabad mill allocations trading at 9.2M UZS vs 10.6M UZS in capital (13.8% Net ROI).',
            },
          ],
          recommendation:
            'Procurement teams should route bulk cement orders through Qarshi and Navoi supplier nodes, capturing an estimated 17.1% net spread over current spot rates in Tashkent.',
          confidence: 89,
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Cache result for 10 minutes
    marketInsightCache.set(cacheKey, { data: insightData, expiry: Date.now() + 10 * 60 * 1000 });

    res.json(insightData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate market insight' });
  }
});

// -------------------------------------------------------------
// 8. NATURAL LANGUAGE PROCUREMENT ASSISTANT (FEATURE 26)
// -------------------------------------------------------------
app.post('/api/query', async (req, res) => {
  try {
    const { prompt: userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const normalizedPrompt = userPrompt.toLowerCase().trim();
    const cached = queryCache.get(normalizedPrompt);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }

    const ai = getAI();
    let parsedFilters = {
      productId: 'prod-cement-m500',
      minRoi: 0,
      sortBy: 'opportunity_score',
      summary: 'Filtering top market opportunities...',
    };

    // Keyword rule-based heuristic parsing for instantaneous zero-latency responses
    if (normalizedPrompt.includes('armatura') || normalizedPrompt.includes('rebar') || normalizedPrompt.includes('bekobod')) {
      parsedFilters.productId = normalizedPrompt.includes('16') ? 'prod-rebar-16mm' : 'prod-rebar-12mm';
      parsedFilters.summary = 'Armatura bo\'yicha Bekobod va Samarqand koridorlari filtrlangan.';
    } else if (normalizedPrompt.includes('gips') || normalizedPrompt.includes('gypsum') || normalizedPrompt.includes('knauf') || normalizedPrompt.includes('buxoro')) {
      parsedFilters.productId = 'prod-gypsum-board';
      parsedFilters.summary = 'Buxoro gipskarton bo\'yicha yuqori marjali yo\'nalishlar ko\'rsatilmoqda.';
    } else if (normalizedPrompt.includes('m400')) {
      parsedFilters.productId = 'prod-cement-m400';
    } else {
      parsedFilters.productId = 'prod-cement-m500';
    }

    if (normalizedPrompt.includes('roi') || normalizedPrompt.includes('foydali') || normalizedPrompt.includes('rentabelli')) {
      parsedFilters.sortBy = 'roi';
      parsedFilters.minRoi = 10;
    }

    if (ai) {
      try {
        const systemPrompt = `You are Zeitgeist AI query parser.
Convert the user's natural language B2B trading or procurement question into structured filter parameters:
Allowed productIds: ["prod-cement-m500", "prod-cement-m400", "prod-rebar-12mm", "prod-rebar-16mm", "prod-gypsum-board", "prod-brick"]
Allowed sortBy: ["opportunity_score", "roi", "net_profit", "demand"]

Return JSON:
{
  "productId": "prod-cement-m500",
  "minRoi": 10,
  "sortBy": "roi",
  "aiSummary": "Direct 1-2 sentence analytical answer answering the user prompt using market data."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `User Query: "${userPrompt}"\n${systemPrompt}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsedFilters = {
            productId: parsed.productId || parsedFilters.productId,
            minRoi: parsed.minRoi ?? parsedFilters.minRoi,
            sortBy: parsed.sortBy || parsedFilters.sortBy,
            summary: parsed.aiSummary || parsedFilters.summary,
          };
        }
      } catch (err) {
        handleGeminiError(err, 'query');
      }
    }

    const opportunities = marketEngine.detectOpportunities(parsedFilters.productId);
    const filtered = opportunities
      .filter((opp) => opp.roi >= parsedFilters.minRoi)
      .sort((a, b) => {
        if (parsedFilters.sortBy === 'roi') return b.roi - a.roi;
        if (parsedFilters.sortBy === 'net_profit') return b.netProfit - a.netProfit;
        return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
      });

    const responsePayload = {
      filters: parsedFilters,
      results: filtered,
      count: filtered.length,
    };

    // Cache query results for 10 minutes
    queryCache.set(normalizedPrompt, { data: responsePayload, expiry: Date.now() + 10 * 60 * 1000 });

    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ error: 'Query processing failed' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zeitgeist Engine server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
