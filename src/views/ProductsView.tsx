import React from 'react';
import { Product, Listing } from '../types';
import { ProductMatchingTester } from '../components/ProductMatchingTester';
import { useLanguage } from '../context/LanguageContext';
import { Package, Sparkles, Layers, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  listings: Listing[];
  onSelectProduct: (productId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  listings,
  onSelectProduct,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Product Catalog Overview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold font-mono text-slate-100 uppercase tracking-wider">
                {t.productCatalogTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.productCatalogSubtitle}
            </p>
          </div>

          <span className="rounded bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 border border-slate-700">
            {products.length} {t.trackedCategories}
          </span>
        </div>

        {/* Product Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {products.map((p) => {
            const count = listings.filter((l) => l.productId === p.id).length;

            return (
              <div
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono rounded bg-slate-900 px-2 py-0.5 text-slate-400 border border-slate-800">
                      {count} {language === 'uz' ? 'manbalar' : 'feeds'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mt-1 font-mono">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">{t.standardUnit}:</span>
                    <span className="text-slate-200 font-semibold">{p.standardUnit}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">{t.unitTareWeight}:</span>
                    <span className="text-slate-200 font-semibold">{p.weightKg} kg</span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(p.id)}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                  >
                    <span>{t.analyzeMarketSpreads}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 3: Product Matching AI Tester Component */}
      <ProductMatchingTester />
    </div>
  );
};
