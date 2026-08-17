import React from 'react';
import { AnomalyReport, Market, Opportunity, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LiquidityQuadrantChart } from '../components/visualizations/LiquidityQuadrantChart';
import { PriceDispersionChart } from '../components/visualizations/PriceDispersionChart';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { Radar as RadarIcon, TrendingUp, AlertTriangle, ShieldCheck, Activity, Layers } from 'lucide-react';

interface AnalyticsViewProps {
  anomalies: AnomalyReport[];
  markets: Market[];
  opportunities: Opportunity[];
  currentProduct?: Product;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  anomalies,
  markets,
  opportunities,
  currentProduct,
}) => {
  const { t, language } = useLanguage();

  // Radar data comparing market metrics
  const radarData = markets.map((m) => {
    const anomaly = anomalies.find((a) => a.marketId === m.id);
    return {
      market: m.city,
      demand: m.demandLevel === 'High' ? 90 : m.demandLevel === 'Medium' ? 65 : 45,
      supply: m.supplyLevel === 'High' ? 95 : m.supplyLevel === 'Medium' ? 70 : 40,
      priceIndex: anomaly ? Math.round(50 + anomaly.deviationPercent * 2) : 50,
      spreadCapture: m.city === 'Tashkent' ? 95 : m.city === 'Qarshi' ? 90 : 60,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <RadarIcon className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold font-mono text-slate-100 uppercase tracking-wider">
                {t.priceAnomalyRadarTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.priceAnomalyRadarSubtitle}
            </p>
          </div>

          <span className="rounded bg-amber-500/10 px-2.5 py-1 font-mono text-xs text-amber-400 border border-amber-500/30">
            {anomalies.length} {t.anomaliesFlagged}
          </span>
        </div>

        {/* 2-Column Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Radar Chart: Market Multi-Dimensional Pressure */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              {t.radarMarketPressure}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="market" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar
                    name={t.radarDemand}
                    dataKey="demand"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name={t.radarSupply}
                    dataKey="supply"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-700 bg-slate-950 p-2.5 shadow-xl text-xs font-mono">
                            {payload.map((p, idx) => (
                              <div key={idx} style={{ color: p.color }}>
                                {p.name}: <strong>{p.value} pts</strong>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Anomaly Z-Score & Deviation Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                {t.priceDispersionZScore}
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {anomalies.map((a) => (
                  <div
                    key={a.marketId}
                    className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          a.deviationPercent >= 10
                            ? 'bg-amber-400'
                            : a.deviationPercent <= -3
                            ? 'bg-emerald-400'
                            : 'bg-sky-400'
                        }`}
                      />
                      <span className="font-bold text-slate-200">{a.marketName}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">
                        {t.zScore}: <strong className="text-slate-200">{a.zScore > 0 ? `+${a.zScore}` : a.zScore}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          a.deviationPercent >= 10
                            ? 'text-amber-400'
                            : a.deviationPercent <= -3
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {a.deviationPercent > 0 ? `+${a.deviationPercent}` : a.deviationPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">{t.statAnomalyThreshold}:</strong> {t.statAnomalyDesc}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Enhanced Visualizations in Analytics View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceDispersionChart
          anomalies={anomalies}
          markets={markets}
          productName={currentProduct?.name || 'Cement M500'}
        />

        <LiquidityQuadrantChart
          markets={markets}
          anomalies={anomalies}
        />
      </div>
    </div>
  );
};
