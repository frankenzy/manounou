"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showOnlyReposts: boolean;
  setShowOnlyReposts: (v: boolean) => void;
  sortMode: "recent" | "engaged";
  setSortMode: (v: "recent" | "engaged") => void;
};

export default function FilterDrawer({
  isFilterOpen,
  setIsFilterOpen,
  searchQuery,
  setSearchQuery,
  showOnlyReposts,
  setShowOnlyReposts,
  sortMode,
  setSortMode,
}: Props) {
  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 z-30 bg-black/35 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Panneau des filtres"
            className="fixed right-0 top-0 z-40 h-full w-[86%] max-w-sm overflow-y-auto bg-white border-l border-gray-200 p-4 pb-6 shadow-2xl xl:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Filtres</h3>
              <button
                type="button"
                aria-label="Fermer le panneau de filtres"
                className="rounded-lg border border-gray-200 p-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Recherche</label>
                <input
                  type="text"
                  aria-label="Recherche dans le fil"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Titre, contenu..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showOnlyReposts}
                  onChange={(event) => setShowOnlyReposts(event.target.checked)}
                  className="accent-orange-500"
                />
                Reposts uniquement
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSortMode("recent")}
                  aria-pressed={sortMode === "recent"}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${sortMode === "recent" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}
                >
                  Plus récents
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("engaged")}
                  aria-pressed={sortMode === "engaged"}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${sortMode === "engaged" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}
                >
                  Plus engageants
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Appliquer
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
