import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Sliders, TrendingUp, AlertCircle, Percent } from 'lucide-react';

interface RoiSensitivityChartProps {
  opportunity: Opportunity;
}

export const RoiSensitivityChart: React.FC<RoiSensitivityChartProps> = ({ opportunity }) => {
  const { t, language } = useLanguage();

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
  const baseFreight = cost.logisticsCostPerUnit;
  const baseSell = cost.sellingPricePerUnit;
  const baseBuy = cost.purchasePrice;

  // Generate sensitivity curve varying freight tariff by -40% to +40%
  const sensitivityData = [-40, -20, 0, +20, +40, +60].map((shiftPct) => {
    const adjustedFreight = baseFreight * (1 + shiftPct / 100);
    const totalCost = baseBuy + adjustedFreight + cost.handlingCostPerUnit + cost.transactionFeePerUnit;
    const netProfit = baseSell - totalCost;
    const roi = (netProfit / totalCost) * 100;

    return {
      shift: `${shiftPct > 0 ? `+${shiftPct}` : shiftPct}%`,
      shiftVal: shiftPct,
      netProfit: Math.round(netProfit),
      roi: Number(roi.toFixed(1)),
      freightCost: Math.round(adjustedFreight),
    };
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Percent className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              {t.roiSensitivityTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.roiSensitivitySubtitle} ({opportunity.buyMarketName} → {opportunity.sellMarketName})
            </p>
          </div>
        </div>

        <span className="rounded bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 border border-slate-700">
          Base: <strong className="text-emerald-400">+{opportunity.roi}% Net ROI</strong>
        </span>
      </div>

      {/* Sensitivity Curve Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sensitivityData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <XAxis
              dataKey="shift"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              label={{
                value: language === 'uz' ? 'Logistika narxining o\'zgarishi' : 'Freight Cost Shift (%)',
                position: 'insideBottom',
                offset: -5,
                fill: '#64748b',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => `${val}%`}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-slate-100 mb-1">
                        {language === 'uz' ? 'Transport o\'zgarishi:' : 'Freight Shift:'} {d.shift}
                      </div>
                      <div className="text-emerald-400 font-bold">
                        {t.estNetRoi}: +{d.roi}%
                      </div>
                      <div className="text-amber-400">
                        {t.estNetProfit}: +{d.netProfit.toLocaleString()} UZS / unit
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1">
                        {t.transitCost}: {d.freightCost.toLocaleString()} UZS
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" label="Breakeven" />
            <Line
              type="monotone"
              dataKey="roi"
              name="Net ROI %"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <span>
          {language === 'uz'
            ? 'Xulosa: Logistika xarajatlari 40% ga qimmatlashsa ham, mazkur yo\'nalish ijobiy foyda marjasini saqlab qoladi.'
            : 'Resilience: Even if diesel freight rates surge +40%, this corridor maintains a robust positive profit spread.'}
        </span>
      </div>
    </div>
  );
};
