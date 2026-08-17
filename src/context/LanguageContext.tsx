import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'en';

export interface Translations {
  // Brand & Telemetry
  brandName: string;
  brandTagline: string;
  telemetryActive: string;
  telemetryNode: string;
  latency: string;
  estimatedDisclaimer: string;
  legalDisclaimer: string;
  dataSourceDisclaimer: string;

  // Navigation
  navDashboard: string;
  navOpportunities: string;
  navMarkets: string;
  navProducts: string;
  navSimulator: string;
  navAnalytics: string;
  scanMarketBtn: string;
  scanningText: string;
  listingsCount: string;

  // Search & Categories
  searchPlaceholder: string;
  searchBtn: string;
  quickQuery1: string;
  quickQuery2: string;
  quickQuery3: string;
  quickQuery4: string;
  productCategory: string;
  aiQueryResult: string;
  allCategories: string;
  allProducts: string;
  products: string;
  nlSearchTitle: string;
  nlSearchPlaceholder: string;
  runAiQuery: string;
  suggestedQueries: string;

  // Snapshot Bar
  marketSnapshotTitle: string;
  opportunitiesDetected: string;
  highValueCorridor: string;
  totalListings: string;
  activeDataFeeds: string;
  totalMarkets: string;
  regionalHubs: string;
  avgPrice: string;
  regionalBaseline: string;
  lowestPrice: string;
  depotFloor: string;
  highestPrice: string;
  urbanPeak: string;
  priceSpread: string;
  spreadDelta: string;
  oppRankings: string;
  arbitrageRoutes: string;
  avgScore: string;
  highConviction: string;

  // Dashboard & Visualizations Tabs
  tabInteractiveMap: string;
  tabPriceDispersion: string;
  tabMacroMatrix: string;
  rankedArbitrageTitle: string;
  rankedArbitrageSubtitle: string;
  verifiedOpportunities: string;
  noOpportunities: string;

  // Opportunities View & Pipeline
  pipelineTitle: string;
  pipelineSubtitle: string;
  activeCorridors: string;
  viewAll: string;
  highValueBadge: string;
  arbitrageBadge: string;
  buyLabel: string;
  sellLabel: string;
  freightLabel: string;
  netProfitLabel: string;
  netRoiLabel: string;
  scoreLabel: string;
  whyThisOppBtn: string;
  openDossier: string;
  perUnit: string;
  supplier: string;
  minOrder: string;
  distanceKm: string;
  targetDemand: string;
  confidence: string;
  confidenceScore: string;
  opportunityScore: string;
  estDemandVelocity: string;
  verifiedMatch: string;
  sortBy: string;
  sortByScore: string;
  sortByRoi: string;
  sortByProfit: string;
  sortByDistance: string;
  filterByRegion: string;
  allRegions: string;

  // Dossier Modal
  dossierTitle: string;
  dossierSubtitle: string;
  idLabel: string;
  unitEconomicsWaterfall: string;
  batchSimulatorTitle: string;
  batchSize: string;
  bags: string;
  tons: string;
  totalInvestment: string;
  grossRevenue: string;
  totalNetProfit: string;
  breakEvenPrice: string;
  aiThesisTitle: string;
  aiThesisSubtitle: string;
  generatingAiExplanation: string;
  aiAnalyzing: string;
  scoreBreakdownTitle: string;
  profitabilityScore: string;
  priceAnomalyScore: string;
  demandScore: string;
  liquidityScore: string;
  riskBufferScore: string;
  verificationChecklistTitle: string;
  check1: string;
  check2: string;
  check3: string;
  check4: string;
  copyDossierBtn: string;
  copiedBtn: string;
  closeBtn: string;
  openInSimulator: string;
  tabEconomics: string;
  tabWaterfall: string;
  tabSensitivity: string;
  tabAiAnalysis: string;
  inventoryGlut: string;
  targetRetailWholesale: string;
  unitEconomicsTitle: string;
  purchasePrice: string;
  logisticsFreight: string;
  handlingTerminal: string;
  escrowFee: string;
  totalLandedCost: string;
  projectedSellPrice: string;
  netProfitPerUnit: string;
  weightRoiSpread: string;
  weightDemandVelocity: string;
  weightLogisticsFriction: string;
  weightPriceStability: string;
  execChecklistTitle: string;
  step1LockAllocation: string;
  step1Desc: string;
  step2CharterFreight: string;
  step2Desc: string;
  step3ExecuteSettlement: string;
  step3Desc: string;

  // Visualizations & Maps
  mapTitle: string;
  mapSubtitle: string;
  visualCorridorsTitle: string;
  nodeProductionHub: string;
  nodeConsumerHub: string;
  nodeRegionalHub: string;
  activeRoute: string;
  selectOriginOrDest: string;
  transitCost: string;
  transitDistance: string;
  netSpread: string;
  demandSurge: string;
  supplySurplus: string;
  priceDispersionTitle: string;
  priceDispersionSubtitle: string;
  liquidityQuadTitle: string;
  liquidityQuadSubtitle: string;
  quadrant1: string;
  quadrant2: string;
  quadrant3: string;
  quadrant4: string;
  roiSensitivityTitle: string;
  roiSensitivitySubtitle: string;
  waterfallTitle: string;
  waterfallSubtitle: string;

  // Simulator
  simTitle: string;
  simSubtitle: string;
  selectProduct: string;
  selectCommodity: string;
  tradeVolumeUnits: string;
  originBuyDepot: string;
  buyOrigin: string;
  buyPriceSpot: string;
  sellDestination: string;
  targetSellMarket: string;
  estSellPriceSpot: string;
  orderVolume: string;
  customBuyPrice: string;
  customSellPrice: string;
  freightTariff: string;
  brokerFee: string;
  calculatingSpread: string;
  recalculateSpread: string;
  recalculateBtn: string;
  simResults: string;
  simYieldAnalysis: string;
  landedCostPerUnit: string;
  estNetProfit: string;
  estNetRoi: string;
  netRoiPercent: string;
  marginBuffer: string;

  // Market Comparison Table
  marketComparisonTitle: string;
  marketComparisonSubtitle: string;
  colMarketHub: string;
  colHubType: string;
  colAvgPrice: string;
  colZScore: string;
  colSupply: string;
  colDemand: string;
  colMarketRole: string;
  roleWholesaleOrigin: string;
  roleTargetSink: string;
  roleIntermediate: string;

  // Markets View
  regionalHubsTitle: string;
  regionalHubsSubtitle: string;
  marketsTitle: string;
  marketsSubtitle: string;
  activeNodes: string;
  liveVendorFeeds: string;
  liveVendorFeedsSubtitle: string;
  rawListingString: string;
  rawTitle: string;
  vendorSupplier: string;
  rawPrice: string;
  normalizedPrice: string;
  availableStock: string;
  updatedTime: string;
  distanceMatrixTitle: string;
  freightModelRate: string;
  freightTariffNote: string;
  originDest: string;
  demandLabel: string;
  supplyLabel: string;
  distanceToCapital: string;

  // Products & Matching
  productCatalogTitle: string;
  productCatalogSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  trackedCategories: string;
  standardUnit: string;
  unitWeight: string;
  unitTareWeight: string;
  analyzeSpreadsBtn: string;
  analyzeMarketSpreads: string;
  matchingTesterTitle: string;
  matchingTesterSubtitle: string;
  rawB2BTitle: string;
  canonicalOutput: string;
  aiMatcherTitle: string;
  aiMatcherSubtitle: string;
  testInputPlaceholder: string;
  matchBtn: string;
  matchResultTitle: string;
  matchStatus: string;
  extractedAttributes: string;

  // Analytics & Radar
  priceAnomalyRadarTitle: string;
  priceAnomalyRadarSubtitle: string;
  radarMarketPressure: string;
  radarDemand: string;
  radarSupply: string;
  priceDispersionZScore: string;
  statAnomalyThreshold: string;
  statAnomalyDesc: string;
  anomalyTitle: string;
  anomalySubtitle: string;
  anomaliesFlagged: string;
  pressureRadarTitle: string;
  dispersionZScoreTitle: string;
  demandVelocity: string;
  supplyLiquidity: string;
  zScore: string;
  deviation: string;
  statThresholdNote: string;

  // AI Insights
  aiInsightsTitle: string;
  aiInsightsSubtitle: string;
  macroInsightTitle: string;
  macroInsightSubtitle: string;
  aiConfidence: string;
  strategicRecommendation: string;
  macroPressure: string;

  // Scan Modal
  scanModalTitle: string;
  scanModalSubtitle: string;
  scanPipelineTitle: string;
  scanStep1: string;
  scanStep2: string;
  scanStep3: string;
  scanStep4: string;
  scanStep5: string;
  scanStep1Title: string;
  scanStep1Desc: string;
  scanStep2Title: string;
  scanStep2Desc: string;
  scanStep3Title: string;
  scanStep3Desc: string;
  scanStep4Title: string;
  scanStep4Desc: string;
  scanCompleteTitle: string;
  startScanBtn: string;
}

export const translations: Record<Language, Translations> = {
  uz: {
    // Brand & Telemetry
    brandName: 'ZEITGEIST',
    brandTagline: 'Bozorni faqat kuzatmang. Undagi imkoniyatni ko\'ring.',
    telemetryActive: 'JONLI ARBITRAJ DVIJOKI FAOL',
    telemetryNode: 'O\'ZBEKISTON B2B TUGUNI',
    latency: 'Kechikish: 24ms',
    estimatedDisclaimer: 'Hisoblangan arbitraj imkoniyati — kafolatlangan foyda emas.',
    legalDisclaimer: 'Hisoblangan arbitraj imkoniyati — kafolatlangan sof foyda emas.',
    dataSourceDisclaimer: 'Simulyatsiya qilingan bozor ma\'lumotlari — Jonli ma\'lumot oqimlari integratsiyasi rejalashtirilgan',

    // Navigation
    navDashboard: 'Boshqaruv paneli',
    navOpportunities: 'Arbitraj imkoniyatlari',
    navMarkets: 'Bozorlar & Tugunlar',
    navProducts: 'Mahsulotlar katalogi',
    navSimulator: 'Arbitraj simulyatori',
    navAnalytics: 'Anomaliya radari',
    scanMarketBtn: 'BOZORNI SKANERLASH',
    scanningText: 'SKANERLANMOQDA...',
    listingsCount: '142 TA E\'LON',

    // Search & Categories
    searchPlaceholder: 'Bozor bo\'yicha sun\'iy intellektga savol bering (masalan: "Qarshidan Toshkentga tsement tashish rentabelligi qanday?")...',
    searchBtn: 'AI Qidiruv',
    quickQuery1: 'Qarshi → Toshkent Tsement M500 arbitraji',
    quickQuery2: 'Eng yuqori ROI bo\'yicha top imkoniyatlar',
    quickQuery3: 'Armatura 12mm hududiy spredlari',
    quickQuery4: 'Buxoro gipskarton bozor tahlili',
    productCategory: 'Mahsulot toifasi:',
    aiQueryResult: 'AI Tahlil natijasi:',
    allCategories: 'Barcha toifalar',
    allProducts: 'Barcha mahsulotlar',
    products: 'Mahsulotlar',
    nlSearchTitle: 'TABIIY TILDA BOZOR QIDIRUVI & AI YORDAMCHISI',
    nlSearchPlaceholder: 'Tabiiy tilda savol bering (masalan: "Qarshi omboridan Toshkentga tsement tashish rentabelligi qanday?")...',
    runAiQuery: 'AI So\'rov Yuborish',
    suggestedQueries: 'Tezkor Savollar',

    // Snapshot Bar
    marketSnapshotTitle: 'BOZOR HOLATI',
    opportunitiesDetected: 'ta Imkoniyat topildi',
    highValueCorridor: 'ta Yuqori qiymatli yo\'nalish',
    totalListings: 'E\'lonlar',
    activeDataFeeds: 'Faol ma\'lumot oqimlari',
    totalMarkets: 'Bozorlar',
    regionalHubs: 'Hududiy savdo tugunlari',
    avgPrice: 'O\'rtacha narx',
    regionalBaseline: 'Hududiy o\'rtacha narx',
    lowestPrice: 'Eng past narx',
    depotFloor: 'Ishlab chiqaruvchi bazasi',
    highestPrice: 'Eng yuqori narx',
    urbanPeak: 'Iste\'mol markazi cho\'qqisi',
    priceSpread: 'Narxlar spredi',
    spreadDelta: 'narx farqi',
    oppRankings: 'Imkoniyatlar',
    arbitrageRoutes: 'Arbitraj yo\'nalishlari',
    avgScore: 'O\'rtacha ball',
    highConviction: 'Ishonch darajasi yuqori',

    // Dashboard & Visualizations Tabs
    tabInteractiveMap: 'Savdo Xaritasi',
    tabPriceDispersion: 'Narxlar Dispersiyasi',
    tabMacroMatrix: 'Likvidlik Matritsasi',
    rankedArbitrageTitle: 'REYTING BO\'YICHA ARBITRAJ IMKONIYaTLARI',
    rankedArbitrageSubtitle: 'Marjalar, logistika va talab asosida hisoblangan eng yaxshi yo\'nalishlar',
    verifiedOpportunities: 'ta tasdiqlangan yo\'nalish',
    noOpportunities: 'Ushbu mahsulot bo\'yicha rentabelli arbitraj yo\'nalishi topilmadi.',

    // Opportunities View & Pipeline
    pipelineTitle: 'ARBITRAJ IMKONIYATLARI QUVRi',
    pipelineSubtitle: 'Marjalar, yuk tashish va talab asosida saralangan savdo yo\'nalishlari',
    activeCorridors: 'ta Faol yo\'nalish',
    viewAll: 'Barchasini ko\'rish',
    highValueBadge: 'YUQORI QIYMATLI IMKONIYAT',
    arbitrageBadge: 'BOZOR ARBITRAJI',
    buyLabel: 'XARID',
    sellLabel: 'SOTISH',
    freightLabel: 'Logistika va to\'lovlar',
    netProfitLabel: 'Sof foyda',
    netRoiLabel: 'Sof ROI',
    scoreLabel: 'Zeitgeist Balli',
    whyThisOppBtn: 'Batafsil Tahlil Dosyesi',
    openDossier: 'Dosyeni ochish',
    perUnit: 'birlik uchun',
    supplier: 'Yetkazib beruvchi',
    minOrder: 'Min buyurtma',
    distanceKm: 'Masofa',
    targetDemand: 'Maqsadli talab',
    confidence: 'Ishonchlilik',
    confidenceScore: 'Ishonch darajasi',
    opportunityScore: 'Imkoniyat Balli',
    estDemandVelocity: 'Kutilayotgan Talab Tezligi',
    verifiedMatch: 'Tasdiqlangan Standart Moslik',
    sortBy: 'Saralash',
    sortByScore: 'Saralash: Zeitgeist Balli (Yuqori)',
    sortByRoi: 'Saralash: Sof ROI % (Yuqori)',
    sortByProfit: 'Saralash: Sof Foyda / Birlik (Yuqori)',
    sortByDistance: 'Saralash: Masofa (Qisqa)',
    filterByRegion: 'Viloyat bo\'yicha',
    allRegions: 'Barcha viloyatlar',

    // Dossier Modal
    dossierTitle: 'IMKONIYAT DOSYESI VA AI TAHLILI',
    dossierSubtitle: 'Tahliliy xarajatlar va rentabellik xulosasi',
    idLabel: 'ID raqami',
    unitEconomicsWaterfall: 'Yagona Birlik Iqtisodiyoti (UZS)',
    batchSimulatorTitle: 'Hajmli Partiya Simulyatsiyasi',
    batchSize: 'Partiya hajmi',
    bags: 'qop',
    tons: 'tonna',
    totalInvestment: 'Jami investitsiya',
    grossRevenue: 'Yalpi tushum',
    totalNetProfit: 'Jami sof foyda',
    breakEvenPrice: 'Zararsizlik narxi',
    aiThesisTitle: 'Gemini AI Bozor Tezisi va Sabablar Tahlili',
    aiThesisSubtitle: 'Gemini 3.7 Flash orqali real vaqtdagi fundamental xulosa',
    generatingAiExplanation: 'AI tahlili va sabablari shakllantirilmoqda...',
    aiAnalyzing: 'AI Bozor tahlili bajarilmoqda...',
    scoreBreakdownTitle: 'Zeitgeist Reyting Balli Taqsimoti',
    profitabilityScore: 'Rentabellik (35%)',
    priceAnomalyScore: 'Narx anomaliyasi (20%)',
    demandScore: 'Talab signali (20%)',
    liquidityScore: 'Likvidlik (15%)',
    riskBufferScore: 'Xavf buferi (10%)',
    verificationChecklistTitle: 'Amalga Oshirishdan Oldin Tekshiruv Nazorati',
    check1: 'Yetkazib beruvchi omboridagi aniq mahsulot sertifikati va qadoq holatini tasdiqlang',
    check2: 'Yuk tashuvchi transport vositasi (20t fura) bilan qatnov narxini qat\'iy kelishing',
    check3: 'Xaridor bilan to\'lov shartlari (akkreditiv yoki 30% avans) bo\'yicha shartnoma tuzing',
    check4: 'Ob-havo va yo\'l sharoitlarini tekshirib, 48-72 soat ichida yetkazishni rejalashtiring',
    copyDossierBtn: 'Tahlilni nusxalash',
    copiedBtn: 'Nusxalandi!',
    closeBtn: 'Yopish',
    openInSimulator: 'Simulyatorda sinash',
    tabEconomics: 'Birlik Iqtisodiyoti',
    tabWaterfall: 'Xarajatlar Sharsharasi',
    tabSensitivity: 'ROI Sezgirligi',
    tabAiAnalysis: 'AI Tezis & Xulosasi',
    inventoryGlut: 'Ishlab chiqaruvchi bazasi / Taklif ko\'p',
    targetRetailWholesale: 'Iste\'mol markazi / Yuqori narx',
    unitEconomicsTitle: 'BITIM TANNARXI TARKIBI (1 BIRLIK UCHUN)',
    purchasePrice: 'Xarid Narxi (Bazada):',
    logisticsFreight: 'Fura Yuk Tashish Xarajati:',
    handlingTerminal: 'Ombor & Yuklash Terminali:',
    escrowFee: 'Brokerlik & Hisob-kitob (1%):',
    totalLandedCost: 'Yetkazilgan Tannarx:',
    projectedSellPrice: 'Kutilgan Sotish Narxi:',
    netProfitPerUnit: 'Birlikdan Sof Foyda:',
    weightRoiSpread: 'Sof Rentabellik (35%)',
    weightDemandVelocity: 'Talab jadalligi (20%)',
    weightLogisticsFriction: 'Logistika yengilligi (15%)',
    weightPriceStability: 'Narx barqarorligi buferi (10%)',
    execChecklistTitle: 'Bitimni amalga oshirish tekshiruv ro\'yxati',
    step1LockAllocation: '1. Yetkazib beruvchi bilan hajm va narxni band qiling',
    step1Desc: 'Ishlab chiqaruvchi bazasidagi zaxira va qadoq holatini tasdiqlang',
    step2CharterFreight: '2. 20t fura yuk mashinasini rejalashtiring',
    step2Desc: 'Yo\'l tarifi va yetib borish vaqtini qat\'iy tasdiqlang',
    step3ExecuteSettlement: '3. Xaridor bilan to\'lov shartnomasini imzolang',
    step3Desc: 'Yetib borganidan so\'ng qabul qilish akti va yakuniy hisob-kitob',

    // Visualizations & Maps
    mapTitle: 'O\'ZBEKISTON HUDUDIY SAVDO VA ARBITRAJ XARITASI',
    mapSubtitle: 'Ishlab chiqarish tugunlaridan yirik iste\'mol markazlariga tovar oqimlari va narxlar spredi',
    visualCorridorsTitle: 'FAOL ARBITRAJ KORIDORLARI VA OQIMLAR',
    nodeProductionHub: 'Ishlab chiqarish bazasi',
    nodeConsumerHub: 'Iste\'mol markazi',
    nodeRegionalHub: 'Hududiy savdo tuguni',
    activeRoute: 'Tanlangan yo\'nalish',
    selectOriginOrDest: 'Tugun yoki koridorni bosing',
    transitCost: 'Transport xarajati',
    transitDistance: 'Yo\'l masofasi',
    netSpread: 'Sof spred',
    demandSurge: 'Talab yuqori',
    supplySurplus: 'Taklif ko\'p',
    priceDispersionTitle: 'HUDUDLAR BO\'YICHA NARXLAR DISPERSIYASI',
    priceDispersionSubtitle: 'O\'rtacha narx, minimal xarid va maksimal sotish oralig\'i',
    liquidityQuadTitle: 'LIKVIDLIK VA TALAB MATRITASI',
    liquidityQuadSubtitle: 'Bozorlarning taklif hajmi va talab tezligi bo\'yicha joylashuvi',
    quadrant1: 'I-Kvadrat: Yuqori Rentabelli Arbitraj',
    quadrant2: 'II-Kvadrat: Kuchli Talab / Tanqislik',
    quadrant3: 'III-Kvadrat: Kam Harakatli Bozor',
    quadrant4: 'IV-Kvadrat: Ortiqcha Taklif / Arzon Baza',
    roiSensitivityTitle: 'LOGISTIKA VA NARXGA BOG\'LIQ ROI SEZGIRLIGI',
    roiSensitivitySubtitle: 'Transport xarajatlari o\'zgarganda sof marja qanday o\'zgaradi',
    waterfallTitle: 'XARAJATLAR SHARSHARASI VA MARJA',
    waterfallSubtitle: 'Xarid narxidan yakuniy sotish narxigacha bo\'lgan bosqichma-bosqich tarkib',

    // Simulator
    simTitle: 'INTERAKTIV ARBITRAJ SIMULYATORI',
    simSubtitle: 'Haqiqiy logistika, to\'lovlar va partiya hajmini hisoblash qumloq maydoni',
    selectProduct: 'Mahsulotni tanlang',
    selectCommodity: 'Mahsulot / Tovarni tanlang',
    tradeVolumeUnits: 'Partiya hajmi (birlikda)',
    buyOrigin: 'Xarid bozori (Manba)',
    originBuyDepot: 'Xarid bozori (Manba ombor)',
    buyPriceSpot: 'Xarid narxi (Spot UZS)',
    sellDestination: 'Sotish bozori (Maqsad)',
    targetSellMarket: 'Sotish bozori (Iste\'mol markazi)',
    estSellPriceSpot: 'Kutilgan sotish narxi (UZS)',
    orderVolume: 'Buyurtma hajmi (birlikda)',
    customBuyPrice: 'Xarid narxi (UZS)',
    customSellPrice: 'Kutilgan sotish narxi (UZS)',
    freightTariff: 'Logistika tarifi (UZS/kg/km)',
    brokerFee: 'Tranzaksiya va brokerlik to\'lovi (%)',
    calculatingSpread: 'Spred hisoblanmoqda...',
    recalculateSpread: 'Spredni qayta hisoblash',
    recalculateBtn: 'Qayta hisoblash',
    simResults: 'Hisob-kitob natijalari',
    simYieldAnalysis: 'Rentabellik & Xarajatlar Tahlili',
    landedCostPerUnit: 'Yetkazilgan tannarx (birligi)',
    estNetProfit: 'Kutilayotgan sof foyda',
    estNetRoi: 'Sof rentabellik (ROI)',
    netRoiPercent: 'Sof Rentabellik (ROI %)',
    marginBuffer: 'Zararsizlik xavfsizlik buferi',

    // Market Comparison Table
    marketComparisonTitle: 'HUDUDIY NARXLAR VA DISPERSIYA TAHLILI',
    marketComparisonSubtitle: 'Z-score og\'ishlari, taklif-talab signallari va hududiy rollar',
    colMarketHub: 'Bozor / Tugun',
    colHubType: 'Tugun Turi',
    colAvgPrice: 'O\'rtacha Narx',
    colZScore: 'Z-Score',
    colSupply: 'Taklif',
    colDemand: 'Talab',
    colMarketRole: 'Arbitrajdagi Roli',
    roleWholesaleOrigin: 'Xarid Manbasi (Arzon)',
    roleTargetSink: 'Sotish Markazi (Qimmat)',
    roleIntermediate: 'Oraliq Bozor',

    // Markets View
    regionalHubsTitle: 'HUDUDIY SAVDO TUGUNLARI VA LOGISTIKA KORIDORLARI',
    regionalHubsSubtitle: 'O\'zbekistonning asosiy sanoat ishlab chiqarish va iste\'mol markazlari qamrovi',
    marketsTitle: 'HUDUDIY SAVDO TUGUNLARI VA LOGISTIKA KORIDORLARI',
    marketsSubtitle: 'O\'zbekistonning asosiy sanoat ishlab chiqarish va iste\'mol markazlari qamrovi',
    activeNodes: 'Faol tugunlar',
    liveVendorFeeds: 'JONLI YETKAZIB BERUVCHILAR E\'LONLARI:',
    liveVendorFeedsSubtitle: 'Standartlashtirilgan o\'lchov birliklariga keltirilgan rasmiy takliflar',
    rawListingString: 'E\'lonning asl nomi',
    rawTitle: 'Xom E\'lon Matni',
    vendorSupplier: 'Yetkazib beruvchi / Firma',
    rawPrice: 'Asl narx',
    normalizedPrice: 'Standart narx',
    availableStock: 'Mavjud zaxira',
    updatedTime: 'Yangilangan vaqti',
    distanceMatrixTitle: 'HUDUDLARARO AVTOMOBIL YO\'LI MASOFA MATRITASI (KM)',
    freightModelRate: 'Logistika modeli: 0.17 UZS / kg / km',
    freightTariffNote: 'Yuk tashish tarifi: 0.17 UZS / kg / km',
    originDest: 'Chiqish \\ Yetib borish',
    demandLabel: 'Talab',
    supplyLabel: 'Taklif',
    distanceToCapital: 'Poytaxtgacha masofa',

    // Products & Matching
    productCatalogTitle: 'STANDARTLASHTIRILGAN B2B MAHSULOTLAR KATALOGI',
    productCatalogSubtitle: 'Turli yetkazib beruvchilarning nomutanosib nomlarini yagona standartga birlashtirish',
    productsTitle: 'STANDARTLASHTIRILGAN B2B MAHSULOTLAR KATALOGI',
    productsSubtitle: 'Turli yetkazib beruvchilarning nomutanosib nomlarini yagona standartga birlashtirish',
    trackedCategories: 'Kuzatuvdagi toifalar',
    standardUnit: 'Standart birlik',
    unitWeight: 'Birlik og\'irligi',
    unitTareWeight: 'Birlik sof og\'irligi',
    analyzeSpreadsBtn: 'Bozor spredlarini tahlil qilish',
    analyzeMarketSpreads: 'Bozor spredlarini tahlil qilish',
    matchingTesterTitle: 'AI NOMENKLATURA MOSLASHTIRUVCHISI',
    matchingTesterSubtitle: 'Turli yetkazib beruvchilarning xom e\'lonlarini yagona kanonik mahsulotga moslashtirish',
    rawB2BTitle: 'XOM B2B E\'LON MATNI (TEST)',
    canonicalOutput: 'Kanonik Chiqish',
    aiMatcherTitle: 'SUN\'IY INTELLEKT MAHSULOT MOSLASHTIRUVCHISI',
    aiMatcherSubtitle: 'Yetkazib beruvchilarning tushunarsiz nomlarini standart mahsulot modeliga solishtiring',
    testInputPlaceholder: 'Xom e\'lon matnini kiriting (masalan: "Tsement M-500 Kizilqum 50kg qopda yetkazib berish bilan")...',
    matchBtn: 'Moslikni tekshirish',
    matchResultTitle: 'Moslashtirish tahlili natijasi',
    matchStatus: 'Moslik holati',
    extractedAttributes: 'Ajratib olingan parametrlar',

    // Analytics & Radar
    priceAnomalyRadarTitle: 'NARX ANOMALIYASI VA LIKVIDLIK RADARI',
    priceAnomalyRadarSubtitle: 'Z-score narxlar taqsimoti, taklif-talab tafovuti va hududiy arbitraj bosimi',
    radarMarketPressure: 'HUDUDIY BOZOR BOSIMI RADARI',
    radarDemand: 'Talab tezligi',
    radarSupply: 'Taklif likvidligi',
    priceDispersionZScore: 'NARXLAR DISPERSIYASI VA Z-SCORE ANOMALIYALARI',
    statAnomalyThreshold: 'Statistik anomaliya chegarasi',
    statAnomalyDesc: 'Z-score +1.50 dan yuqori yoki -1.20 dan past bo\'lgan bozorlar avtomatik arbitraj yo\'nalishini hosil qiladi.',
    anomalyTitle: 'NARX ANOMALIYASI VA LIKVIDLIK RADARI',
    anomalySubtitle: 'Z-score narxlar taqsimoti, taklif-talab tafovuti va hududiy arbitraj bosimi',
    anomaliesFlagged: 'ta Anomaliya aniqlangan',
    pressureRadarTitle: 'HUDUDIY BOZOR BOSIMI RADARI',
    dispersionZScoreTitle: 'NARXLAR DISPERSIYASI VA Z-SCORE KO\'RSATKICHLARI',
    demandVelocity: 'Talab tezligi',
    supplyLiquidity: 'Taklif likvidligi',
    zScore: 'Z-Ko\'rsatkich',
    deviation: 'O\'rtachadan og\'ish',
    statThresholdNote: 'Statistik anomaliya chegarasi: Z-score +1.50 dan yuqori yoki -1.20 dan past bo\'lgan bozorlar avtomatik arbitraj yo\'nalishini hosil qiladi.',

    // AI Insights
    aiInsightsTitle: 'GEMINI 3.7 AI BOZOR INTELLIGENSIYASI',
    aiInsightsSubtitle: 'Hududlararo narx tafovutlari va dinamik talab oqimlarining sun\'iy intellekt sintezi',
    macroInsightTitle: 'GEMINI 3.7 FLASH BOZOR INTELLIGENSIYASI',
    macroInsightSubtitle: 'O\'zbekiston hududiy bozorlari bo\'yicha sun\'iy intellekt xulosalari va tavsiyalari',
    aiConfidence: 'AI Ishonchlilik',
    strategicRecommendation: 'Xarid strategiyasi bo\'yicha tavsiya',
    macroPressure: 'Hududiy bozor bosimlari',

    // Scan Modal
    scanModalTitle: 'Bozor Tahlili Skaneri',
    scanModalSubtitle: 'Barcha hududiy birjalar va yetkazib beruvchilar tekshirilmoqda',
    scanPipelineTitle: 'BOZOR MA\'LUMOTLARINI SKANERLASH VA TAHLIL QILISH',
    scanStep1: 'Yetkazib beruvchilarning xom e\'lonlarini qabul qilish va tozalash',
    scanStep2: 'Sun\'iy intellekt orqali yagona standart birliklarga keltirish',
    scanStep3: 'Hududlararo narx anomaliyalari va Z-score og\'ishlarini aniqlash',
    scanStep4: 'Haqiqiy yo\'l masofasi bo\'yicha logistika va to\'lovlarni hisoblash',
    scanStep5: 'Rentabellik va xavf mezonlari bo\'yicha Zeitgeist reytingini tuzish',
    scanStep1Title: 'Xom Ma\'lumotlarni Qabul Qilish',
    scanStep1Desc: '6 ta hududiy birja va vendorlardan e\'lonlar to\'planmoqda',
    scanStep2Title: 'Nomenklaturani Standartlashtirish',
    scanStep2Desc: 'Fuzzy matching va AI orqali birliklar bir xil standartga keltirilmoqda',
    scanStep3Title: 'Z-Score va Anomaliyalarni Hisoblash',
    scanStep3Desc: 'Hududlararo narx farqlari va chetlanishlar aniqlanmoqda',
    scanStep4Title: 'Logistika va Zeitgeist Reytingi',
    scanStep4Desc: 'Fura tarifi, masofa va xavflar hisoblanib, eng yaxshi yo\'nalishlar tuzilmoqda',
    scanCompleteTitle: 'Skanerlash muvaffaqiyatli yakunlandi!',
    startScanBtn: 'Skanerlashni boshlash',
  },
  en: {
    // Brand & Telemetry
    brandName: 'ZEITGEIST',
    brandTagline: "Don't just see the market. See the opportunity.",
    telemetryActive: 'LIVE ARBITRAGE ENGINE ACTIVE',
    telemetryNode: 'UZBEKISTAN B2B NODE',
    latency: 'Latency: 24ms',
    estimatedDisclaimer: 'Estimated opportunity — not guaranteed profit.',
    legalDisclaimer: 'Estimated opportunity — not guaranteed profit.',
    dataSourceDisclaimer: 'Simulated Market Data — Live Feed Integration Planned',

    // Navigation
    navDashboard: 'Dashboard',
    navOpportunities: 'Opportunities',
    navMarkets: 'Markets & Hubs',
    navProducts: 'Products Catalog',
    navSimulator: 'Arbitrage Simulator',
    navAnalytics: 'Anomaly Radar',
    scanMarketBtn: 'SCAN MARKET',
    scanningText: 'SCANNING MARKETS...',
    listingsCount: '142 LISTINGS',

    // Search & Categories
    searchPlaceholder: 'Ask market AI a trading or procurement question (e.g., "What is the net spread moving Cement from Qarshi to Tashkent?")...',
    searchBtn: 'AI Query',
    quickQuery1: 'Cement M500 Qarshi → Tashkent arbitrage',
    quickQuery2: 'Top opportunities ranked by Net ROI',
    quickQuery3: 'Rebar 12mm regional price spreads',
    quickQuery4: 'Bukhara Gypsum Board market analysis',
    productCategory: 'Product Category:',
    aiQueryResult: 'AI Query Result:',
    allCategories: 'All Categories',
    allProducts: 'All Products',
    products: 'Products',
    nlSearchTitle: 'NATURAL LANGUAGE MARKET SEARCH & AI ASSISTANT',
    nlSearchPlaceholder: 'Ask in plain language (e.g. "What is the net spread moving cement from Qarshi depot to Tashkent?")...',
    runAiQuery: 'Run AI Query',
    suggestedQueries: 'Suggested Queries',

    // Snapshot Bar
    marketSnapshotTitle: 'MARKET SNAPSHOT',
    opportunitiesDetected: 'Opportunities Detected',
    highValueCorridor: 'High-Value Arbitrage Corridor',
    totalListings: 'Listings',
    activeDataFeeds: 'Active data feeds',
    totalMarkets: 'Markets',
    regionalHubs: 'Regional hubs',
    avgPrice: 'Avg Price',
    regionalBaseline: 'Regional baseline',
    lowestPrice: 'Lowest',
    depotFloor: 'Depot supply floor',
    highestPrice: 'Highest',
    urbanPeak: 'Urban sink peak',
    priceSpread: 'Price Spread',
    spreadDelta: 'delta',
    oppRankings: 'Opportunities',
    arbitrageRoutes: 'Arbitrage routes',
    avgScore: 'Avg Score',
    highConviction: 'High conviction',

    // Dashboard & Visualizations Tabs
    tabInteractiveMap: 'Interactive Trade Map',
    tabPriceDispersion: 'Price Dispersion',
    tabMacroMatrix: 'Liquidity Matrix',
    rankedArbitrageTitle: 'RANKED ARBITRAGE OPPORTUNITIES',
    rankedArbitrageSubtitle: 'Ranked cross-market trade opportunities scored deterministically on margins, freight, and demand',
    verifiedOpportunities: 'viable routes',
    noOpportunities: 'No viable arbitrage corridors detected for this product specification.',

    // Opportunities View & Pipeline
    pipelineTitle: 'ARBITRAGE OPPORTUNITY PIPELINE',
    pipelineSubtitle: 'Ranked cross-market trade opportunities scored deterministically on margins, freight, and demand',
    activeCorridors: 'Active Corridors',
    viewAll: 'View All',
    highValueBadge: 'HIGH-VALUE OPPORTUNITY',
    arbitrageBadge: 'MARKET ARBITRAGE',
    buyLabel: 'BUY',
    sellLabel: 'SELL',
    freightLabel: 'Logistics & Fees',
    netProfitLabel: 'Net Profit',
    netRoiLabel: 'Net ROI',
    scoreLabel: 'Zeitgeist Score',
    whyThisOppBtn: 'Why This Opportunity? Dossier',
    openDossier: 'Open Dossier',
    perUnit: 'per',
    supplier: 'Supplier',
    minOrder: 'Min Order',
    distanceKm: 'Distance',
    targetDemand: 'Target Demand',
    confidence: 'Confidence',
    confidenceScore: 'Confidence',
    opportunityScore: 'Opportunity Score',
    estDemandVelocity: 'Est. Demand Velocity',
    verifiedMatch: 'Standard Spec Normalizer',
    sortBy: 'Sort By',
    sortByScore: 'Sort: Zeitgeist Score (Highest)',
    sortByRoi: 'Sort: Net ROI % (Highest)',
    sortByProfit: 'Sort: Net Profit / Unit (Highest)',
    sortByDistance: 'Sort: Transit Distance (Shortest)',
    filterByRegion: 'Filter By Region',
    allRegions: 'All Regions',

    // Dossier Modal
    dossierTitle: 'OPPORTUNITY DOSSIER & AI ANALYSIS',
    dossierSubtitle: 'Granular landed cost waterfall & structural reasoning',
    idLabel: 'ID',
    unitEconomicsWaterfall: 'Single Unit Economics (UZS)',
    batchSimulatorTitle: 'Scalable Batch Volume Simulation',
    batchSize: 'Batch Volume',
    bags: 'bags',
    tons: 'tons',
    totalInvestment: 'Total Investment',
    grossRevenue: 'Gross Revenue',
    totalNetProfit: 'Total Net Profit',
    breakEvenPrice: 'Break-Even Sell Price',
    aiThesisTitle: 'Gemini AI Structural Thesis & Reasoned Breakdown',
    aiThesisSubtitle: 'Real-time structural reasoning generated by Gemini 3.7 Flash',
    generatingAiExplanation: 'Generating analytical breakdown with Gemini AI...',
    aiAnalyzing: 'AI Reasoning in progress...',
    scoreBreakdownTitle: 'Zeitgeist Opportunity Score Breakdown',
    profitabilityScore: 'Profitability (35%)',
    priceAnomalyScore: 'Price Anomaly (20%)',
    demandScore: 'Demand Signal (20%)',
    liquidityScore: 'Liquidity (15%)',
    riskBufferScore: 'Risk Buffer (10%)',
    verificationChecklistTitle: 'Pre-Execution Operational Checklist',
    check1: 'Verify supplier batch test certificates (GOST 10178) and physical packaging integrity',
    check2: 'Lock in 20-ton flatbed transport freight contract prior to purchase dispatch',
    check3: 'Confirm off-taker payment guarantee (30% advance or bank escrow) in target market',
    check4: 'Monitor weather/pass conditions for 48-72 hour transit execution window',
    copyDossierBtn: 'Copy Trade Dossier',
    copiedBtn: 'Copied!',
    closeBtn: 'Close',
    openInSimulator: 'Open in Sandbox Simulator',
    tabEconomics: 'Unit Economics',
    tabWaterfall: 'Cost Waterfall',
    tabSensitivity: 'ROI Sensitivity',
    tabAiAnalysis: 'AI Thesis & Reasoning',
    inventoryGlut: 'Manufacturing Depot / Supply Surplus',
    targetRetailWholesale: 'Consumer Hub / Elevated Demand',
    unitEconomicsTitle: 'PER-UNIT LANDED COST WATERFALL',
    purchasePrice: 'Purchase Price (Depot):',
    logisticsFreight: 'Inter-City Freight Transit:',
    handlingTerminal: 'Depot & Terminal Handling:',
    escrowFee: 'Brokerage & Escrow (1%):',
    totalLandedCost: 'Total Landed Cost:',
    projectedSellPrice: 'Projected Target Sell Price:',
    netProfitPerUnit: 'Net Profit per Unit:',
    weightRoiSpread: 'Net Margin Spread (35%)',
    weightDemandVelocity: 'Demand Velocity (20%)',
    weightLogisticsFriction: 'Logistics Friction (15%)',
    weightPriceStability: 'Price Stability Buffer (10%)',
    execChecklistTitle: 'Execution Checklist',
    step1LockAllocation: '1. Lock Supplier Allocation',
    step1Desc: 'Verify depot yard physical stock and quality certificate',
    step2CharterFreight: '2. Charter 20t Flatbed Freight',
    step2Desc: 'Confirm driver transit window and fuel price surcharge',
    step3ExecuteSettlement: '3. Execute Escrow & Final Settlement',
    step3Desc: 'Deliver to off-taker with stamped bill of lading',

    // Visualizations & Maps
    mapTitle: 'UZBEKISTAN REGIONAL TRADE & ARBITRAGE MAP',
    mapSubtitle: 'Live logistics corridors, spatial price differentials, and inter-city trade flow vectors',
    visualCorridorsTitle: 'ACTIVE ARBITRAGE CORRIDORS & TRANSIT FLOWS',
    nodeProductionHub: 'Production Depot',
    nodeConsumerHub: 'Consumer Mega-Market',
    nodeRegionalHub: 'Regional Trade Hub',
    activeRoute: 'Active Route Corridor',
    selectOriginOrDest: 'Click any node or corridor to inspect unit economics',
    transitCost: 'Freight Transit',
    transitDistance: 'Road Distance',
    netSpread: 'Net Landed Spread',
    demandSurge: 'High Demand',
    supplySurplus: 'High Supply',
    priceDispersionTitle: 'REGIONAL PRICE DISPERSION & SPREAD BANDS',
    priceDispersionSubtitle: 'Regional median baseline, minimum depot floor, and maximum urban sink ranges',
    liquidityQuadTitle: 'SUPPLY LIQUIDITY VS. DEMAND VELOCITY MATRIX',
    liquidityQuadSubtitle: 'Quadrant classification of regional markets based on supply volume and weekly demand velocity',
    quadrant1: 'Quadrant I: High Liquidity Arbitrage Corridor',
    quadrant2: 'Quadrant II: Severe Deficit / Urban Demand Peak',
    quadrant3: 'Quadrant III: Illiquid Regional Market',
    quadrant4: 'Quadrant IV: Depressed Supply / Surplus Depot',
    roiSensitivityTitle: 'FREIGHT LOGISTICS & PRICE ROI SENSITIVITY',
    roiSensitivitySubtitle: 'How net ROI responds to diesel rate shifts and selling price fluctuations',
    waterfallTitle: 'LANDED COST WATERFALL & MARGIN STRUCTURE',
    waterfallSubtitle: 'Granular step breakdown from origin purchase to final destination realization',

    // Simulator
    simTitle: 'INTERACTIVE ARBITRAGE SIMULATOR',
    simSubtitle: 'Real-world logistics, handling, and batch margin calculation sandbox',
    selectProduct: 'Select Product',
    selectCommodity: 'Select Commodity / Product',
    tradeVolumeUnits: 'Trade Batch Volume (Units)',
    buyOrigin: 'Origin Market (Buy Depot)',
    originBuyDepot: 'Origin Market (Buy Depot)',
    buyPriceSpot: 'Depot Wholesale Price (Spot UZS)',
    sellDestination: 'Destination Market (Sell Sink)',
    targetSellMarket: 'Destination Market (Target Sink)',
    estSellPriceSpot: 'Estimated Target Sell Price (Spot UZS)',
    orderVolume: 'Order Volume (Units)',
    customBuyPrice: 'Wholesale Buy Price (UZS)',
    customSellPrice: 'Target Sell Price (UZS)',
    freightTariff: 'Logistics Tariff (UZS/kg/km)',
    brokerFee: 'Transaction & Broker Fee (%)',
    calculatingSpread: 'Calculating spread...',
    recalculateSpread: 'Recalculate Unit Economics',
    recalculateBtn: 'Recalculate Unit Economics',
    simResults: 'Simulation Results',
    simYieldAnalysis: 'Yield & Cost Structure Analysis',
    landedCostPerUnit: 'Total Landed Cost / Unit',
    estNetProfit: 'Estimated Net Profit',
    estNetRoi: 'Estimated Net ROI',
    netRoiPercent: 'Net ROI Percentage (%)',
    marginBuffer: 'Breakeven Safety Buffer',

    // Market Comparison Table
    marketComparisonTitle: 'REGIONAL PRICE & SPREAD COMPARISON',
    marketComparisonSubtitle: 'Z-score anomalies, supply-demand signals, and market roles',
    colMarketHub: 'Regional Market Hub',
    colHubType: 'Hub Type',
    colAvgPrice: 'Avg Price (UZS)',
    colZScore: 'Z-Score',
    colSupply: 'Supply',
    colDemand: 'Demand',
    colMarketRole: 'Market Role',
    roleWholesaleOrigin: 'Wholesale Origin (Buy)',
    roleTargetSink: 'Target Sink (Sell)',
    roleIntermediate: 'Intermediate Hub',

    // Markets View
    regionalHubsTitle: 'REGIONAL TRADE HUBS & LOGISTICS CORRIDORS',
    regionalHubsSubtitle: 'Coverage across major industrial manufacturing bases and consumption sinks in Uzbekistan',
    marketsTitle: 'REGIONAL TRADE HUBS & LOGISTICS CORRIDORS',
    marketsSubtitle: 'Coverage across major industrial manufacturing bases and consumption sinks in Uzbekistan',
    activeNodes: 'Active Nodes',
    liveVendorFeeds: 'LIVE VENDOR FEEDS IN',
    liveVendorFeedsSubtitle: 'Verified wholesale supplier listings with normalized unit metrics',
    rawListingString: 'Raw Listing String',
    rawTitle: 'Raw Listing String',
    vendorSupplier: 'Vendor / Supplier',
    rawPrice: 'Raw Price',
    normalizedPrice: 'Normalized Standard Price',
    availableStock: 'Available Stock',
    updatedTime: 'Updated',
    distanceMatrixTitle: 'ROAD TRANSIT DISTANCE MATRIX (KM)',
    freightModelRate: 'Freight Model: 0.17 UZS / kg / km',
    freightTariffNote: 'Freight Model: 0.17 UZS / kg / km',
    originDest: 'Origin \\ Dest',
    demandLabel: 'Demand',
    supplyLabel: 'Supply',
    distanceToCapital: 'Distance to Capital',

    // Products & Matching
    productCatalogTitle: 'STANDARDIZED B2B PRODUCT CATALOG',
    productCatalogSubtitle: 'Unified product models mapped from fragmented supplier nomenclature',
    productsTitle: 'STANDARDIZED B2B PRODUCT CATALOG',
    productsSubtitle: 'Unified product models mapped from fragmented supplier nomenclature',
    trackedCategories: 'Tracked Categories',
    standardUnit: 'Standard Unit',
    unitWeight: 'Unit Tare Weight',
    unitTareWeight: 'Unit Tare Weight',
    analyzeSpreadsBtn: 'Analyze Market Spreads',
    analyzeMarketSpreads: 'Analyze Market Spreads',
    matchingTesterTitle: 'PRODUCT MATCHING AI ENGINE',
    matchingTesterSubtitle: 'Test how messy vendor catalog nomenclature is matched to standardized specifications',
    rawB2BTitle: 'RAW B2B LISTING STRING (INPUT TEST)',
    canonicalOutput: 'Canonical Output',
    aiMatcherTitle: 'PRODUCT MATCHING AI ENGINE',
    aiMatcherSubtitle: 'Test how messy vendor catalog nomenclature is matched to standardized specifications',
    testInputPlaceholder: 'Enter raw seller listing text (e.g. "Portland Cement M-500 Kizilqum 50kg bag with delivery")...',
    matchBtn: 'Test AI Matcher',
    matchResultTitle: 'Matching Analysis Result',
    matchStatus: 'Match Status',
    extractedAttributes: 'Extracted Attributes',

    // Analytics & Radar
    priceAnomalyRadarTitle: 'PRICE ANOMALY DETECTION & LIQUIDITY RADAR',
    priceAnomalyRadarSubtitle: 'Z-score price distribution, supply-demand divergence, and regional arbitrage pressure',
    radarMarketPressure: 'REGIONAL MARKET PRESSURE RADAR',
    radarDemand: 'Demand Velocity',
    radarSupply: 'Supply Liquidity',
    priceDispersionZScore: 'PRICE DISPERSION & Z-SCORE ANOMALIES',
    statAnomalyThreshold: 'Statistical Anomaly Threshold',
    statAnomalyDesc: 'Z-scores exceeding +1.50 or -1.20 trigger automated arbitrage routing pipelines.',
    anomalyTitle: 'PRICE ANOMALY DETECTION & LIQUIDITY RADAR',
    anomalySubtitle: 'Z-score price distribution, supply-demand divergence, and regional arbitrage pressure',
    anomaliesFlagged: 'Anomalies Flagged',
    pressureRadarTitle: 'REGIONAL MARKET PRESSURE RADAR',
    dispersionZScoreTitle: 'PRICE DISPERSION & Z-SCORE ANOMALIES',
    demandVelocity: 'Demand Velocity',
    supplyLiquidity: 'Supply Liquidity',
    zScore: 'Z-Score',
    deviation: 'Deviation',
    statThresholdNote: 'Statistical Anomaly Threshold: Z-scores exceeding +1.50 or -1.20 trigger automated arbitrage routing pipelines.',

    // AI Insights
    aiInsightsTitle: 'GEMINI 3.7 AI MARKET INTELLIGENCE',
    aiInsightsSubtitle: 'Real-time synthesis of regional price divergence and demand momentum',
    macroInsightTitle: 'GEMINI 3.7 FLASH MACRO INTELLIGENCE',
    macroInsightSubtitle: 'AI-synthesized regional liquidity dynamics and procurement recommendations for Uzbekistan',
    aiConfidence: 'AI Confidence',
    strategicRecommendation: 'Strategic Procurement Recommendation',
    macroPressure: 'Regional Market Pressures',

    // Scan Modal
    scanModalTitle: 'Market Intelligence Pipeline Scan',
    scanModalSubtitle: 'Auditing 6 regional wholesale exchanges and vendor databases',
    scanPipelineTitle: 'MARKET INTELLIGENCE SCAN PIPELINE',
    scanStep1: 'Ingesting and deduplicating raw supplier feeds across 6 regional exchanges',
    scanStep2: 'Normalizing product nomenclature and packaging specifications via AI embeddings',
    scanStep3: 'Computing cross-market price dispersion, standard deviations, and Z-scores',
    scanStep4: 'Simulating inter-city road logistics landed costs and freight margins',
    scanStep5: 'Ranking arbitrage corridors via weighted Zeitgeist Opportunity Score',
    scanStep1Title: 'Data Feed Ingestion',
    scanStep1Desc: 'Pulling 142 raw listings across 6 regional depots and markets',
    scanStep2Title: 'Nomenclature Normalization',
    scanStep2Desc: 'Extracting canonical grades, brands, and standard packaging units',
    scanStep3Title: 'Z-Score Anomaly Detection',
    scanStep3Desc: 'Calculating price standard deviations and cross-market spreads',
    scanStep4Title: 'Logistics Landed Cost & Scoring',
    scanStep4Desc: 'Modeling freight rates, broker fees, and calculating Zeitgeist Opportunity Scores',
    scanCompleteTitle: 'Market Scan Complete!',
    startScanBtn: 'Initiate Full Market Scan',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zeitgeist_lang');
    return saved === 'uz' || saved === 'en' ? saved : 'uz'; // Default to Uzbek as requested
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zeitgeist_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
