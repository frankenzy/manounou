"use client";
import Link from "next/link";
import React from "react";
import {
  Bell,
  Bookmark,
  Home,
  ListCheckIcon,
  LocateIcon,
  MessageCircle,
  MoreHorizontal,
  Settings,
  User,
  Plus,
} from "lucide-react";

type Props = {
  onOpenModal: () => void;
};

export default function Navigation({ onOpenModal }: Props) {
  return (
    <section className="w-64 h-screen sticky top-20 p-4 hidden lg:block">
      <div className="h-[calc(100vh-7rem)] rounded-2xl border border-gray-200 bg-white/95 shadow-sm backdrop-blur p-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7S13.5 3 12 3z" />
            </svg>
          </div>
        </div>

        <nav className="space-y-1.5">
          <button className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-orange-50 w-full text-left font-semibold text-gray-800 transition-colors">
            <Home className="w-6 h-6" />
            <span>
              <Link href="/">Accueil</Link>
            </span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <LocateIcon className="w-6 h-6" />
            <span>Au tour de moi</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <span className="w-6 h-6" />
            <span>Agence</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <MessageCircle className="w-6 h-6" />
            <span>Parler direct</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <ListCheckIcon className="w-6 h-6" />
            <span>Disponibles</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <Bookmark className="w-6 h-6" />
            <span>À garder</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <User className="w-6 h-6" />
            <span>Mon dossier</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <Settings className="w-6 h-6" />
            <span>Paramètres</span>
          </button>
        </nav>

        {/* Bouton New Post */}
        <button
          onClick={onOpenModal}
          className="mt-6 w-full bg-orange-500 text-white rounded-xl py-3 px-6 flex items-center justify-center gap-2 font-semibold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Announce
        </button>
      </div>
    </section>
  );
}
