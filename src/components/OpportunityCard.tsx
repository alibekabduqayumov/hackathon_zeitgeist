import React from 'react';
import { Opportunity } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Activity,
  Flame,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  rank: number;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  rank,
  onSelect,
}) => {
  const { t, language } = useLanguage();
  const score = opportunity.scoreBreakdown?.totalScore || 90;
  const isTopRanked = rank === 1;

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-slate-900/90 p-5 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
        isTopRanked
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      {/* Top Badge Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-black ${
              isTopRanked
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            #{rank}
          </span>
          <span className="font-mono text-xs font-bold text-slate-200">
            {opportunity.productName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isTopRanked && (
            <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/30">
              <Flame className="h-3 w-3" />
              {t.opportunityScore}
            </span>
          )}
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-black text-emerald-400 border border-emerald-500/30">
            Score {score}/100
          </span>
        </div>
      </div>

      {/* Corridor Flow & Prices */}
      <div className="my-3 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800/80">
        <div className="flex items-center justify-between">
          {/* Buy Side */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {t.buyLabel} ({opportunity.buyMarketName})
            </span>
            <div className="text-sm font-black font-mono text-emerald-400">
              {opportunity.buyPrice.toLocaleString()} UZS
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {opportunity.buySeller || 'Depot Supplier'}
            </div>
          </div>

          {/* Transit Arrow & Distance */}
          <div className="flex flex-col items-center px-2">
            <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mb-1">
              <Truck className="h-3 w-3 text-amber-400" />
              {opportunity.distanceKm} km
            </span>
            <div className="flex items-center gap-1 text-slate-600">
              <div className="h-0.5 w-6 bg-slate-700"></div>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            </div>
            <span className="font-mono text-[9px] text-slate-400 mt-1">
              {opportunity.logisticsCost.toLocaleString()} UZS
            </span>
          </div>

          {/* Sell Side */}
          <div className="space-y-1 text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-end gap-1">
              {t.sellLabel} ({opportunity.sellMarketName})
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
            </span>
            <div className="text-sm font-black font-mono text-sky-400">
              {opportunity.sellEstimatedPrice.toLocaleString()} UZS
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {t.estDemandVelocity} +{opportunity.demandWow}%
            </div>
          </div>
        </div>
      </div>

      {/* Financial Spread Breakdown */}
      <div className="grid grid-cols-2 gap-2 my-2 font-mono">
        <div className="rounded-lg bg-slate-950/50 p-2 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block">{t.netProfitLabel}</span>
          <span className="text-xs font-bold text-amber-400">
            +{opportunity.netProfit.toLocaleString()} UZS
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/50 p-2 border border-slate-800/60 text-right">
          <span className="text-[10px] text-slate-400 block">{t.netRoiLabel}</span>
          <span className="text-xs font-black text-emerald-400">
            +{opportunity.roi}% Net ROI
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>{opportunity.productMatchConfidence}% {t.verifiedMatch}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all"
        >
          <span>{t.openDossier}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
