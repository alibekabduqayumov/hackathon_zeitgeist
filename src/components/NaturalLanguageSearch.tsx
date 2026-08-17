import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles, ArrowRight, CornerDownLeft, Filter } from 'lucide-react';

interface NaturalLanguageSearchProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

export const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onSearch,
  isLoading,
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');

  const suggestions =
    language === 'uz'
      ? [
          { text: 'Tsement bo\'yicha 15% dan yuqori ROI imkoniyatlari', desc: 'Sement M500 spredi' },
          { text: 'Qarshidan Toshkentga eng foydali yo\'nalishlar', desc: 'Hududiy koridor' },
          { text: 'Armatura 12mm bo\'yicha Bekobod va Samarqand narxlari', desc: 'Po\'lat armatura' },
          { text: 'Talab yuqori bo\'lgan gipsokarton narxlari', desc: 'Buxoro -> Toshkent' },
        ]
      : [
          { text: 'Find cement opportunities with ROI > 15%', desc: 'Cement M500 Arbitrage' },
          { text: 'Best routes from Qarshi to Tashkent', desc: 'Regional Corridor' },
          { text: 'Top rebar 12mm spreads from Bekabad/Samarkand', desc: 'Steel Rebar Spread' },
          { text: 'Gypsum board high-demand trade windows', desc: 'Bukhara to Tashkent' },
        ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            {t.nlSearchTitle}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Gemini 3.7 Flash • B2B Parser
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.nlSearchPlaceholder}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-28 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-md"
        >
          {isLoading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
          ) : (
            <>
              <span>{t.runAiQuery}</span>
              <CornerDownLeft className="h-3 w-3" />
            </>
          )}
        </button>
      </form>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Filter className="h-3 w-3" />
          {t.suggestedQueries}:
        </span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(sug.text);
              onSearch(sug.text);
            }}
            className="group flex items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 py-1 text-xs text-slate-300 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span className="font-mono text-[11px]">{sug.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
