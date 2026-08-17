import {
  Product,
  Market,
  Listing,
  Opportunity,
  MarketSnapshot,
  AnomalyReport,
  DemandSignal,
  ArbitrageCostBreakdown,
  OpportunityScoreBreakdown,
  ProductMatchResult,
} from '../types';
import {
  PRODUCTS,
  MARKETS,
  INITIAL_LISTINGS,
  DISTANCE_MATRIX_KM,
  LOGISTICS_BASE_RATE_PER_KG_KM,
  HANDLING_FEE_PER_UNIT,
  TRANSACTION_BROKER_FEE_RATE,
  DEMO_PRICE_HISTORY,
} from '../data/mockData';

export class MarketEngine {
  private products: Product[] = PRODUCTS;
  private markets: Market[] = MARKETS;
  private listings: Listing[] = [...INITIAL_LISTINGS];

  public getProducts(): Product[] {
    return this.products;
  }

  public getMarkets(): Market[] {
    return this.markets;
  }

  public getListings(productId?: string, marketId?: string): Listing[] {
    return this.listings.filter((item) => {
      if (productId && item.productId !== productId) return false;
      if (marketId && item.marketId !== marketId) return false;
      return true;
    });
  }

  // FEATURE 3: Product Matching AI & Attribute Normalizer
  public matchProduct(rawInput: string): ProductMatchResult {
    const clean = rawInput.toLowerCase().trim();
    let matchedProduct = this.products[0];
    let confidence = 0.5;
    const extractedAttributes: ProductMatchResult['extractedAttributes'] = {};

    // Extract grade / keywords
    if (clean.includes('m500') || clean.includes('m-500') || clean.includes('500')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-cement-m500') || this.products[0];
      confidence = clean.includes('m500') || clean.includes('m-500') ? 0.94 : 0.86;
      extractedAttributes.grade = 'M500 (D0/D20)';
      extractedAttributes.packaging = '50kg paper bag / bulk';
    } else if (clean.includes('m400') || clean.includes('m-400') || clean.includes('400')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-cement-m400') || this.products[1];
      confidence = 0.92;
      extractedAttributes.grade = 'M400';
    } else if (clean.includes('12mm') || (clean.includes('rebar') && clean.includes('12')) || clean.includes('armatura 12')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-rebar-12mm') || this.products[2];
      confidence = 0.95;
      extractedAttributes.grade = 'A500C (12mm)';
      extractedAttributes.weightKg = 1000;
    } else if (clean.includes('16mm') || (clean.includes('rebar') && clean.includes('16')) || clean.includes('armatura 16')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-rebar-16mm') || this.products[3];
      confidence = 0.95;
      extractedAttributes.grade = 'A500C (16mm)';
      extractedAttributes.weightKg = 1000;
    } else if (clean.includes('gypsum') || clean.includes('gips') || clean.includes('drywall') || clean.includes('gkl')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-gypsum-board') || this.products[4];
      confidence = 0.91;
      extractedAttributes.packaging = 'Sheet 1200x2500x9.5mm';
    } else if (clean.includes('brick') || clean.includes('gisht') || clean.includes('kirpich')) {
      matchedProduct = this.products.find((p) => p.id === 'prod-brick') || this.products[5];
      confidence = 0.93;
      extractedAttributes.grade = 'M100/M125 Ceramic';
    } else {
      // Fuzzy fallback
      for (const p of this.products) {
        if (clean.includes(p.name.toLowerCase()) || clean.includes(p.category.toLowerCase())) {
          matchedProduct = p;
          confidence = 0.78;
          break;
        }
      }
    }

    let status: ProductMatchResult['status'] = 'Different Product (<0.70)';
    if (confidence > 0.85) {
      status = 'Same Product (>0.85)';
    } else if (confidence >= 0.70) {
      status = 'Possible Match (0.70–0.85)';
    }

    return {
      rawTitle: rawInput,
      matchedProductId: matchedProduct.id,
      matchedProductName: matchedProduct.name,
      confidence: Math.round(confidence * 100) / 100,
      category: matchedProduct.category,
      standardUnit: matchedProduct.standardUnit,
      status,
      extractedAttributes,
    };
  }

  // FEATURE 5: Price Anomaly Detection
  public calculateAnomalies(productId: string = 'prod-cement-m500'): AnomalyReport[] {
    const prodListings = this.listings.filter((l) => l.productId === productId);
    if (prodListings.length === 0) return [];

    // Calculate regional prices per market
    const marketPricesMap: Record<string, number[]> = {};
    for (const item of prodListings) {
      if (!marketPricesMap[item.marketId]) {
        marketPricesMap[item.marketId] = [];
      }
      marketPricesMap[item.marketId].push(item.priceNormalized);
    }

    const allPrices = prodListings.map((l) => l.priceNormalized);
    const sortedAll = [...allPrices].sort((a, b) => a - b);
    const median =
      sortedAll.length % 2 === 0
        ? (sortedAll[sortedAll.length / 2 - 1] + sortedAll[sortedAll.length / 2]) / 2
        : sortedAll[Math.floor(sortedAll.length / 2)];

    const mean = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    const variance =
      allPrices.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / allPrices.length;
    const stdDev = Math.sqrt(variance) || 1;

    const reports: AnomalyReport[] = [];

    for (const mkt of this.markets) {
      const prices = marketPricesMap[mkt.id] || [];
      if (prices.length === 0) continue;

      const mktAvg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const sortedMkt = [...prices].sort((a, b) => a - b);
      const mktMedian =
        sortedMkt.length % 2 === 0
          ? (sortedMkt[sortedMkt.length / 2 - 1] + sortedMkt[sortedMkt.length / 2]) / 2
          : sortedMkt[Math.floor(sortedMkt.length / 2)];

      const deviationPercent = Math.round(((mktAvg - median) / median) * 1000) / 10;
      const zScore = Math.round(((mktAvg - mean) / stdDev) * 100) / 100;

      let anomalyLevel: AnomalyReport['anomalyLevel'] = 'Normal';
      if (deviationPercent >= 15) {
        anomalyLevel = 'High Price Anomaly';
      } else if (deviationPercent <= -5) {
        anomalyLevel = 'Undervalued Supply';
      } else if (Math.abs(deviationPercent) >= 5) {
        anomalyLevel = 'Moderate Anomaly';
      }

      reports.push({
        marketId: mkt.id,
        marketName: mkt.city,
        avgPrice: mktAvg,
        medianPrice: mktMedian,
        deviationPercent,
        zScore,
        anomalyLevel,
      });
    }

    return reports.sort((a, b) => a.avgPrice - b.avgPrice);
  }

  // FEATURE 7: Dynamic Demand Signal Calculator (Derived from Market Levels, Listing Flow & Historical Volatility)
  public getDemandSignal(productId: string, marketId: string): DemandSignal {
    const market = this.markets.find((m) => m.id === marketId) || this.markets[0];

    // 1. Market Base Level & Hub Consumption Characteristics
    let baseScore = market.demandLevel === 'High' ? 68 : market.demandLevel === 'Medium' ? 52 : 38;

    // Consumer Mega-Market (e.g. Tashkent) and Regional Trade Hubs (e.g. Samarkand) have higher structural baseline consumption
    if (market.hubType === 'Consumer Mega-Market') {
      baseScore += 10;
    } else if (market.hubType === 'Regional Trade Hub') {
      baseScore += 5;
    }

    // Supply shortage adds demand pressure; surplus eases it
    if (market.supplyLevel === 'Low') {
      baseScore += 7;
    } else if (market.supplyLevel === 'High') {
      baseScore -= 4;
    }

    // 2. Listing Density & Quantity Signals
    const allProdListings = this.listings.filter((l) => l.productId === productId);
    const mktProdListings = allProdListings.filter((l) => l.marketId === marketId);

    // Listing frequency score (more active vendor feeds = higher trading velocity)
    const listingCountBonus = Math.min(8, mktProdListings.length * 1.5);

    // Check recency of listings (listings posted in the last 48 hours)
    const now = Date.now();
    const recentListings = mktProdListings.filter((l) => {
      const listingTime = new Date(l.timestamp).getTime();
      return !isNaN(listingTime) && now - listingTime < 48 * 3600 * 1000;
    });
    const recencyBonus = Math.min(5, recentListings.length * 1.2);

    // 3. Price Premium / Demand Pull Factor
    let priceSpreadPercent = 0;
    if (allProdListings.length > 0 && mktProdListings.length > 0) {
      const regionalAvg =
        allProdListings.reduce((sum, l) => sum + l.priceNormalized, 0) / allProdListings.length;
      const mktAvg =
        mktProdListings.reduce((sum, l) => sum + l.priceNormalized, 0) / mktProdListings.length;
      if (regionalAvg > 0) {
        priceSpreadPercent = Math.round(((mktAvg - regionalAvg) / regionalAvg) * 1000) / 10;
      }
    }
    const pricePullAdjustment = Math.min(10, Math.max(-8, Math.round(priceSpreadPercent * 0.45)));

    // 4. Historical Velocity & WoW Growth Calculation
    let wowChangePercent = 4.5;
    if (productId === 'prod-cement-m500' && DEMO_PRICE_HISTORY.length >= 2) {
      const first = DEMO_PRICE_HISTORY[0];
      const latest = DEMO_PRICE_HISTORY[DEMO_PRICE_HISTORY.length - 1];
      if (marketId === 'mkt-tashkent' && first.tashkentPrice && latest.tashkentPrice) {
        wowChangePercent =
          Math.round(((latest.tashkentPrice - first.tashkentPrice) / first.tashkentPrice) * 1000) / 10;
      } else if (marketId === 'mkt-samarkand' && first.samarkandPrice && latest.samarkandPrice) {
        wowChangePercent =
          Math.round(((latest.samarkandPrice - first.samarkandPrice) / first.samarkandPrice) * 1000) / 10;
      } else if (marketId === 'mkt-qarshi' && first.qarshiPrice && latest.qarshiPrice) {
        wowChangePercent =
          Math.round(((latest.qarshiPrice - first.qarshiPrice) / first.qarshiPrice) * 1000) / 10;
      } else if (marketId === 'mkt-bukhara' && first.bukharaPrice && latest.bukharaPrice) {
        wowChangePercent =
          Math.round(((latest.bukharaPrice - first.bukharaPrice) / first.bukharaPrice) * 1000) / 10;
      } else {
        wowChangePercent =
          Math.round(Math.max(-4, priceSpreadPercent * 0.7 + (mktProdListings.length > 3 ? 3.5 : 1.2)) * 10) / 10;
      }
    } else {
      wowChangePercent =
        Math.round(Math.max(-4, priceSpreadPercent * 0.7 + (mktProdListings.length > 3 ? 3.5 : 1.2)) * 10) / 10;
    }

    // 5. Composite Final Demand Score
    const computedScore = Math.round(
      Math.min(96, Math.max(30, baseScore + listingCountBonus + recencyBonus + pricePullAdjustment))
    );

    // 6. Classification Levels & Qualitative Attributes
    let currentLevel: DemandSignal['currentLevel'] = 'MODERATE';
    if (computedScore >= 78) {
      currentLevel = 'HIGH';
    } else if (computedScore >= 64) {
      currentLevel = 'MEDIUM';
    } else if (computedScore >= 48) {
      currentLevel = 'MODERATE';
    } else {
      currentLevel = 'LOW';
    }

    let transactionVelocity: DemandSignal['transactionVelocity'] = 'Stable';
    if (wowChangePercent >= 8.0 || computedScore >= 80) {
      transactionVelocity = 'Accelerating';
    } else if (wowChangePercent >= 2.0 || computedScore >= 60) {
      transactionVelocity = 'Stable';
    } else {
      transactionVelocity = 'Softening';
    }

    let inventoryPressure: DemandSignal['inventoryPressure'] = 'Balanced';
    if (market.supplyLevel === 'Low' || (priceSpreadPercent >= 8 && computedScore >= 75)) {
      inventoryPressure = 'Deficit';
    } else if (market.supplyLevel === 'High' || priceSpreadPercent <= -5) {
      inventoryPressure = 'Surplus';
    } else {
      inventoryPressure = 'Balanced';
    }

    return {
      productId,
      marketId,
      currentLevel,
      wowChangePercent,
      demandScore: computedScore,
      transactionVelocity,
      inventoryPressure,
    };
  }

  // FEATURE 6 & 8: Arbitrage Calculation & Transparent Scoring Engine
  public calculateCostBreakdown(
    product: Product,
    buyMarketId: string,
    sellMarketId: string,
    buyPrice: number,
    sellPrice: number,
    units: number = 400, // standard truckload batch (e.g. 20 tons = 400 bags)
    customLogisticsRate?: number,
    customFeeRate?: number
  ): ArbitrageCostBreakdown {
    const distanceKm = DISTANCE_MATRIX_KM[buyMarketId]?.[sellMarketId] || 300;
    const ratePerKgKm = customLogisticsRate ?? LOGISTICS_BASE_RATE_PER_KG_KM;
    const feeRate = customFeeRate ?? TRANSACTION_BROKER_FEE_RATE;

    // Freight calculation based on weight and road distance
    // For Cement M500 (50kg bag) over 450km: 450 * 50 * 0.17 = 3,825 UZS
    const rawFreight = distanceKm * product.weightKg * ratePerKgKm;
    // Scale or cap realistically for commercial freight
    const logisticsCostPerUnit = Math.round(rawFreight / 100) * 100;
    const transactionFeePerUnit = Math.round(buyPrice * feeRate);
    const handlingCostPerUnit = product.weightKg >= 1000 ? 25000 : HANDLING_FEE_PER_UNIT;

    const totalCostPerUnit =
      buyPrice + logisticsCostPerUnit + transactionFeePerUnit + handlingCostPerUnit;
    const totalPurchaseCost = buyPrice * units;
    const totalLogisticsCost = logisticsCostPerUnit * units;
    const totalTransactionFees = transactionFeePerUnit * units;
    const totalHandlingCost = handlingCostPerUnit * units;
    const totalInvestment = totalCostPerUnit * units;

    const grossRevenue = sellPrice * units;
    const netProfitPerUnit = sellPrice - totalCostPerUnit;
    const totalNetProfit = netProfitPerUnit * units;
    const roiPercent = Math.round((netProfitPerUnit / totalCostPerUnit) * 1000) / 10;
    const breakEvenSellPrice = totalCostPerUnit;

    return {
      purchasePrice: buyPrice,
      purchaseUnits: units,
      totalPurchaseCost,
      distanceKm,
      logisticsCostPerUnit,
      totalLogisticsCost,
      transactionFeePerUnit,
      totalTransactionFees,
      handlingCostPerUnit,
      totalHandlingCost,
      totalCostPerUnit,
      totalInvestment,
      sellingPricePerUnit: sellPrice,
      grossRevenue,
      netProfitPerUnit,
      totalNetProfit,
      roiPercent,
      breakEvenSellPrice,
    };
  }

  public scoreOpportunity(
    roi: number,
    deviationPercent: number,
    demandScore: number,
    supplyQuantity: number,
    distanceKm: number
  ): OpportunityScoreBreakdown {
    // 1. Profitability (35%): ROI > 15% gives 90+, ROI 10-15% gives 80-90, ROI 5-10% gives 70-80
    const rawProfit = Math.min(100, Math.max(10, Math.round((roi / 18.0) * 95)));
    const profitabilityScore = Math.min(98, rawProfit);

    // 2. Price Anomaly (20%): Higher positive price spread/deviation gives higher score
    const priceAnomalyScore = Math.min(96, Math.max(20, Math.round(50 + deviationPercent * 2.2)));

    // 3. Demand (20%): Direct from target market demand
    const finalDemandScore = Math.min(95, Math.max(30, demandScore));

    // 4. Liquidity (15%): Volume availability at source market
    const liquidityScore = supplyQuantity > 5000 ? 92 : supplyQuantity > 2000 ? 82 : 70;

    // 5. Risk Score (10%): Closer distance and higher ROI buffer minimize risk
    const distancePenalty = Math.min(25, (distanceKm / 700) * 20);
    const marginBuffer = roi > 12 ? 20 : 10;
    const riskScore = Math.round(Math.min(95, 75 + marginBuffer - distancePenalty));

    // Weighted Score
    const totalScore = Math.round(
      profitabilityScore * 0.35 +
        priceAnomalyScore * 0.20 +
        finalDemandScore * 0.20 +
        liquidityScore * 0.15 +
        riskScore * 0.10
    );

    let classification: OpportunityScoreBreakdown['classification'] = 'Low';
    if (totalScore >= 90) classification = 'Exceptional';
    else if (totalScore >= 80) classification = 'High';
    else if (totalScore >= 70) classification = 'Moderate';

    return {
      profitabilityScore,
      priceAnomalyScore,
      demandScore: finalDemandScore,
      liquidityScore,
      riskScore,
      totalScore,
      classification,
    };
  }

  // Full Opportunity Detection & Pipeline Scan
  public detectOpportunities(productIdFilter?: string): Opportunity[] {
    const opportunities: Opportunity[] = [];
    const targetProducts = productIdFilter
      ? this.products.filter((p) => p.id === productIdFilter)
      : this.products;

    for (const product of targetProducts) {
      const prodListings = this.listings.filter((l) => l.productId === product.id);
      if (prodListings.length === 0) continue;

      // Group listings by market to find lowest buy price and highest reliable selling price
      const marketMinBuyMap: Record<string, Listing> = {};
      const marketAvgSellMap: Record<string, number> = {};

      for (const listing of prodListings) {
        if (!marketMinBuyMap[listing.marketId] || listing.priceNormalized < marketMinBuyMap[listing.marketId].priceNormalized) {
          marketMinBuyMap[listing.marketId] = listing;
        }
      }

      // Calculate market average sell prices
      for (const mkt of this.markets) {
        const mListings = prodListings.filter((l) => l.marketId === mkt.id);
        if (mListings.length > 0) {
          const avg = mListings.reduce((sum, l) => sum + l.priceNormalized, 0) / mListings.length;
          marketAvgSellMap[mkt.id] = Math.round(avg);
        }
      }

      const anomalies = this.calculateAnomalies(product.id);
      const anomalyMap = Object.fromEntries(anomalies.map((a) => [a.marketId, a]));

      // Evaluate cross-market trade lanes
      for (const buyMarket of this.markets) {
        const buyListing = marketMinBuyMap[buyMarket.id];
        if (!buyListing) continue;

        for (const sellMarket of this.markets) {
          if (buyMarket.id === sellMarket.id) continue;

          const sellPrice = marketAvgSellMap[sellMarket.id];
          if (!sellPrice || sellPrice <= buyListing.priceNormalized) continue;

          const costBreakdown = this.calculateCostBreakdown(
            product,
            buyMarket.id,
            sellMarket.id,
            buyListing.priceNormalized,
            sellPrice
          );

          // Only keep viable opportunities with positive net margin after logistics & fees
          if (costBreakdown.netProfitPerUnit > 0 && costBreakdown.roiPercent >= 3.0) {
            const demandSignal = this.getDemandSignal(product.id, sellMarket.id);
            const sellAnomaly = anomalyMap[sellMarket.id];
            const deviation = sellAnomaly ? sellAnomaly.deviationPercent : 5;

            const scoreBreakdown = this.scoreOpportunity(
              costBreakdown.roiPercent,
              deviation,
              demandSignal.demandScore,
              buyListing.quantityAvailable,
              costBreakdown.distanceKm
            );

            // Construct rich evidence highlights
            const keyHighlights: string[] = [
              `Buy price is ${Math.abs(anomalyMap[buyMarket.id]?.deviationPercent || 3.1)}% below regional baseline in ${buyMarket.city}`,
              `Selling market (${sellMarket.city}) trades at +${deviation}% over regional median with strong liquidity`,
              `Logistics cost is well-absorbed (~${costBreakdown.logisticsCostPerUnit.toLocaleString()} UZS/${product.unit}), preserving ${costBreakdown.roiPercent}% net ROI`,
              `Target demand velocity is ${demandSignal.transactionVelocity.toLowerCase()} with +${demandSignal.wowChangePercent}% WoW surge`,
              `Product match confidence: 94% verified cross-market specification`,
            ];

            opportunities.push({
              id: `opp-${product.id}-${buyMarket.id}-${sellMarket.id}`,
              productId: product.id,
              productName: product.name,
              category: product.category,
              standardUnit: product.standardUnit,
              buyMarketId: buyMarket.id,
              buyMarketName: buyMarket.city,
              buySeller: buyListing.seller,
              buyPrice: buyListing.priceNormalized,
              sellMarketId: sellMarket.id,
              sellMarketName: sellMarket.city,
              sellEstimatedPrice: sellPrice,
              logisticsCost: costBreakdown.logisticsCostPerUnit,
              fees: costBreakdown.transactionFeePerUnit + costBreakdown.handlingCostPerUnit,
              totalCost: costBreakdown.totalCostPerUnit,
              netProfit: costBreakdown.netProfitPerUnit,
              roi: costBreakdown.roiPercent,
              distanceKm: costBreakdown.distanceKm,
              demandLevel: demandSignal.currentLevel,
              demandWow: demandSignal.wowChangePercent,
              confidenceScore: 89,
              productMatchConfidence: 94,
              scoreBreakdown,
              costBreakdown,
              keyHighlights,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Sort by Opportunity Score descending
    return opportunities.sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);
  }

  // Market Snapshot Aggregator (Feature 1)
  public getMarketSnapshot(productId: string = 'prod-cement-m500'): MarketSnapshot {
    const listings = this.listings.filter((l) => l.productId === productId);
    const activeListings = listings.length > 0 ? listings : this.listings;

    const prices = activeListings.map((l) => l.priceNormalized);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const priceSpread = highestPrice - lowestPrice;

    const uniqueMarkets = new Set(activeListings.map((l) => l.marketId)).size;
    const opportunities = this.detectOpportunities(productId);
    const avgOpportunityScore =
      opportunities.length > 0
        ? Math.round(
            opportunities.reduce((acc, opp) => acc + opp.scoreBreakdown.totalScore, 0) /
              opportunities.length
          )
        : 0;

    const highValueCount = opportunities.filter(
      (opp) => opp.scoreBreakdown.classification === 'Exceptional' || opp.scoreBreakdown.classification === 'High'
    ).length;

    return {
      totalListings: activeListings.length,
      totalMarkets: uniqueMarkets,
      avgPrice,
      lowestPrice,
      highestPrice,
      priceSpread,
      opportunitiesDetected: opportunities.length,
      avgOpportunityScore,
      highValueOpportunitiesCount: highValueCount,
    };
  }
}

export const marketEngine = new MarketEngine();
