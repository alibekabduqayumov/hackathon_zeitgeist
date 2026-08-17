export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  standardPackage: string; // e.g. "50kg bag", "1 ton", "sheet"
  standardUnit: string; // e.g. "bag (50kg)", "ton", "sheet", "1000 pcs"
  weightKg: number;
  normalizedName: string;
  description: string;
}

export interface Market {
  id: string;
  name: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  supplyLevel: 'High' | 'Medium' | 'Low';
  hubType: 'Production Hub' | 'Consumer Mega-Market' | 'Regional Trade Hub';
}

export interface Listing {
  id: string;
  productId: string;
  productRawName: string;
  seller: string;
  marketId: string;
  marketName: string;
  priceRaw: number;
  rawUnit: string;
  priceNormalized: number; // standardized per standard unit (e.g. 50kg bag)
  currency: 'UZS';
  quantityAvailable: number;
  minOrder: number;
  source: string;
  timestamp: string;
  deliveryAvailable: boolean;
}

export interface AnomalyReport {
  marketId: string;
  marketName: string;
  avgPrice: number;
  medianPrice: number;
  deviationPercent: number;
  zScore: number;
  anomalyLevel: 'Normal' | 'Moderate Anomaly' | 'High Price Anomaly' | 'Undervalued Supply';
}

export interface DemandSignal {
  productId: string;
  marketId: string;
  currentLevel: 'HIGH' | 'MEDIUM' | 'MODERATE' | 'LOW';
  wowChangePercent: number; // e.g. +18%
  demandScore: number; // 0 - 100
  transactionVelocity: 'Accelerating' | 'Stable' | 'Softening';
  inventoryPressure: 'Deficit' | 'Balanced' | 'Surplus';
}

export interface ArbitrageCostBreakdown {
  purchasePrice: number;
  purchaseUnits: number;
  totalPurchaseCost: number;
  distanceKm: number;
  logisticsCostPerUnit: number;
  totalLogisticsCost: number;
  transactionFeePerUnit: number;
  totalTransactionFees: number;
  handlingCostPerUnit: number;
  totalHandlingCost: number;
  totalCostPerUnit: number;
  totalInvestment: number;
  sellingPricePerUnit: number;
  grossRevenue: number;
  netProfitPerUnit: number;
  totalNetProfit: number;
  roiPercent: number;
  breakEvenSellPrice: number;
}

export interface OpportunityScoreBreakdown {
  profitabilityScore: number; // 35%
  priceAnomalyScore: number;  // 20%
  demandScore: number;        // 20%
  liquidityScore: number;     // 15%
  riskScore: number;          // 10%
  totalScore: number;         // 0 - 100
  classification: 'Exceptional' | 'High' | 'Moderate' | 'Low';
}

export interface Opportunity {
  id: string;
  productId: string;
  productName: string;
  category: string;
  standardUnit: string;
  buyMarketId: string;
  buyMarketName: string;
  buySeller: string;
  buyPrice: number;
  sellMarketId: string;
  sellMarketName: string;
  sellEstimatedPrice: number;
  logisticsCost: number;
  fees: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  distanceKm: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'MODERATE' | 'LOW';
  demandWow: number;
  confidenceScore: number; // e.g. 89%
  productMatchConfidence: number; // e.g. 94%
  scoreBreakdown: OpportunityScoreBreakdown;
  costBreakdown: ArbitrageCostBreakdown;
  keyHighlights: string[];
  explanation?: string;
  createdAt: string;
}

export interface MarketSnapshot {
  totalListings: number;
  totalMarkets: number;
  avgPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceSpread: number;
  opportunitiesDetected: number;
  avgOpportunityScore: number;
  highValueOpportunitiesCount: number;
}

export interface PriceHistoryPoint {
  date: string;
  timestamp: number;
  qarshiPrice: number;
  tashkentPrice: number;
  samarkandPrice: number;
  bukharaPrice: number;
  movingAverage: number;
  regionalMedian: number;
  isAnomaly?: boolean;
  anomalyNote?: string;
}

export interface AIMarketInsight {
  headline: string;
  summary: string;
  marketPressures: {
    market: string;
    product: string;
    type: 'Elevated Demand' | 'Supply Surplus' | 'Logistics Bottleneck' | 'Arbitrage Corridor';
    detail: string;
  }[];
  recommendation: string;
  confidence: number;
  timestamp: string;
}

export type MarketInsight = AIMarketInsight;

export interface SimulationCostBreakdown {
  totalCost: number;
  totalCostPerUnit: number;
  logisticsCost: number;
  logisticsCostPerUnit: number;
  totalRevenue: number;
  sellingPricePerUnit: number;
  totalNetProfit: number;
  netProfitPerUnit: number;
  roiPercent: number;
  breakEvenPrice: number;
}

export interface SimulationResult extends ArbitrageCostBreakdown {
  costBreakdown?: SimulationCostBreakdown;
  opportunityScore?: number;
  viabilityVerdict?: string;
}


export interface ProductMatchResult {
  rawTitle: string;
  matchedProductId: string;
  matchedProductName: string;
  confidence: number;
  category: string;
  standardUnit: string;
  status: 'Same Product (>0.85)' | 'Possible Match (0.70–0.85)' | 'Different Product (<0.70)';
  extractedAttributes: {
    grade?: string;
    weightKg?: number;
    packaging?: string;
    brand?: string;
  };
}
