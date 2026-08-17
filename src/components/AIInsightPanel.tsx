import React, { useState, useEffect } from 'react';
import { MarketInsight } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export const AIInsightPanel: React.FC = () => {
  const { t, language } = useLanguage();
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInsight = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      setInsight(data);
    } catch (err) {
      console.error('Failed to load market insight:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [language]);

  if (!insight && !isLoading) return null;

  return (
    <div className="w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-950 p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
                {t.macroInsightTitle}
              </h3>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {t.aiConfidence}: {insight?.confidence || 89}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.macroInsightSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsight}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (language === 'uz' ? 'Yangilanmoqda...' : 'Refreshing...') : (language === 'uz' ? 'Yangilash' : 'Refresh')}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 space-x-3 text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></div>
          <span className="text-xs font-mono">{t.aiAnalyzing}</span>
        </div>
      ) : (
        insight && (
          <div className="space-y-4">
            {/* Main Headline & Summary */}
            <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
              <h4 className="text-sm font-bold font-mono text-amber-300 mb-1.5 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                {insight.headline}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {insight.summary}
              </p>
            </div>

            {/* Pressure Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {insight.marketPressures?.map((press, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 font-mono text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{press.market}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-400 border border-slate-700">
                      {press.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{press.product}</div>
                  <div className="text-slate-300 text-[11px] pt-1 leading-snug">
                    {press.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation Callout */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 p-3.5 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 block uppercase tracking-wide">
                  {t.strategicRecommendation}
                </span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
