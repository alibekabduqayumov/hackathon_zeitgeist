import React from 'react';
import { PriceHistoryPoint } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from 'recharts';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
  productName: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  data,
  productName,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              30-DAY PRICE HISTORY & SPREAD EVOLUTION
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical price divergence for <span className="text-amber-400 font-semibold">{productName}</span> across key trade corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700">
            Demo historical dataset
          </span>
        </div>
      </div>

      {/* Historical Line Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={['dataMin - 3000', 'dataMax + 3000']}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-xl text-xs font-mono">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {label}
                      </div>
                      <div className="space-y-1">
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex justify-between gap-4">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-bold text-slate-100">
                              {Number(entry.value).toLocaleString()} UZS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

            {/* Tashkent (High Demand) */}
            <Line
              type="monotone"
              dataKey="tashkentPrice"
              name="Tashkent (Sink)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#f59e0b' }}
            />

            {/* Qarshi (Supply Base) */}
            <Line
              type="monotone"
              dataKey="qarshiPrice"
              name="Qarshi (Source)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
            />

            {/* Samarkand */}
            <Line
              type="monotone"
              dataKey="samarkandPrice"
              name="Samarkand"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />

            {/* Moving Average */}
            <Line
              type="monotone"
              dataKey="movingAverage"
              name="7-Day Moving Avg"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Insight Callout */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-3 text-xs">
        <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400 border border-amber-500/20 mt-0.5">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-200">
            Structural Divergence Event Detected (Aug 01 - Aug 15)
          </h4>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            The price spread between Qarshi and Tashkent expanded from <strong className="text-slate-300">6,000 UZS</strong> in mid-July to <strong className="text-amber-400">18,000 UZS (+19.3%)</strong> today. This persistent margin expansion outpaces logistics freight escalations, solidifying a multi-week arbitrage window.
          </p>
        </div>
      </div>
    </div>
  );
};
