import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Calculator, TrendingUp, DollarSign, Layers, ArrowRight } from 'lucide-react';

interface ProfitWaterfallChartProps {
  opportunity: Opportunity;
}

export const ProfitWaterfallChart: React.FC<ProfitWaterfallChartProps> = ({ opportunity }) => {
  const { t, language } = useLanguage();
  const [batchUnits, setBatchUnits] = useState<number>(400); // 400 units (e.g. 20 tons)

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
  const isCement = opportunity.productId.includes('cement');

  const unitWeightDesc = isCement
    ? `${(batchUnits * 50) / 1000} ${t.tons} (${batchUnits} ${t.bags})`
    : `${batchUnits} ${opportunity.standardUnit}`;

  // Waterfall Steps Data
  const waterfallData = [
    {
      name: language === 'uz' ? 'Xarid narxi' : 'Wholesale Buy',
      amount: cost.purchasePrice * batchUnits,
      unitAmount: cost.purchasePrice,
      color: '#10b981', // Emerald
      type: 'cost',
      step: 1,
    },
    {
      name: language === 'uz' ? 'Logistika (fura)' : 'Freight Logistics',
      amount: cost.totalLogisticsCost * (batchUnits / cost.purchaseUnits),
      unitAmount: cost.logisticsCostPerUnit,
      color: '#f59e0b', // Amber
      type: 'cost',
      step: 2,
    },
    {
      name: language === 'uz' ? 'Yuklash / Tushirish' : 'Handling & Terminal',
      amount: cost.totalHandlingCost * (batchUnits / cost.purchaseUnits),
      unitAmount: cost.handlingCostPerUnit,
      color: '#38bdf8', // Sky
      type: 'cost',
      step: 3,
    },
    {
      name: language === 'uz' ? 'Tranzaksiya to\'lovi' : 'Escrow / Platform',
      amount: cost.totalTransactionFees * (batchUnits / cost.purchaseUnits),
      unitAmount: cost.transactionFeePerUnit,
      color: '#818cf8', // Indigo
      type: 'cost',
      step: 4,
    },
    {
      name: language === 'uz' ? 'Sof marja (Foyda)' : 'Net Profit Spread',
      amount: cost.netProfitPerUnit * batchUnits,
      unitAmount: cost.netProfitPerUnit,
      color: '#10b981', // Emerald Profit
      type: 'profit',
      step: 5,
    },
    {
      name: language === 'uz' ? 'Sotish tushumi' : 'Final Sell Price',
      amount: cost.sellingPricePerUnit * batchUnits,
      unitAmount: cost.sellingPricePerUnit,
      color: '#ec4899', // Pink Total
      type: 'total',
      step: 6,
    },
  ];

  const totalInvestment = cost.totalCostPerUnit * batchUnits;
  const totalRevenue = cost.sellingPricePerUnit * batchUnits;
  const totalProfit = cost.netProfitPerUnit * batchUnits;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              {t.waterfallTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.waterfallSubtitle} • {opportunity.buyMarketName} → {opportunity.sellMarketName}
            </p>
          </div>
        </div>

        {/* Batch Size Quick Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">{t.batchSize}:</span>
          {[1, 100, 400, 800].map((units) => (
            <button
              key={units}
              onClick={() => setBatchUnits(units)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold cursor-pointer transition-colors ${
                batchUnits === units
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {units === 1 ? (language === 'uz' ? '1 dona' : '1 unit') : units === 400 ? '20t (400)' : `${units}`}
            </button>
          ))}
        </div>
      </div>

      {/* Waterfall Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={waterfallData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) =>
                val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val.toLocaleString()}`
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-slate-100 mb-1">{data.name}</div>
                      <div className="text-amber-400 font-semibold">
                        {language === 'uz' ? 'Jami summa:' : 'Batch Total:'}{' '}
                        <strong>{data.amount.toLocaleString()} UZS</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {language === 'uz' ? '1 birlik uchun:' : 'Per unit:'}{' '}
                        {data.unitAmount.toLocaleString()} UZS
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Metrics Bar for Scaled Batch */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block">{t.totalInvestment} ({unitWeightDesc})</span>
          <span className="text-base font-bold text-slate-200">
            {totalInvestment.toLocaleString()} UZS
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-500 uppercase block">{t.grossRevenue}</span>
          <span className="text-base font-bold text-sky-400">
            {totalRevenue.toLocaleString()} UZS
          </span>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 p-3 border border-emerald-500/40 font-mono">
          <span className="text-[10px] text-emerald-400 uppercase block font-bold">{t.totalNetProfit} ({opportunity.roi}% ROI)</span>
          <span className="text-base font-black text-emerald-400">
            +{totalProfit.toLocaleString()} UZS
          </span>
        </div>
      </div>
    </div>
  );
};
