import React, { useState } from 'react';
import { Market, Listing, Product } from '../types';
import { DISTANCE_MATRIX_KM } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Truck,
  Building,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface MarketsViewProps {
  markets: Market[];
  listings: Listing[];
  products: Product[];
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  markets,
  listings,
  products,
}) => {
  const { t, language } = useLanguage();
  const [selectedMarketId, setSelectedMarketId] = useState<string>('mkt-tashkent');

  const selectedMarket =
    markets.find((m) => m.id === selectedMarketId) || markets[0];
  const marketListings = listings.filter(
    (l) => l.marketId === selectedMarketId
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold font-mono text-slate-100 uppercase tracking-wider">
                {t.regionalHubsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.regionalHubsSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <div
              id="markets-disclaimer-badge"
              className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-mono text-amber-300/90 border border-amber-500/30 shadow-sm"
              title={t.dataSourceDisclaimer}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span className="truncate max-w-[260px] sm:max-w-none">{t.dataSourceDisclaimer}</span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 border border-slate-700 text-slate-300">
              6 {t.regionalHubs}
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{listings.length} {language === 'uz' ? 'jonli takliflar' : 'Live Feeds'}</span>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {markets.map((mkt) => {
            const count = listings.filter((l) => l.marketId === mkt.id).length;
            const isSelected = mkt.id === selectedMarketId;

            return (
              <div
                key={mkt.id}
                onClick={() => setSelectedMarketId(mkt.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                  isSelected
                    ? 'border-amber-500/80 bg-slate-800/90 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`h-4 w-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <h3 className="font-bold text-sm text-slate-100 font-mono">{mkt.city}</h3>
                  </div>
                  <span className="text-[10px] font-mono rounded bg-slate-900 px-2 py-0.5 text-slate-300 border border-slate-800">
                    {count} {language === 'uz' ? 'taklif' : 'listings'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 font-mono">{mkt.hubType}</div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">{t.demandLabel}</span>
                    <span className={`font-semibold ${mkt.demandLevel === 'High' ? 'text-amber-400' : 'text-slate-300'}`}>
                      {mkt.demandLevel}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">{t.supplyLabel}</span>
                    <span className={`font-semibold ${mkt.supplyLevel === 'High' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {mkt.supplyLevel}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">{t.distanceToCapital}</span>
                    <span className="font-mono text-slate-300">
                      {DISTANCE_MATRIX_KM[mkt.id]?.['mkt-tashkent'] || 0} km
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Market Listing Feeds Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              {t.liveVendorFeeds} {selectedMarket.city.toUpperCase()} ({selectedMarket.region})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.liveVendorFeedsSubtitle}
            </p>
          </div>

          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300 border border-slate-700">
            {marketListings.length} {language === 'uz' ? 'Faol Takliflar' : 'Active Feeds'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-medium">{t.rawTitle}</th>
                <th className="pb-3 font-medium">{t.vendorSupplier}</th>
                <th className="pb-3 font-medium text-right">{t.rawPrice}</th>
                <th className="pb-3 font-medium text-right">{t.normalizedPrice}</th>
                <th className="pb-3 font-medium text-center">{t.availableStock}</th>
                <th className="pb-3 font-medium text-right">{t.updatedTime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {marketListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-sans max-w-xs truncate text-slate-200">
                    {item.rawTitle}
                  </td>
                  <td className="py-3 font-sans text-slate-400">{item.seller}</td>
                  <td className="py-3 text-right text-slate-400">
                    {item.priceRaw.toLocaleString()} UZS / {item.unitRaw}
                  </td>
                  <td className="py-3 text-right font-bold text-amber-400">
                    {item.priceNormalized.toLocaleString()} UZS
                  </td>
                  <td className="py-3 text-center text-slate-300">
                    {item.quantityAvailable.toLocaleString()} {item.unitRaw}
                  </td>
                  <td className="py-3 text-right text-slate-500 text-[10px]">
                    {item.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inter-city Road Distance Matrix (km) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
              {t.distanceMatrixTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{t.freightTariffNote}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 text-left font-medium">{t.originDest}</th>
                {markets.map((m) => (
                  <th key={m.id} className="pb-3 font-medium text-slate-300">
                    {m.city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {markets.map((origin) => (
                <tr key={origin.id} className="hover:bg-slate-800/20">
                  <td className="py-2.5 text-left font-semibold text-slate-300 font-sans">
                    {origin.city}
                  </td>
                  {markets.map((dest) => {
                    const dist = DISTANCE_MATRIX_KM[origin.id]?.[dest.id] || 0;
                    return (
                      <td
                        key={dest.id}
                        className={`py-2.5 ${
                          origin.id === dest.id
                            ? 'text-slate-600'
                            : dist > 400
                            ? 'text-amber-400/90'
                            : 'text-emerald-400'
                        }`}
                      >
                        {dist === 0 ? '—' : `${dist} km`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
