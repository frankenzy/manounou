"use client";
import CreateAnnouncement from "@/components/CreateAnnouncement";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import {
  Bell,
  Bookmark,
  Edit,
  Hash,
  Heart,
  Home,
  ListCheckIcon,
  LocateIcon,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Repeat2,
  Search,
  Settings,
  Share,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function BlueskyLayout() {
  const [annonces, setAnnonces] = useState<IAnnouncementDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch("/api/announcements");
      const data = await response.json();

      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setAnnonces(data);
      } else if (data && Array.isArray(data.data)) {
        setAnnonces(data.data);
      } else {
        console.log("Data is not an array:", data);
        setAnnonces([]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnonces([]);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const InfoPanel = () => {
    return (
      <section className="w-80 p-4 space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Recghercher"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Onglets Discover/Following */}
        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          <button className="flex-1 bg-white rounded-md py-2 px-4 text-sm font-semibold shadow-sm">
            Nouveau
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-semibold text-gray-600">
            Mes postes
          </button>
        </div>

        <div className="hidden">
          {/* Follow suggestion */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Follow 10 people to get started</h3>
              <button className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="flex gap-2 mb-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"
                ></div>
              ))}
            </div>
            <button className="w-full bg-orange-500 text-white rounded-full py-2 font-semibold hover:bg-orange-600">
              Find people to follow
            </button>
          </div>

          {/* Trending */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Trending</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                "Trump's Board of Peace",
                "Mets Trade",
                "Swerve Strickland",
                "AEW Dynamite",
                "Kenny Omega",
              ].map((trend, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{i + 1}.</span>
                  <span className="text-sm">{trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
            <a href="#" className="hover:underline">
              Feedback
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Help
            </a>
          </div>
        </div>
      </section>
    );
  };

  const handleOpenMOdal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Menu pour les posts avec options (éditer, supprimer, etc.)
  const PostMenu = ({ announcementId }: { announcementId?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleEdit = () => {
      console.log("Edit announcement:", announcementId);
      setIsOpen(false);
      // Implémenter la logique d'édition
    };

    const handleDelete = async () => {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
        try {
          const response = await fetch(`/api/announcements/${announcementId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            fetchAnnonces();
          }
        } catch (error) {
          console.error("Error deleting announcement:", error);
        }
      }
      setIsOpen(false);
    };

    const handleShare = () => {
      console.log("Share announcement:", announcementId);
      setIsOpen(false);
      // Implémenter la logique de partage
    };

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Options"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
            >
              <Share className="w-4 h-4" />
              Partager
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>
    );
  };

  const Navigation = () => {
    return (
      <section className="w-64 h-screen sticky top-0 border-r border-gray-200 p-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7S13.5 3 12 3z" />
            </svg>
          </div>
        </div>

        <nav className="space-y-2">
          <button className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left font-semibold">
            <Home className="w-6 h-6" />
            <span>
              <a href="/">Accueil</a>
            </span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <LocateIcon className="w-6 h-6" />
            <span>Au tour de moi</span>
          </button>
          <button className="hidden items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 w-full text-left">
            <Hash className="w-6 h-6" />
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
          onClick={handleOpenMOdal}
          className="mt-6 w-full bg-orange-500 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-semibold hover:bg-orange-600"
        >
          <Plus className="w-5 h-5" />
          Announce
        </button>
      </section>
    );
  };

  const Main = () => {
    return (
      <div className="flex-1 max-w-2xl border-r border-gray-200">
        {/* Header avec tabs */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex">
            <button className="flex-1 py-4 text-center font-semibold border-b-2 border-orange-500 text-orange-500">
              Nouveau
            </button>
            <button className="flex-1 py-4 text-center font-semibold text-gray-600 hover:bg-gray-50">
              Mes postes
            </button>
          </div>
        </div>

        {/* Posts */}
        {/* Post 2 avec image */}
        <div className="p-4 hover:bg-gray-50">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  Brock's Photographic Journey
                </span>
                <span className="text-gray-500 text-sm">
                  @bar44.bsky.social
                </span>
                <span className="text-gray-500 text-sm">· 5h</span>
              </div>
              <p className="mb-3">
                Shopfront in Lisboa.{" "}
                <span className="text-green-600">#WindowsOnWednesday</span>{" "}
                <span className="text-green-600">#Photography</span>{" "}
                <span className="text-green-600">#Architecture</span>{" "}
                <span className="text-green-600">#Doors</span>{" "}
                <span className="text-green-600">#Portugal</span>{" "}
                <span className="text-green-600">#Lisbon</span> 📸
              </p>

              {/* Image */}
              <div className="mb-3 rounded-lg overflow-hidden">
                <div className="w-full h-80 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
              </div>

              <div className="flex items-center gap-8 text-gray-500 text-sm">
                <button className="flex items-center gap-2 hover:text-green-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>9</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500">
                  <Repeat2 className="w-4 h-4" />
                  <span>41</span>
                </button>
                <button className="flex items-center gap-2 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                  <span>660</span>
                </button>
                <button className="hover:text-orange-500">
                  <Share className="w-4 h-4" />
                </button>
                <button className="hover:text-gray-700">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.isArray(annonces) && annonces.length > 0 ? (
            annonces.map((annonce: IAnnouncementDTO) => {
              const metadata = annonce.metadata;
              const bgClass = metadata?.background || metadata?.backgroundColor;
              const metaColor = metadata?.backgroundColor;
              const metaSize = metadata?.fontSize;
              return (
                <div key={annonce.id} className="p-4 hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{annonce.title}</span>
                          <span className="text-gray-500 text-sm">
                            @{annonce.created_ad?.toDateString()}
                          </span>
                          <span className="text-gray-500 text-sm">· 1h</span>
                        </div>

                        <PostMenu announcementId={annonce.id} />
                      </div>

                      <div
                        className={`${bgClass ?? "bg-gray-200"} p-4 rounded-lg mb-3 h-48 items-center flex justify-center`}
                        style={{
                          backgroundColor: metaColor,
                          fontSize: metaSize,
                        }}
                      >
                        <p
                          className={`${metaSize ?? "text-lg"} ${bgClass ? "text-white" : "text-black"} font-semibold mb-3`}
                        >
                          {annonce.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-8 text-gray-500 text-sm">
                        <button className="flex items-center gap-2 hover:text-green-600">
                          <MessageCircle className="w-4 h-4" />
                          <span>10</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500">
                          <Repeat2 className="w-4 h-4" />
                          <span>187</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>1K</span>
                        </button>
                        <button className="hover:text-orange-500">
                          <Share className="w-4 h-4" />
                        </button>
                        <button className="hover:text-gray-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              {annonces.length === 0
                ? "Aucune annonce pour le moment"
                : "Chargement..."}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        <Navigation />

        <Main />

        <InfoPanel />
      </div>
      <CreateAnnouncement
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchAnnonces}
      />
    </div>
  );
}
