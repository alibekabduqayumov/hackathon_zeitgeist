import React from 'react';
import { AnomalyReport, Market } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface PriceDispersionChartProps {
  anomalies: AnomalyReport[];
  markets: Market[];
  productName: string;
}

export const PriceDispersionChart: React.FC<PriceDispersionChartProps> = ({
  anomalies,
  markets,
  productName,
}) => {
  const { t, language } = useLanguage();

  // Compute baseline median
  const overallAvg =
    anomalies.reduce((sum, a) => sum + a.avgPrice, 0) / (anomalies.length || 1);

  const chartData = anomalies.map((a) => {
    const market = markets.find((m) => m.id === a.marketId);
    return {
      name: market ? market.city : a.marketName,
      avgPrice: a.avgPrice,
      medianPrice: a.medianPrice,
      deviationPercent: a.deviationPercent,
      zScore: a.zScore,
      anomalyLevel: a.anomalyLevel,
      color:
        a.deviationPercent >= 10
          ? '#f59e0b' // High price sink (Amber)
          : a.deviationPercent <= -3
          ? '#10b981' // Undervalued depot (Emerald)
          : '#38bdf8', // Normal baseline (Sky)
    };
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              {t.priceDispersionTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.priceDispersionSubtitle} • {productName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="rounded bg-slate-800 px-2 py-0.5 border border-slate-700 text-slate-300">
            {language === 'uz' ? 'O\'rtacha me\'yor:' : 'Regional Baseline:'}{' '}
            <strong className="text-slate-100">
              {overallAvg >= 1000000 ? `${(overallAvg / 1000000).toFixed(2)}M` : Math.round(overallAvg).toLocaleString()} UZS
            </strong>
          </span>
        </div>
      </div>

      {/* Dispersion Bar & Reference Lines Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
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
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-slate-100 mb-1">{d.name}</div>
                      <div className="text-slate-300">
                        {language === 'uz' ? 'O\'rtacha narx:' : 'Avg Price:'}{' '}
                        <strong className="text-amber-400">{d.avgPrice.toLocaleString()} UZS</strong>
                      </div>
                      <div className="text-slate-400">
                        {t.zScore}: <strong>{d.zScore > 0 ? `+${d.zScore}` : d.zScore}</strong>
                      </div>
                      <div
                        className={`font-semibold mt-1 ${
                          d.deviationPercent >= 10
                            ? 'text-amber-400'
                            : d.deviationPercent <= -3
                            ? 'text-emerald-400'
                            : 'text-sky-400'
                        }`}
                      >
                        {t.deviation}: {d.deviationPercent > 0 ? `+${d.deviationPercent}` : d.deviationPercent}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={overallAvg}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: language === 'uz' ? 'Hududiy me\'yor' : 'Regional Median',
                fill: '#94a3b8',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Dispersion Key Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-emerald-400">{language === 'uz' ? 'Arzon Xarid Bazasi (Depo)' : 'Undervalued Depot'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="text-amber-400">{language === 'uz' ? 'Yuqori Narxli Iste\'mol Markazi' : 'Overheated Price Sink'}</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {language === 'uz' ? 'Arbitraj yo\'nalishi: Yashildan Sarig\'iga' : 'Arbitrage Flow: Green to Amber'}
        </span>
      </div>
    </div>
  );
};
