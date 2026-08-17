import React, { useState } from 'react';
import { Market, Product, SimulationResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  Truck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Layers,
  DollarSign,
  Percent,
} from 'lucide-react';

interface ArbitrageSimulatorProps {
  markets: Market[];
  products: Product[];
  initialBuyMarketId?: string;
  initialSellMarketId?: string;
  initialProductId?: string;
}

export const ArbitrageSimulator: React.FC<ArbitrageSimulatorProps> = ({
  markets,
  products,
  initialBuyMarketId = 'mkt-qarshi',
  initialSellMarketId = 'mkt-tashkent',
  initialProductId = 'prod-cement-m500',
}) => {
  const { t, language } = useLanguage();
  const [productId, setProductId] = useState<string>(initialProductId);
  const [buyMarketId, setBuyMarketId] = useState<string>(initialBuyMarketId);
  const [sellMarketId, setSellMarketId] = useState<string>(initialSellMarketId);
  const [buyPrice, setBuyPrice] = useState<number>(78000);
  const [sellPrice, setSellPrice] = useState<number>(96000);
  const [quantity, setQuantity] = useState<number>(400); // 400 bags = 20 tons
  const [transitCostPerKm, setTransitCostPerKm] = useState<number>(0.17);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const selectedProduct = products.find((p) => p.id === productId) || products[0];
  const originMarket = markets.find((m) => m.id === buyMarketId) || markets[0];
  const destMarket = markets.find((m) => m.id === sellMarketId) || markets[1];

  const handleSimulate = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          buyMarketId,
          sellMarketId,
          customBuyPrice: Number(buyPrice),
          customSellPrice: Number(sellPrice),
          customQuantity: Number(quantity),
          transitCostPerKmTon: Number(transitCostPerKm),
        }),
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-mono text-base font-bold uppercase tracking-wider text-slate-100">
              {t.simTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.simSubtitle}
            </p>
          </div>
        </div>

        <span className="rounded-lg bg-slate-800 px-3 py-1 font-mono text-xs text-slate-300 border border-slate-700">
          Deterministic Cost Engine
        </span>
      </div>

      {/* Simulator Inputs Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product & Quantity */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3 font-mono text-xs">
          <label className="font-bold text-slate-300 block uppercase">{t.selectCommodity}</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>

          <label className="font-bold text-slate-300 block uppercase pt-2">
            {t.tradeVolumeUnits} ({selectedProduct.unit})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none font-bold"
          />
          <div className="flex gap-2 text-[10px]">
            {[100, 400, 800].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                {q === 400 ? `20t (${q})` : q}
              </button>
            ))}
          </div>
        </div>

        {/* Origin (Buy) Market & Custom Price */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3 font-mono text-xs">
          <label className="font-bold text-emerald-400 block uppercase">
            [1] {t.originBuyDepot}
          </label>
          <select
            value={buyMarketId}
            onChange={(e) => setBuyMarketId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.city} - {m.name}
              </option>
            ))}
          </select>

          <label className="font-bold text-slate-300 block uppercase pt-2">
            {t.buyPriceSpot} (UZS)
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none font-bold"
          />
        </div>

        {/* Destination (Sell) Market & Target Price */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3 font-mono text-xs">
          <label className="font-bold text-sky-400 block uppercase">
            [2] {t.targetSellMarket}
          </label>
          <select
            value={sellMarketId}
            onChange={(e) => setSellMarketId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.city} - {m.name}
              </option>
            ))}
          </select>

          <label className="font-bold text-slate-300 block uppercase pt-2">
            {t.estSellPriceSpot} (UZS)
          </label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-sky-400 focus:border-sky-500 focus:outline-none font-bold"
          />
        </div>
      </div>

      {/* Recalculate CTA */}
      <div className="flex justify-end">
        <button
          onClick={handleSimulate}
          disabled={isCalculating}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-mono text-xs font-black text-slate-950 hover:bg-amber-400 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isCalculating ? t.calculatingSpread : t.recalculateSpread}</span>
        </button>
      </div>

      {/* Simulation Results Output */}
      {simulationResult && (() => {
        const totalInvestment =
          simulationResult.costBreakdown?.totalCost ?? simulationResult.totalInvestment ?? 0;
        const totalLogisticsCost =
          simulationResult.costBreakdown?.logisticsCost ?? simulationResult.totalLogisticsCost ?? 0;
        const grossRevenue =
          simulationResult.costBreakdown?.totalRevenue ?? simulationResult.grossRevenue ?? 0;
        const sellingPricePerUnit =
          simulationResult.costBreakdown?.sellingPricePerUnit ?? simulationResult.sellingPricePerUnit ?? 0;
        const totalNetProfit =
          simulationResult.costBreakdown?.totalNetProfit ?? simulationResult.totalNetProfit ?? 0;
        const netProfitPerUnit =
          simulationResult.costBreakdown?.netProfitPerUnit ?? simulationResult.netProfitPerUnit ?? 0;
        const roiPercent =
          simulationResult.costBreakdown?.roiPercent ?? simulationResult.roiPercent ?? 0;
        const oppScore = simulationResult.opportunityScore ?? 85;
        const verdict =
          simulationResult.viabilityVerdict ??
          (roiPercent >= 10 ? 'High Arbitrage Viability' : 'Moderate Margin');

        return (
          <div className="rounded-2xl border border-amber-500/40 bg-slate-950 p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-200 uppercase text-xs">
                {t.simYieldAnalysis} ({originMarket.city} → {destMarket.city})
              </span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                {oppScore}/100 Score
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">{t.totalLandedCost}</span>
                <span className="text-sm font-bold text-slate-100">
                  {totalInvestment.toLocaleString()} UZS
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {totalLogisticsCost.toLocaleString()} UZS freight
                </span>
              </div>

              <div className="rounded-xl bg-slate-900 p-3 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">{t.grossRevenue}</span>
                <span className="text-sm font-bold text-sky-400">
                  {grossRevenue.toLocaleString()} UZS
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  @{sellingPricePerUnit.toLocaleString()} UZS/unit
                </span>
              </div>

              <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                  {t.totalNetProfit}
                </span>
                <span className="text-base font-black text-emerald-400">
                  +{totalNetProfit.toLocaleString()} UZS
                </span>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                  +{netProfitPerUnit.toLocaleString()} UZS/unit
                </span>
              </div>

              <div className="rounded-xl bg-amber-950/40 p-3 border border-amber-500/30">
                <span className="text-[10px] text-amber-300 font-bold block uppercase">
                  {t.netRoiPercent}
                </span>
                <span className="text-base font-black text-amber-400">
                  +{roiPercent}%
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-0.5">
                  {verdict}
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
