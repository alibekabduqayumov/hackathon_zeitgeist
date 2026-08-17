import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Tag, Loader2, Cpu } from 'lucide-react';
import { marketEngine } from '../services/marketEngine';
import { ProductMatchResult } from '../types';

export const ProductMatchingTester: React.FC = () => {
  const { t, language } = useLanguage();
  const [inputTitle, setInputTitle] = useState('Цемент М500 50кг мешок (Qizilqum)');
  const [isMatching, setIsMatching] = useState(false);
  const [result, setResult] = useState<ProductMatchResult | null>(null);

  const testCases = [
    'Цемент М500 50кг мешок (Qizilqum)',
    'Armatura Bekabad A500C 12mm 11.7m',
    'Gipsokarton Knauf 12.5mm namlikka chidamli',
    'G\'isht pishgan standart 1-nav (1000 dona)',
    'Cement M400 Samarqand 50kg qop',
    'Rebar 16mm Bekabad A500C (1 tonna)',
  ];

  const handleMatch = async (raw: string) => {
    if (!raw.trim()) return;
    setInputTitle(raw);
    setIsMatching(true);

    try {
      const response = await fetch('/api/match-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawTitle: raw.trim(), language }),
      });

      if (response.ok) {
        const data: ProductMatchResult = await response.json();
        setResult(data);
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      // Deterministic client-side fallback
      const fallback = marketEngine.matchProduct(raw);
      setResult(fallback);
    } finally {
      setIsMatching(false);
    }
  };

  useEffect(() => {
    handleMatch(inputTitle);
  }, []);

  const getConfidenceColor = (conf: number) => {
    const val = conf <= 1 ? conf * 100 : conf;
    if (val >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const formatConfidence = (conf: number) => {
    const val = conf <= 1 ? Math.round(conf * 100) : Math.round(conf);
    return `${val}%`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl space-y-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 uppercase tracking-wide">
              {t.matchingTesterTitle}
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              {t.matchingTesterSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 border border-amber-500/30 font-sans">
            <Sparkles className="h-3 w-3" />
            Gemini 3.7 Flash AI Matcher
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-slate-400 block text-[11px] uppercase">
          {t.rawB2BTitle}
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMatch(inputTitle);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder={t.testInputPlaceholder || 'Enter raw B2B supplier listing title...'}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isMatching || !inputTitle.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isMatching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span>{t.matchBtn || 'Match'}</span>
            )}
          </button>
        </form>
      </div>

      {/* Preset Quick Tests */}
      <div className="space-y-1 pt-1">
        <span className="text-[10px] uppercase text-slate-500 block">
          {language === 'uz' ? 'Tezkor test namunalari:' : 'Quick Test Cases:'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {testCases.map((tc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleMatch(tc)}
              className="rounded-lg bg-slate-950 px-2 py-1 text-[10px] text-slate-400 hover:text-amber-400 hover:border-amber-500/40 border border-slate-800 transition-colors cursor-pointer"
            >
              {tc}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {isMatching && (
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          <span className="text-xs">{language === 'uz' ? 'AI spetsifikatsiya tahlili bajarilmoqda...' : 'Analyzing B2B specifications with Gemini AI...'}</span>
        </div>
      )}

      {!isMatching && result && (
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
            <span className="text-slate-400 uppercase text-[11px]">{t.canonicalOutput}:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getConfidenceColor(result.confidence)}`}>
                {formatConfidence(result.confidence)} {t.confidenceScore}
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-800">
                {result.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-sm font-bold text-slate-100 block">
                {result.matchedProductName}
              </span>
              <span className="text-[11px] text-slate-400 font-sans">
                {result.category} • {result.standardUnit}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
              <Cpu className="h-3 w-3 text-amber-400" />
              <span>{result.reasoning || (result as any).source || 'Gemini 3.7 Flash Normalizer'}</span>
            </div>
          </div>

          {/* Extracted Specification Attributes */}
          {result.extractedAttributes && Object.keys(result.extractedAttributes).length > 0 && (
            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] uppercase text-slate-400 font-bold block tracking-wider">
                {t.extractedAttributes || 'Extracted Specifications'}:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {result.extractedAttributes.grade && (
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Grade</span>
                    <span className="text-slate-200 font-semibold">{result.extractedAttributes.grade}</span>
                  </div>
                )}
                {result.extractedAttributes.weightKg !== undefined && (
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Unit Weight</span>
                    <span className="text-slate-200 font-semibold">{result.extractedAttributes.weightKg} kg</span>
                  </div>
                )}
                {result.extractedAttributes.packaging && (
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Packaging</span>
                    <span className="text-slate-200 font-semibold">{result.extractedAttributes.packaging}</span>
                  </div>
                )}
                {result.extractedAttributes.brand && (
                  <div className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Brand / Mill</span>
                    <span className="text-slate-200 font-semibold">{result.extractedAttributes.brand}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
