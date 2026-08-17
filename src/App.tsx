import React, { useState, useEffect } from 'react';
import {
  Product,
  Market,
  Listing,
  Opportunity,
  AnomalyReport,
  MarketSnapshot,
  PriceHistoryPoint,
} from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { OpportunityModal } from './components/OpportunityModal';
import { ScanMarketModal } from './components/ScanMarketModal';
import { ArbitrageSimulator } from './components/ArbitrageSimulator';
import { DashboardView } from './views/DashboardView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { MarketsView } from './views/MarketsView';
import { ProductsView } from './views/ProductsView';
import { AnalyticsView } from './views/AnalyticsView';
import {
  PRODUCTS,
  MARKETS,
  INITIAL_LISTINGS,
  DEMO_PRICE_HISTORY,
} from './data/mockData';
import { Sparkles, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';

function ZeitgeistApp() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-cement-m500');

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [markets, setMarkets] = useState<Market[]>(MARKETS);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>(DEMO_PRICE_HISTORY);

  const [snapshot, setSnapshot] = useState<MarketSnapshot>({
    totalListings: 142,
    totalMarkets: 6,
    avgPrice: 80500,
    lowestPrice: 78000,
    highestPrice: 96000,
    priceSpread: 18000,
    opportunitiesDetected: 7,
    avgOpportunityScore: 86,
    highValueOpportunitiesCount: 3,
  });

  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState<Opportunity | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [aiFilterNotification, setAiFilterNotification] = useState<string | null>(null);

  // Fetch data on load and when product changes
  const loadProductData = async (prodId: string) => {
    try {
      const [oppRes, snapRes, anomRes, histRes] = await Promise.all([
        fetch(`/api/opportunities?productId=${prodId}`),
        fetch(`/api/snapshot?productId=${prodId}`),
        fetch(`/api/anomalies?productId=${prodId}`),
        fetch(`/api/history`),
      ]);

      if (oppRes.ok) {
        const oppData = await oppRes.json();
        setOpportunities(oppData);
      }
      if (snapRes.ok) {
        const snapData = await snapRes.json();
        setSnapshot(snapData);
      }
      if (anomRes.ok) {
        const anomData = await anomRes.json();
        setAnomalies(anomData);
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setPriceHistory(histData);
      }
    } catch (err) {
      console.error('Failed to load product data:', err);
    }
  };

  useEffect(() => {
    loadProductData(selectedProductId);
  }, [selectedProductId]);

  // Handle Full Pipeline Scan
  const handleScanClick = () => {
    setIsScanModalOpen(true);
  };

  const handleScanComplete = async () => {
    setIsScanModalOpen(false);
    setIsScanning(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProductId }),
      });
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.topOpportunities);
        setSnapshot(data.snapshot);
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Natural Language Search Query
  const handleSearchQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      setAiFilterNotification(null);
      loadProductData(selectedProductId);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
      });
      const data = await res.json();
      if (data.results) {
        setOpportunities(data.results);
        if (data.filters?.productId) {
          setSelectedProductId(data.filters.productId);
        }
        if (data.filters?.summary) {
          setAiFilterNotification(data.filters.summary);
        }
      }
    } catch (err) {
      console.error('AI Query failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const currentProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Navigation Header with Language Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onScanClick={handleScanClick}
        isScanning={isScanning}
        selectedProduct={selectedProductId}
        setSelectedProduct={setSelectedProductId}
      />

      {/* Main Content Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* AI Query Notification Banner */}
        {aiFilterNotification && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-3 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>
                <strong className="text-indigo-300">
                  {language === 'uz' ? 'AI So\'rov Natijasi:' : 'AI Query Result:'}
                </strong>{' '}
                {aiFilterNotification}
              </span>
            </div>
            <button
              onClick={() => {
                setAiFilterNotification(null);
                loadProductData(selectedProductId);
              }}
              className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'dashboard' && (
          <DashboardView
            products={products}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            snapshot={snapshot}
            opportunities={opportunities}
            anomalies={anomalies}
            markets={markets}
            onSelectOpportunity={(opp) => setSelectedOpportunityForModal(opp)}
            onSearchQuery={handleSearchQuery}
            isSearching={isSearching}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            products={products}
            onSelectOpportunity={(opp) => setSelectedOpportunityForModal(opp)}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsView
            markets={markets}
            listings={listings}
            products={products}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            listings={listings}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <ArbitrageSimulator
            products={products}
            markets={markets}
            initialProductId={selectedProductId}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            anomalies={anomalies}
            markets={markets}
            opportunities={opportunities}
            currentProduct={currentProduct}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-300">ZEITGEIST</span>
            <span>•</span>
            <span>{t.brandTagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>{language === 'uz' ? 'Deterministik Marja Hisobi' : 'Deterministic Unit Economics'}</span>
            <span>•</span>
            <span>Gemini 3.7 Flash AI</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">
              {t.legalDisclaimer}
            </span>
          </div>
        </div>
      </footer>

      {/* Opportunity Deep Dossier Modal */}
      <OpportunityModal
        opportunity={selectedOpportunityForModal}
        onClose={() => setSelectedOpportunityForModal(null)}
        onSimulate={(opp) => {
          setSelectedProductId(opp.productId);
          setActiveTab('simulator');
        }}
      />

      {/* Pipeline Scan Modal */}
      <ScanMarketModal
        isOpen={isScanModalOpen}
        onComplete={handleScanComplete}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ZeitgeistApp />
    </LanguageProvider>
  );
}
