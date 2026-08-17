import React from 'react';
import { Market, AnomalyReport } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Radar, Compass, Activity, Layers } from 'lucide-react';

interface LiquidityQuadrantChartProps {
  markets: Market[];
  anomalies: AnomalyReport[];
}

export const LiquidityQuadrantChart: React.FC<LiquidityQuadrantChartProps> = ({
  markets,
  anomalies,
}) => {
  const { t, language } = useLanguage();

  const data = markets.map((m) => {
    const anomaly = anomalies.find((a) => a.marketId === m.id);
    const supplyScore = m.supplyLevel === 'High' ? 85 : m.supplyLevel === 'Medium' ? 50 : 20;
    const demandScore = m.demandLevel === 'High' ? 85 : m.demandLevel === 'Medium' ? 50 : 25;

    return {
      name: m.city,
      supply: supplyScore + (m.city === 'Qarshi' ? 10 : m.city === 'Navoi' ? 8 : 0),
      demand: demandScore + (m.city === 'Tashkent' ? 10 : m.city === 'Samarkand' ? 5 : 0),
      hubType: m.hubType,
      deviation: anomaly ? anomaly.deviationPercent : 0,
      zScore: anomaly ? anomaly.zScore : 0,
    };
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              {t.liquidityQuadTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.liquidityQuadSubtitle}
            </p>
          </div>
        </div>

        <span className="rounded bg-indigo-500/10 px-2.5 py-1 font-mono text-xs text-indigo-400 border border-indigo-500/30">
          4-Quadrant Macro View
        </span>
      </div>

      {/* Scatter 4-Quadrant Chart */}
      <div className="relative h-72 w-full">
        {/* Quadrant Background Labels */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none p-8 text-[10px] font-mono uppercase tracking-wider text-slate-600 opacity-60">
          <div className="p-2 border-r border-b border-slate-800/50 flex flex-col justify-start">
            <span className="text-sky-400 font-bold">{t.quadrant2}</span>
            <span className="text-slate-500 text-[9px]">{language === 'uz' ? 'Toshkent kabi iste\'mol markazlari' : 'Consumer peaks like Tashkent'}</span>
          </div>
          <div className="p-2 border-b border-slate-800/50 flex flex-col justify-start text-right">
            <span className="text-amber-400 font-bold">{t.quadrant1}</span>
            <span className="text-slate-500 text-[9px]">{language === 'uz' ? 'Yuqori savdo aylanmasi' : 'High volume trade corridors'}</span>
          </div>
          <div className="p-2 border-r border-slate-800/50 flex flex-col justify-end">
            <span className="text-slate-400 font-bold">{t.quadrant3}</span>
            <span className="text-slate-500 text-[9px]">{language === 'uz' ? 'O\'rtacha likvidlik' : 'Moderate liquidity'}</span>
          </div>
          <div className="p-2 flex flex-col justify-end text-right">
            <span className="text-emerald-400 font-bold">{t.quadrant4}</span>
            <span className="text-slate-500 text-[9px]">{language === 'uz' ? 'Qarshi & Navoiy bazalari' : 'Depots like Qarshi & Navoi'}</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey="supply"
              name="Supply Volume"
              unit=" pts"
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              label={{
                value: language === 'uz' ? 'Taklif Zaxirasi →' : 'Supply Volume / Liquidity →',
                position: 'insideBottom',
                offset: -10,
                fill: '#64748b',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />
            <YAxis
              type="number"
              dataKey="demand"
              name="Demand Velocity"
              unit=" pts"
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              label={{
                value: language === 'uz' ? 'Talab Tezligi ↑' : 'Demand Velocity ↑',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />
            <ZAxis range={[200, 500]} />
            <ReferenceLine x={50} stroke="#334155" strokeDasharray="3 3" />
            <ReferenceLine y={50} stroke="#334155" strokeDasharray="3 3" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-slate-100 mb-1">{d.name}</div>
                      <div className="text-slate-400">
                        {t.supplyLiquidity}: <strong className="text-emerald-400">{d.supply} pts</strong>
                      </div>
                      <div className="text-slate-400">
                        {t.demandVelocity}: <strong className="text-amber-400">{d.demand} pts</strong>
                      </div>
                      <div className="text-slate-300 mt-1">
                        {t.deviation}: <strong className={d.deviation >= 10 ? 'text-amber-400' : 'text-emerald-400'}>{d.deviation > 0 ? `+${d.deviation}` : d.deviation}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={data} fill="#f59e0b">
              {data.map((entry, index) => {
                const color =
                  entry.name === 'Tashkent'
                    ? '#38bdf8'
                    : entry.name === 'Qarshi' || entry.name === 'Navoi'
                    ? '#10b981'
                    : '#f59e0b';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
