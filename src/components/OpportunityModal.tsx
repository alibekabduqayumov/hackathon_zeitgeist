import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ProfitWaterfallChart } from './visualizations/ProfitWaterfallChart';
import { RoiSensitivityChart } from './visualizations/RoiSensitivityChart';
import {
  X,
  Sparkles,
  TrendingUp,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calculator,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  Info,
  DollarSign,
  Activity,
  Check,
} from 'lucide-react';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onSimulate?: (opp: Opportunity) => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  onClose,
  onSimulate,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'waterfall' | 'ai-thesis' | 'sensitivity'>('overview');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (opportunity) {
      fetchAiExplanation();
    } else {
      setAiExplanation(null);
    }
  }, [opportunity, language]);

  if (!opportunity) return null;

  const fetchAiExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity, language }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || null);
    } catch (err) {
      console.error('Failed to fetch explanation:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const cost = opportunity.costBreakdown || {
    purchasePrice: opportunity.buyPrice || 0,
    purchaseUnits: 400,
    totalPurchaseCost: (opportunity.buyPrice || 0) * 400,
    distanceKm: opportunity.distanceKm || 300,
    logisticsCostPerUnit: opportunity.logisticsCost || 0,
    totalLogisticsCost: (opportunity.logisticsCost || 0) * 400,
    transactionFeePerUnit: opportunity.fees || 0,
    totalTransactionFees: (opportunity.fees || 0) * 400,
    handlingCostPerUnit: 0,
    totalHandlingCost: 0,
    totalCostPerUnit: opportunity.totalCost || (opportunity.buyPrice + opportunity.logisticsCost) || 0,
    totalInvestment: (opportunity.totalCost || 0) * 400,
    sellingPricePerUnit: opportunity.sellEstimatedPrice || 0,
    grossRevenue: (opportunity.sellEstimatedPrice || 0) * 400,
    netProfitPerUnit: opportunity.netProfit || 0,
    totalNetProfit: (opportunity.netProfit || 0) * 400,
    roiPercent: opportunity.roi || 0,
    breakEvenSellPrice: opportunity.totalCost || 0,
  };

  const score = opportunity.scoreBreakdown || {
    profitabilityScore: 30,
    priceAnomalyScore: 18,
    demandScore: 18,
    liquidityScore: 14,
    riskScore: 8,
    totalScore: opportunity.confidenceScore || 88,
    classification: 'High' as const,
  };

  const handleCopySummary = () => {
    const summaryText = `[ZEITGEIST ARBITRAGE DOSSIER]
Product: ${opportunity.productName}
Corridor: ${opportunity.buyMarketName} -> ${opportunity.sellMarketName} (${opportunity.distanceKm} km)
Buy: ${opportunity.buyPrice.toLocaleString()} UZS | Target Sell: ${opportunity.sellEstimatedPrice.toLocaleString()} UZS
Logistics: ${opportunity.logisticsCost.toLocaleString()} UZS | Fees: ${opportunity.fees.toLocaleString()} UZS
Net Profit: +${opportunity.netProfit.toLocaleString()} UZS/unit (+${opportunity.roi}% ROI)
Opportunity Score: ${score.totalScore}/100 (${score.classification})`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wide">
                  {t.dossierTitle}
                </h2>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/30">
                  {opportunity.productName}
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  Score {score.totalScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {opportunity.buyMarketName} → {opportunity.sellMarketName} • {opportunity.distanceKm} km •{' '}
                {new Date(opportunity.detectedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (language === 'uz' ? 'Nusxalandi' : 'Copied') : (language === 'uz' ? 'Nusxalash' : 'Copy')}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {t.tabEconomics}
          </button>
          <button
            onClick={() => setActiveTab('waterfall')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeTab === 'waterfall'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {t.tabWaterfall}
          </button>
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            {t.tabSensitivity}
          </button>
          <button
            onClick={() => setActiveTab('ai-thesis')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeTab === 'ai-thesis'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.tabAiAnalysis}
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW & UNIT ECONOMICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Corridor Route Visual Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      [1] {t.buyLabel} ({opportunity.buyMarketName})
                    </span>
                    <div className="text-lg font-black font-mono text-emerald-400 mt-1">
                      {opportunity.buyPrice.toLocaleString()} UZS
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {opportunity.buySeller || 'Depot Wholesale Supplier'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {t.supplyLabel}: {opportunity.supplyLevel} ({t.inventoryGlut})
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-amber-400" />
                      {opportunity.distanceKm} km {language === 'uz' ? 'Tranzit' : 'Transit'}
                    </span>
                    <div className="my-1 flex items-center gap-1 text-slate-600">
                      <div className="h-0.5 w-12 bg-slate-700"></div>
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {opportunity.logisticsCost.toLocaleString()} UZS / {opportunity.standardUnit}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-right">
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                      [2] {t.sellLabel} ({opportunity.sellMarketName})
                    </span>
                    <div className="text-lg font-black font-mono text-sky-400 mt-1">
                      {opportunity.sellEstimatedPrice.toLocaleString()} UZS
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {t.targetRetailWholesale}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {t.demandVelocity}: +{opportunity.demandWow}% WoW
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Cost Breakdown Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Unit Economics */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-amber-400" />
                    {t.unitEconomicsTitle} (Per {opportunity.standardUnit})
                  </h4>

                  <div className="space-y-2 border-t border-slate-800 pt-2">
                    <div className="flex justify-between text-slate-300">
                      <span>{t.purchasePrice}:</span>
                      <span>{cost.purchasePrice.toLocaleString()} UZS</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t.logisticsFreight}:</span>
                      <span>+{cost.logisticsCostPerUnit.toLocaleString()} UZS</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t.handlingTerminal}:</span>
                      <span>+{cost.handlingCostPerUnit.toLocaleString()} UZS</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t.escrowFee}:</span>
                      <span>+{cost.transactionFeePerUnit.toLocaleString()} UZS</span>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-slate-100">
                      <span>{t.totalLandedCost}:</span>
                      <span>{cost.totalCostPerUnit.toLocaleString()} UZS</span>
                    </div>

                    <div className="flex justify-between text-sky-400 font-semibold">
                      <span>{t.projectedSellPrice}:</span>
                      <span>{cost.sellingPricePerUnit.toLocaleString()} UZS</span>
                    </div>

                    <div className="border-t border-amber-500/30 pt-2 flex justify-between text-sm font-black text-emerald-400 bg-emerald-950/20 p-2 rounded-lg">
                      <span>{t.netProfitPerUnit}:</span>
                      <span>+{cost.netProfitPerUnit.toLocaleString()} UZS (+{cost.roiPercent}% ROI)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score Breakdown & Multi-Dimensional Weights */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    {t.scoreBreakdownTitle} ({score.totalScore}/100)
                  </h4>

                  <div className="space-y-2.5 border-t border-slate-800 pt-2">
                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>{t.weightRoiSpread} (35%):</span>
                        <span className="font-bold text-amber-400">{score.profitScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${score.profitScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>{t.weightDemandVelocity} (25%):</span>
                        <span className="font-bold text-sky-400">{score.demandScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-sky-400" style={{ width: `${score.demandScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>{t.weightLogisticsFriction} (20%):</span>
                        <span className="font-bold text-emerald-400">{score.logisticsScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${score.logisticsScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                        <span>{t.weightPriceStability} (20%):</span>
                        <span className="font-bold text-indigo-400">{score.reliabilityScore}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: `${score.reliabilityScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Checklist */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {t.execChecklistTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="flex items-start gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      1
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 block">{t.step1LockAllocation}</span>
                      <span className="text-slate-400 text-[11px]">
                        {t.step1Desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                      2
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 block">{t.step2CharterFreight}</span>
                      <span className="text-slate-400 text-[11px]">
                        {t.step2Desc} ({opportunity.distanceKm} km)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                      3
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 block">{t.step3ExecuteSettlement}</span>
                      <span className="text-slate-400 text-[11px]">
                        {t.step3Desc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WATERFALL VISUALIZATION */}
          {activeTab === 'waterfall' && (
            <ProfitWaterfallChart opportunity={opportunity} />
          )}

          {/* TAB 3: SENSITIVITY CURVES */}
          {activeTab === 'sensitivity' && (
            <RoiSensitivityChart opportunity={opportunity} />
          )}

          {/* TAB 4: GEMINI AI THESIS */}
          {activeTab === 'ai-thesis' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider">
                      {t.aiThesisTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {t.aiThesisSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchAiExplanation}
                  disabled={isLoadingAi}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-300 hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingAi ? (language === 'uz' ? 'Tahlil qilinmoqda...' : 'Generating...') : (language === 'uz' ? 'Qayta generatsiya' : 'Regenerate')}
                </button>
              </div>

              {isLoadingAi ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
                  <span className="font-mono text-xs">
                    {t.aiAnalyzing}
                  </span>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-4 font-sans whitespace-pre-line">
                  {aiExplanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/90 px-6 py-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>
              {t.netProfitLabel}: <strong className="text-amber-400">+{opportunity.netProfit.toLocaleString()} UZS</strong>
            </span>
            <span>•</span>
            <span>
              {t.netRoiLabel}: <strong className="text-emerald-400">+{opportunity.roi}% ROI</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onSimulate && (
              <button
                onClick={() => {
                  onSimulate(opportunity);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Calculator className="h-4 w-4 text-amber-400" />
                <span>{t.openInSimulator}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-xl bg-amber-500 px-5 py-2.5 font-mono text-xs font-black text-slate-950 hover:bg-amber-400 cursor-pointer transition-colors"
            >
              {language === 'uz' ? 'Yopish' : 'Done / Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
