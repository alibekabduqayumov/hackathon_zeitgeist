import React from 'react';
import { Market, AnomalyReport, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface MarketComparisonViewProps {
  markets: Market[];
  anomalies: AnomalyReport[];
  product: Product;
}

export const MarketComparisonView: React.FC<MarketComparisonViewProps> = ({
  markets,
  anomalies,
  product,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              {t.marketComparisonTitle} • <span className="text-amber-400 font-bold">{product.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {t.marketComparisonSubtitle}
            </p>
          </div>
        </div>

        <span className="font-mono text-xs text-slate-400">
          6 {language === 'uz' ? 'hududiy tugun' : 'Regional Hubs'}
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
              <th className="pb-3 pl-2">{t.colMarketHub}</th>
              <th className="pb-3">{t.colHubType}</th>
              <th className="pb-3">{t.colAvgPrice}</th>
              <th className="pb-3">{t.colZScore}</th>
              <th className="pb-3">{t.colSupply}</th>
              <th className="pb-3">{t.colDemand}</th>
              <th className="pb-3 pr-2 text-right">{t.colMarketRole}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {markets.map((market) => {
              const anomaly = anomalies.find((a) => a.marketId === market.id);
              const isHighPrice = anomaly && anomaly.deviationPercent >= 10;
              const isLowPrice = anomaly && anomaly.deviationPercent <= -3;

              return (
                <tr
                  key={market.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* City & Name */}
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <div>
                        <span className="font-bold text-slate-100">{market.city}</span>
                        <span className="block text-[10px] text-slate-400 font-sans truncate max-w-[150px]">
                          {market.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Hub Type */}
                  <td className="py-3">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                      {market.hubType}
                    </span>
                  </td>

                  {/* Average Price */}
                  <td className="py-3 font-bold">
                    {anomaly ? (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={
                            isHighPrice
                              ? 'text-amber-400'
                              : isLowPrice
                              ? 'text-emerald-400'
                              : 'text-slate-100'
                          }
                        >
                          {anomaly.avgPrice.toLocaleString()} UZS
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            anomaly.deviationPercent > 0
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          ({anomaly.deviationPercent > 0 ? `+${anomaly.deviationPercent}` : anomaly.deviationPercent}%)
                        </span>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>

                  {/* Z-Score */}
                  <td className="py-3">
                    {anomaly ? (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          anomaly.zScore > 1
                            ? 'bg-amber-500/20 text-amber-300'
                            : anomaly.zScore < -0.8
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {anomaly.zScore > 0 ? `+${anomaly.zScore}` : anomaly.zScore}
                      </span>
                    ) : (
                      '0.00'
                    )}
                  </td>

                  {/* Supply Level */}
                  <td className="py-3">
                    <span
                      className={`text-[11px] font-semibold ${
                        market.supplyLevel === 'High'
                          ? 'text-emerald-400'
                          : market.supplyLevel === 'Medium'
                          ? 'text-sky-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {market.supplyLevel}
                    </span>
                  </td>

                  {/* Demand Level */}
                  <td className="py-3">
                    <span
                      className={`text-[11px] font-semibold ${
                        market.demandLevel === 'High'
                          ? 'text-amber-400'
                          : market.demandLevel === 'Medium'
                          ? 'text-sky-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {market.demandLevel}
                    </span>
                  </td>

                  {/* Role in Arbitrage */}
                  <td className="py-3 pr-2 text-right">
                    {isLowPrice ? (
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 font-bold text-emerald-400 border border-emerald-500/30">
                        {t.roleWholesaleOrigin}
                      </span>
                    ) : isHighPrice ? (
                      <span className="rounded-lg bg-amber-500/10 px-2 py-1 font-bold text-amber-400 border border-amber-500/30">
                        {t.roleTargetSink}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">{t.roleIntermediate}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
