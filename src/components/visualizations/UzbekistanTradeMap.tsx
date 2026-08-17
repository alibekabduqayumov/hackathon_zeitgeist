import React, { useState } from 'react';
import { Market, Opportunity, Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Truck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Flame,
  Info,
  DollarSign,
} from 'lucide-react';

interface UzbekistanTradeMapProps {
  markets: Market[];
  opportunities: Opportunity[];
  currentProduct: Product;
  onSelectOpportunity?: (opp: Opportunity) => void;
}

// Projected Coordinates (SVG 800x480 ViewBox for Uzbekistan)
// Longitude range: ~56.0E to ~73.0E -> X
// Latitude range: ~37.0N to ~45.0N -> Y
const NODE_COORDINATES: Record<string, { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }> = {
  'mkt-qarshi': { x: 420, y: 360, labelPos: 'bottom' },
  'mkt-tashkent': { x: 620, y: 150, labelPos: 'top' },
  'mkt-samarkand': { x: 490, y: 300, labelPos: 'bottom' },
  'mkt-bukhara': { x: 340, y: 290, labelPos: 'left' },
  'mkt-navoi': { x: 400, y: 240, labelPos: 'top' },
  'mkt-fergana': { x: 740, y: 210, labelPos: 'right' },
};

export const UzbekistanTradeMap: React.FC<UzbekistanTradeMapProps> = ({
  markets,
  opportunities,
  currentProduct,
  onSelectOpportunity,
}) => {
  const { t, language } = useLanguage();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('mkt-tashkent');
  const [hoveredOppId, setHoveredOppId] = useState<string | null>(null);

  const selectedMarket = markets.find((m) => m.id === selectedNodeId) || markets[0];
  const activeOpp =
    opportunities.find((o) => o.id === hoveredOppId) ||
    opportunities.find((o) => o.buyMarketId === selectedNodeId || o.sellMarketId === selectedNodeId) ||
    opportunities[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
              {t.mapTitle}
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-bold border border-amber-500/30">
                {currentProduct.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.mapSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {opportunities.length} {language === 'uz' ? 'faol yo\'nalish' : 'active corridors'}
          </span>
          <span>•</span>
          <span className="text-slate-300">6 {language === 'uz' ? 'hududiy tugun' : 'regional hubs'}</span>
        </div>
      </div>

      {/* Map + Detail Panel Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Interactive SVG Map Container (8 cols) */}
        <div className="lg:col-span-8 relative rounded-xl border border-slate-800 bg-slate-950/90 p-3 overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Subtle Topographic Radar Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[16/9] max-h-[380px]">
            <svg
              viewBox="0 0 820 460"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
            >
              <defs>
                {/* Gradient for flow lines */}
                <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Uzbekistan Stylized Geographic Boundary Silhouette */}
              <path
                d="M 120,200 L 160,160 L 260,180 L 320,120 L 450,110 L 520,70 L 580,110 L 670,120 L 760,170 L 790,210 L 750,250 L 680,240 L 620,280 L 560,340 L 480,410 L 400,420 L 320,380 L 260,340 L 190,320 L 140,260 Z"
                fill="#090f1d"
                stroke="#1e293b"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-70"
              />

              {/* Secondary Inland Territory Shading */}
              <path
                d="M 280,180 Q 420,140 600,140 Q 720,180 770,220 L 720,240 Q 560,260 480,360 L 360,340 Z"
                fill="#0f172a"
                fillOpacity="0.4"
              />

              {/* Trade Corridor Flow Arcs */}
              {opportunities.map((opp) => {
                const origin = NODE_COORDINATES[opp.buyMarketId];
                const dest = NODE_COORDINATES[opp.sellMarketId];
                if (!origin || !dest) return null;

                const isHovered = hoveredOppId === opp.id;
                const isSelected = activeOpp?.id === opp.id;

                // Bezier curve control point
                const midX = (origin.x + dest.x) / 2;
                const midY = (origin.y + dest.y) / 2 - 35;

                return (
                  <g
                    key={opp.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredOppId(opp.id)}
                    onMouseLeave={() => setHoveredOppId(null)}
                    onClick={() => {
                      if (onSelectOpportunity) onSelectOpportunity(opp);
                    }}
                  >
                    {/* Background glow path */}
                    <path
                      d={`M ${origin.x},${origin.y} Q ${midX},${midY} ${dest.x},${dest.y}`}
                      fill="none"
                      stroke={isSelected ? '#f59e0b' : '#334155'}
                      strokeWidth={isSelected ? '5' : isHovered ? '4' : '2'}
                      strokeOpacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.3}
                      className="transition-all"
                    />

                    {/* Animated dynamic pulse line */}
                    <path
                      d={`M ${origin.x},${origin.y} Q ${midX},${midY} ${dest.x},${dest.y}`}
                      fill="none"
                      stroke="url(#corridorGradient)"
                      strokeWidth={isSelected ? '3' : '2'}
                      strokeDasharray={isSelected ? '8 6' : '6 6'}
                      strokeLinecap="round"
                      className="animate-dash"
                    />

                    {/* Midpoint Spread Badge on Map */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-45"
                        y="-12"
                        width="90"
                        height="24"
                        rx="12"
                        fill="#020617"
                        stroke={isSelected ? '#f59e0b' : '#334155'}
                        strokeWidth="1.5"
                        className="shadow-lg"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? '#fbbf24' : '#10b981'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        +{opp.roi}% ROI
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Regional Market Hub Nodes */}
              {markets.map((mkt) => {
                const coords = NODE_COORDINATES[mkt.id];
                if (!coords) return null;

                const isSelected = selectedNodeId === mkt.id;
                const isBuyHub = opportunities.some((o) => o.buyMarketId === mkt.id);
                const isSellHub = opportunities.some((o) => o.sellMarketId === mkt.id);

                return (
                  <g
                    key={mkt.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(mkt.id)}
                  >
                    {/* Outer animated ripple */}
                    {isSelected && (
                      <circle
                        r="20"
                        fill="#f59e0b"
                        fillOpacity="0.15"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer node glow border */}
                    <circle
                      r={isSelected ? '14' : '10'}
                      fill="#090d16"
                      stroke={
                        isSelected
                          ? '#f59e0b'
                          : isBuyHub
                          ? '#10b981'
                          : isSellHub
                          ? '#38bdf8'
                          : '#64748b'
                      }
                      strokeWidth={isSelected ? '3' : '2'}
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Core node dot */}
                    <circle
                      r={isSelected ? '6' : '4'}
                      fill={
                        isSelected
                          ? '#f59e0b'
                          : isBuyHub
                          ? '#10b981'
                          : isSellHub
                          ? '#38bdf8'
                          : '#94a3b8'
                      }
                    />

                    {/* City Label */}
                    <g transform={`translate(0, ${coords.labelPos === 'bottom' ? 26 : -18})`}>
                      <rect
                        x="-40"
                        y="-10"
                        width="80"
                        height="20"
                        rx="4"
                        fill="#090d16"
                        fillOpacity="0.9"
                        stroke={isSelected ? '#f59e0b' : '#1e293b'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? '#f8fafc' : '#cbd5e1'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {mkt.city}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>{t.nodeProductionHub} ({language === 'uz' ? 'Xarid' : 'Buy'})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 inline-block"></span>
                <span>{t.nodeConsumerHub} ({language === 'uz' ? 'Sotish' : 'Sell'})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>{t.activeRoute}</span>
              </span>
            </div>

            <div className="text-slate-500 text-[10px]">
              {language === 'uz' ? 'Avtomobil yo\'li bo\'yicha masofa' : 'Actual Road Transit Distance'}
            </div>
          </div>
        </div>

        {/* Selected Corridor Inspection Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-950/90 p-4 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" />
                {t.visualCorridorsTitle}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">
                Score: {activeOpp?.scoreBreakdown?.totalScore || 91}/100
              </span>
            </div>

            {activeOpp ? (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100 font-mono">
                  <span>{activeOpp.buyMarketName}</span>
                  <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{activeOpp.sellMarketName}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {currentProduct.name} • {activeOpp.distanceKm} km
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 mt-2 font-mono">
                {t.selectOriginOrDest}
              </div>
            )}
          </div>

          {activeOpp && (
            <div className="space-y-3 font-mono text-xs">
              {/* Buy Depot Price */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">{t.buyLabel} ({activeOpp.buyMarketName})</span>
                  <span className="font-bold text-emerald-400">
                    {activeOpp.buyPrice.toLocaleString()} UZS
                  </span>
                </div>
                <span className="text-[10px] rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 border border-emerald-500/20">
                  {t.supplySurplus}
                </span>
              </div>

              {/* Landed Transit Cost */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">{t.transitCost}</span>
                  <span className="font-bold text-slate-200">
                    {activeOpp.logisticsCost.toLocaleString()} UZS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {activeOpp.distanceKm} km @ 0.17/kg/km
                </span>
              </div>

              {/* Target Sell Price */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">{t.sellLabel} ({activeOpp.sellMarketName})</span>
                  <span className="font-bold text-sky-400">
                    {activeOpp.sellEstimatedPrice.toLocaleString()} UZS
                  </span>
                </div>
                <span className="text-[10px] rounded bg-sky-500/10 px-1.5 py-0.5 text-sky-400 border border-sky-500/20">
                  {t.demandSurge}
                </span>
              </div>

              {/* Net ROI Summary Box */}
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-bold">{t.netProfitLabel}:</span>
                  <span className="text-sm font-black text-amber-400">
                    +{activeOpp.netProfit.toLocaleString()} UZS / {activeOpp.standardUnit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{t.netRoiLabel}:</span>
                  <span className="text-base font-black text-emerald-400">
                    +{activeOpp.roi}% Net ROI
                  </span>
                </div>
              </div>

              {onSelectOpportunity && (
                <button
                  onClick={() => onSelectOpportunity(activeOpp)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t.whyThisOppBtn}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
