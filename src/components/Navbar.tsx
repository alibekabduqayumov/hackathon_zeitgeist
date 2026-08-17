import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Activity,
  Layers,
  MapPin,
  Package,
  Calculator,
  Radar,
  RefreshCw,
  Search,
  Sparkles,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScanClick: () => void;
  isScanning: boolean;
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onScanClick,
  isScanning,
  selectedProduct,
  setSelectedProduct,
}) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: Activity },
    { id: 'opportunities', label: t.navOpportunities, icon: TrendingUp },
    { id: 'markets', label: t.navMarkets, icon: MapPin },
    { id: 'products', label: t.navProducts, icon: Package },
    { id: 'simulator', label: t.navSimulator, icon: Calculator },
    { id: 'analytics', label: t.navAnalytics, icon: Radar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Telemetry Ticker */}
      <div className="border-b border-slate-900 bg-slate-950 px-4 py-1.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
              {t.telemetryActive}
            </span>
            <span className="text-slate-600">|</span>
            <span>
              <strong className="text-slate-300">CEMENT M500:</strong> Qarshi (78k) → Tashkent (96k)
              <span className="ml-1 text-emerald-400 font-semibold">+17.1% ROI</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              <strong className="text-slate-300">REBAR 12MM:</strong> Samarkand (9.2M) → Tashkent (10.6M)
              <span className="ml-1 text-emerald-400 font-semibold">+13.8% ROI</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              <strong className="text-slate-300">GYPSUM BOARD:</strong> Bukhara (38k) → Tashkent (49k)
              <span className="ml-1 text-emerald-400 font-semibold">+14.2% ROI</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 text-slate-400">
            <span
              id="navbar-disclaimer-badge"
              className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-2.5 py-0.5 font-mono text-[10px] text-amber-300/90 border border-amber-500/25"
              title={t.dataSourceDisclaimer}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span className="max-w-[200px] lg:max-w-none truncate">{t.dataSourceDisclaimer}</span>
            </span>
            <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-800">
              {t.telemetryNode}
            </span>
            <span>{t.latency}</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-lg font-black tracking-wider text-slate-100">
                  {t.brandName}
                </span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  AI ARBITRAGE
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-400 hidden sm:block">
                {t.brandTagline}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 shadow-sm shadow-black/40 border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher & Scan CTA */}
        <div className="flex items-center gap-3">
          {/* Language Selector Switch */}
          <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setLanguage('uz')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold font-mono transition-all cursor-pointer ${
                language === 'uz'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="O'zbek tili"
            >
              <span>🇺🇿</span>
              <span>UZ</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold font-mono transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          <button
            onClick={onScanClick}
            disabled={isScanning}
            className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all disabled:opacity-75 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : 'group-hover:rotate-90 transition-transform'}`} />
            <span>{isScanning ? t.scanningText : t.scanMarketBtn}</span>
            <span className="rounded bg-slate-950/20 px-1 py-0.2 font-mono text-[9px] text-slate-900 font-bold hidden sm:inline-block">
              {t.listingsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-900 bg-slate-950 px-2 py-1.5 scrollbar-none">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${
                  isActive
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
