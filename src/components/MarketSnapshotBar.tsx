import React from 'react';
import { MarketSnapshot } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  MapPin,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MarketSnapshotBarProps {
  snapshot: MarketSnapshot;
  productName: string;
}

export const MarketSnapshotBar: React.FC<MarketSnapshotBarProps> = ({
  snapshot,
  productName,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold">
            #1
          </div>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.marketSnapshotTitle} • <span className="text-amber-400 font-bold">{productName}</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <div
            id="market-snapshot-disclaimer-badge"
            className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-mono text-amber-300/90 border border-amber-500/30 shadow-sm"
            title={t.dataSourceDisclaimer}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            <span className="truncate max-w-[260px] sm:max-w-none">{t.dataSourceDisclaimer}</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {snapshot.opportunitiesDetected} {t.opportunitiesDetected}
          </span>
          <span>•</span>
          <span className="text-slate-400">
            {snapshot.highValueOpportunitiesCount} {t.highValueCorridor}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {/* Total Listings */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.totalListings}</span>
            <Layers className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {snapshot.totalListings}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t.activeDataFeeds}</div>
        </div>

        {/* Markets */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.totalMarkets}</span>
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {snapshot.totalMarkets}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t.regionalHubs}</div>
        </div>

        {/* Average Price */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.avgPrice}</span>
            <span className="text-[10px] font-mono text-slate-400">UZS</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {snapshot.avgPrice >= 1000000
              ? `${(snapshot.avgPrice / 1000000).toFixed(2)}M`
              : snapshot.avgPrice.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t.regionalBaseline}</div>
        </div>

        {/* Lowest Price */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.lowestPrice}</span>
            <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {snapshot.lowestPrice >= 1000000
              ? `${(snapshot.lowestPrice / 1000000).toFixed(2)}M`
              : snapshot.lowestPrice.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t.depotFloor}</div>
        </div>

        {/* Highest Price */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.highestPrice}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {snapshot.highestPrice >= 1000000
              ? `${(snapshot.highestPrice / 1000000).toFixed(2)}M`
              : snapshot.highestPrice.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{t.urbanPeak}</div>
        </div>

        {/* Price Spread */}
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">{t.priceSpread}</span>
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-300">
            {snapshot.priceSpread >= 1000000
              ? `${(snapshot.priceSpread / 1000000).toFixed(2)}M`
              : `${snapshot.priceSpread.toLocaleString()}`}
          </div>
          <div className="text-[10px] text-indigo-400/80 mt-0.5">
            +{(snapshot.lowestPrice > 0 ? (snapshot.priceSpread / snapshot.lowestPrice) * 100 : 0).toFixed(1)}% {t.spreadDelta}
          </div>
        </div>

        {/* Opportunities Detected */}
        <div className="rounded-xl bg-amber-950/30 p-3 border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="text-[11px] font-medium">{t.oppRankings}</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {snapshot.opportunitiesDetected}
          </div>
          <div className="text-[10px] text-amber-300/70 mt-0.5">{t.arbitrageRoutes}</div>
        </div>

        {/* Average Score */}
        <div className="rounded-xl bg-emerald-950/30 p-3 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-[11px] font-medium">{t.avgScore}</span>
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {snapshot.avgOpportunityScore}
            <span className="text-xs text-emerald-500 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-emerald-300/70 mt-0.5">{t.highConviction}</div>
        </div>
      </div>
    </div>
  );
};
