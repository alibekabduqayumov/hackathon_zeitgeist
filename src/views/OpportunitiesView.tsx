import React, { useState } from 'react';
import { Opportunity, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  TrendingUp,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  Truck,
  Flame,
  Search,
} from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  products: Product[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  products,
  onSelectOpportunity,
}) => {
  const { t, language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'roi' | 'profit' | 'distance'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterText, setFilterText] = useState<string>('');

  const filtered = opportunities
    .filter((opp) => {
      if (selectedProduct !== 'all' && opp.productId !== selectedProduct) return false;
      if (filterText) {
        const text = `${opp.productName} ${opp.buyMarketName} ${opp.sellMarketName}`.toLowerCase();
        if (!text.includes(filterText.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'roi') return b.roi - a.roi;
      if (sortBy === 'profit') return b.netProfit - a.netProfit;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
    });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold font-mono text-slate-100 uppercase tracking-wider">
                {t.pipelineTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.pipelineSubtitle}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Text Filter */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>

          {/* Product Category Filter */}
          <div>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
            >
              <option value="all">{t.allProducts} ({opportunities.length})</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
            >
              <option value="score">{t.sortByScore}</option>
              <option value="roi">{t.sortByRoi}</option>
              <option value="profit">{t.sortByProfit}</option>
              <option value="distance">{t.sortByDistance}</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-xs text-slate-400 font-mono">
            <span>
              {language === 'uz' ? 'Jami' : 'Showing'} <strong>{filtered.length}</strong> {language === 'uz' ? 'yo\'nalish' : 'viable routes'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid or Table Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={onSelectOpportunity}
              rank={idx + 1}
            />
          ))}
        </div>
      ) : (
        /* Dense Enterprise Table */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">{t.products}</th>
                <th className="pb-3 font-medium">{t.buyLabel}</th>
                <th className="pb-3 font-medium">{t.sellLabel}</th>
                <th className="pb-3 font-medium text-right">{t.transitCost}</th>
                <th className="pb-3 font-medium text-right">{t.netProfitLabel}</th>
                <th className="pb-3 font-medium text-right">{t.netRoiLabel}</th>
                <th className="pb-3 font-medium text-center">Score</th>
                <th className="pb-3 font-medium text-right">{language === 'uz' ? 'Harakat' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((opp, idx) => (
                <tr key={opp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 text-slate-400 font-bold">#{idx + 1}</td>
                  <td className="py-3.5 font-sans">
                    <div className="font-bold text-slate-100">{opp.productName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">per {opp.standardUnit}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1 font-sans">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {opp.buyMarketName}
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      {opp.buyPrice.toLocaleString()} UZS
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="text-sky-300 font-semibold flex items-center gap-1 font-sans">
                      <MapPin className="h-3 w-3 text-sky-400" />
                      {opp.sellMarketName}
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      {opp.sellEstimatedPrice.toLocaleString()} UZS
                    </div>
                  </td>
                  <td className="py-3.5 text-right text-amber-400 font-mono">
                    {opp.logisticsCost.toLocaleString()} UZS
                    <div className="text-[10px] text-slate-500">{opp.distanceKm} km</div>
                  </td>
                  <td className="py-3.5 text-right font-bold text-emerald-400 font-mono">
                    +{opp.netProfit.toLocaleString()} UZS
                  </td>
                  <td className="py-3.5 text-right font-bold text-emerald-400 font-mono text-sm">
                    +{opp.roi}%
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="inline-block rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-bold text-amber-400">
                      {opp.scoreBreakdown.totalScore}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-sans">
                    <button
                      onClick={() => onSelectOpportunity(opp)}
                      className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer"
                    >
                      {t.openDossier}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
