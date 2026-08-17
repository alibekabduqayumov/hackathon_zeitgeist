import React, { useState } from 'react';
import {
  Market,
  Opportunity,
  Product,
  AnomalyReport,
  MarketSnapshot,
} from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MarketSnapshotBar } from '../components/MarketSnapshotBar';
import { NaturalLanguageSearch } from '../components/NaturalLanguageSearch';
import { AIInsightPanel } from '../components/AIInsightPanel';
import { OpportunityCard } from '../components/OpportunityCard';
import { MarketComparisonView } from '../components/MarketComparisonView';
import { UzbekistanTradeMap } from '../components/visualizations/UzbekistanTradeMap';
import { PriceDispersionChart } from '../components/visualizations/PriceDispersionChart';
import { LiquidityQuadrantChart } from '../components/visualizations/LiquidityQuadrantChart';
import {
  TrendingUp,
  Flame,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  Map,
  BarChart3,
} from 'lucide-react';

interface DashboardViewProps {
  products: Product[];
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  markets: Market[];
  snapshot: MarketSnapshot;
  opportunities: Opportunity[];
  anomalies: AnomalyReport[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onSearchQuery: (query: string) => void;
  isSearching: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  selectedProductId,
  setSelectedProductId,
  markets,
  snapshot,
  opportunities,
  anomalies,
  onSelectOpportunity,
  onSearchQuery,
  isSearching,
}) => {
  const { t, language } = useLanguage();
  const [visTab, setVisTab] = useState<'map' | 'dispersion' | 'liquidity'>('map');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="space-y-6">
      {/* Product Quick-Switch Ribbon */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            {t.selectProduct}:
          </span>
          <div className="flex gap-1.5">
            {products.map((p) => {
              const isSelected = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 hidden md:inline-block">
          {snapshot.totalListings} {t.totalListings.toLowerCase()} • {opportunities.length} {t.opportunitiesDetected.toLowerCase()}
        </span>
      </div>

      {/* Hero Spatial & Financial Visualizer Section */}
      <div className="space-y-3">
        {/* Visualization Switcher Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVisTab('map')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                visTab === 'map'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>{t.tabInteractiveMap}</span>
            </button>

            <button
              onClick={() => setVisTab('dispersion')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                visTab === 'dispersion'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{t.tabPriceDispersion}</span>
            </button>

            <button
              onClick={() => setVisTab('liquidity')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                visTab === 'liquidity'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{t.tabMacroMatrix}</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            {currentProduct.name} ({currentProduct.unit})
          </span>
        </div>

        {/* Dynamic Visualization Tab Display */}
        {visTab === 'map' && (
          <UzbekistanTradeMap
            markets={markets}
            opportunities={opportunities}
            currentProduct={currentProduct}
            onSelectOpportunity={onSelectOpportunity}
          />
        )}

        {visTab === 'dispersion' && (
          <PriceDispersionChart
            anomalies={anomalies}
            markets={markets}
            productName={currentProduct.name}
          />
        )}

        {visTab === 'liquidity' && (
          <LiquidityQuadrantChart
            markets={markets}
            anomalies={anomalies}
          />
        )}
      </div>

      {/* Market Snapshot Stats Bar */}
      <MarketSnapshotBar
        snapshot={snapshot}
        productName={currentProduct.name}
      />

      {/* Natural Language Search & Assistant */}
      <NaturalLanguageSearch
        onSearch={onSearchQuery}
        isLoading={isSearching}
      />

      {/* Macro AI Insight Panel */}
      <AIInsightPanel />

      {/* Ranked Arbitrage Opportunities Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
                {t.rankedArbitrageTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.rankedArbitrageSubtitle}
              </p>
            </div>
          </div>

          <span className="rounded-lg bg-slate-900 px-3 py-1 font-mono text-xs text-slate-400 border border-slate-800">
            {opportunities.length} {t.verifiedOpportunities}
          </span>
        </div>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp, index) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                rank={index + 1}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400 font-mono text-xs">
            {t.noOpportunities}
          </div>
        )}
      </div>

      {/* Regional Price Comparison Matrix */}
      <MarketComparisonView
        markets={markets}
        anomalies={anomalies}
        product={currentProduct}
      />
    </div>
  );
};
