'use client';
import { Search, SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ParticleFieldScene = dynamic(() => import('@/components/premium/webgl/ParticleFieldScene'), {
  ssr: false,
});

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeNavTab: 'annonces' | 'mes-annonces';
  setActiveNavTab: (v: 'annonces' | 'mes-annonces') => void;
  showOnlyReposts: boolean;
  setShowOnlyReposts: (v: boolean) => void;
  sortMode: 'recent' | 'engaged';
  setSortMode: (v: 'recent' | 'engaged') => void;
};

export default function InfoPanel({
  searchQuery,
  setSearchQuery,
  activeNavTab,
  setActiveNavTab,
  showOnlyReposts,
  setShowOnlyReposts,
  sortMode,
  setSortMode,
}: Props) {
  return (
    <section className="relative w-80 p-4 space-y-4 hidden xl:block">
      <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white/95 shadow-sm backdrop-blur px-3 py-2">
        <Suspense fallback={null}>
          <ParticleFieldScene />
        </Suspense>
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Rechercher un job ou un post"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          className="w-full pl-8 pr-2 py-1.5 bg-transparent rounded-xl focus:outline-none text-sm"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-1.5 flex gap-2 justify-between shadow-sm">
        <button
          className={`flex-1 ${activeNavTab === 'annonces' ? 'bg-orange-50 text-orange-600 rounded-xl border border-orange-100' : 'text-gray-600'} py-2 w-full px-4 text-sm font-semibold transition-all`}
          onClick={() => setActiveNavTab('annonces')}
        >
          Nouveau
        </button>
        <button
          className={`flex-1 ${activeNavTab === 'mes-annonces' ? 'bg-orange-50 text-orange-600 rounded-xl border border-orange-100' : 'text-gray-600'} py-2 px-4 text-sm w-full font-semibold transition-all`}
          onClick={() => setActiveNavTab('mes-annonces')}
        >
          Mes postes
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Filtres intelligents</h3>
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        </div>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={showOnlyReposts}
              onChange={event => setShowOnlyReposts(event.target.checked)}
              className="accent-orange-500"
            />
            Afficher seulement les reposts
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSortMode('recent')}
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${sortMode === 'recent' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'}`}
            >
              Plus récents
            </button>
            <button
              type="button"
              onClick={() => setSortMode('engaged')}
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${sortMode === 'engaged' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'}`}
            >
              Plus engageants
            </button>
          </div>
        </div>
      </div>
      <div className="hidden">
        {/* Follow suggestion, trending, footer links preserved in original but hidden */}
      </div>
    </section>
  );
}
