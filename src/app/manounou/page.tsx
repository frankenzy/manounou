"use client";
import Link from "next/link";
import { AnnouncementModal } from "@/components/Announcement";
import AnnounceSkeleton from "@/components/Announcement/AnnounceSkeleton";
import Comment from "@/components/comments/comment";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import { RelativeTime } from "@/components/RelativeTime";
import {
  Bell,
  Bookmark,
  ChevronDown,
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


const enum NavTabs {
  Annonces = 'annonces',
  MesAnnonces = 'mes-annonces',
}


export default function BlueskyLayout() {
  const [annonces, setAnnonces] = useState<IAnnouncementDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncementDTO | undefined>(undefined);
  const [activeNavTab, setActiveNavTab] = useState<NavTabs>(NavTabs.Annonces);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [tabs, setTabs] = useState<'job-seeker' | 'employer'>('job-seeker');

  const [openCommentId, setOpenCommentId] = useState<string | number | null>(null);

  const handleOpenComment = (announcementId: string | number) => {
    if (openCommentId === announcementId) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(announcementId);
    }
  };

  const handleCommentModalClose = () => {
    setCommentModalOpen(false);
  };

  const fetchAnnonces = async () => {
    try {
      const response = await fetch("/api/announcements");
      const data = await response.json();

      if (Array.isArray(data)) {
        setAnnonces(data);
      } else if (data && Array.isArray(data.data)) {
        setAnnonces(data.data);
      } else {
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
      <section className="relative w-80 p-4 space-y-4 hidden xl:block">
        {/* Barre de recherche */}
        <div className="relative rounded-2xl border border-gray-200 bg-white/95 shadow-sm backdrop-blur px-3 py-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Recghercher"
            className="w-full pl-8 pr-2 py-1.5 bg-transparent rounded-xl focus:outline-none text-sm"
          />
        </div>

        {/* Onglets Discover/Following */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 flex gap-2 justify-between shadow-sm">
          <button
            className={`flex-1 ${activeNavTab === NavTabs.Annonces ? "bg-orange-50 text-orange-600 rounded-xl border border-orange-100" : "text-gray-600"} py-2 w-full px-4 text-sm font-semibold transition-all`}
            onClick={() => {
              setActiveNavTab(NavTabs.Annonces);
            }}
          >
            Nouveau
          </button>
          <button
            className={`flex-1 ${activeNavTab === NavTabs.MesAnnonces ? "bg-orange-50 text-orange-600 rounded-xl border border-orange-100" : "text-gray-600"} py-2 px-4 text-sm w-full font-semibold transition-all`}
            onClick={() => {
              setActiveNavTab(NavTabs.MesAnnonces);
            }}
          >
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

  const handleOpenModal = () => {
    setSelectedAnnouncement(undefined); // Reset pour création
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(undefined); // Reset après fermeture
  };

  // Menu pour les posts avec options (éditer, supprimer, etc.)
  const PostMenu = ({ announcementId }: { announcementId?: string | number }) => {
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

    const handleEdit = async () => {
      console.log("Edit announcement:", announcementId);
      setIsOpen(false);

      // Récupérer les données complètes de l'annonce
      try {
        const response = await fetch(`/api/announcements/${announcementId}`);

        if (response.ok) {
          const result = await response.json();

          console.log("Fetch response for edit:", result.data);



          if (result.success) {
            setSelectedAnnouncement(result.data);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching announcement for edit:", error);
      }
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

    const handleShare = async () => {
      console.log("Share announcement:", announcementId);
      try {
        const response = await fetch(`/api/announcements/${announcementId}`);

      setIsOpen(false);

        if (response.ok) {
          const result = await response.json();

          console.log("Fetch response for edit:", result.data);

          if (result.success) {
            setSelectedAnnouncement(result.data);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching announcement for edit:", error);
      }

    };

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
          aria-label="Options"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={handleShare}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <Share className="w-4 h-4" />
              Partager
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600"
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
            onClick={handleOpenModal}
            className="mt-6 w-full bg-orange-500 text-white rounded-xl py-3 px-6 flex items-center justify-center gap-2 font-semibold hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Announce
          </button>
        </div>
      </section>
    );
  };




  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const btnJobRef = useRef<HTMLButtonElement | null>(null);
  const btnEmpRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: string; width: string }>({ left: "0px", width: "0px" });

  useEffect(() => {
    const update = () => {
      const container = tabsContainerRef.current;
      const activeBtn = tabs === "job-seeker" ? btnJobRef.current : btnEmpRef.current;
      if (container && activeBtn) {
        const cRect = container.getBoundingClientRect();
        const bRect = activeBtn.getBoundingClientRect();
        setIndicator({ left: `${bRect.left - cRect.left}px`, width: `${bRect.width}px` });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [tabs]);

  const Main = () => {
    return (
      <div className="w-full lg:flex-1 lg:max-w-3xl">

        <div className="sticky top-[4.5rem] md:top-20 bg-white/90 border border-gray-200 rounded-2xl z-10 p-2 backdrop-blur shadow-sm">
          <div ref={tabsContainerRef} className="relative">
            <div className="flex bg-gray-50 rounded-xl p-1">
              <button
                ref={btnJobRef}
                className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === "job-seeker" ? "text-orange-600 shadow-sm bg-white" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setTabs("job-seeker")}
                aria-pressed={tabs === "job-seeker"}
              >
                Je cherche un travail
              </button>

              <button
                ref={btnEmpRef}
                className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === "employer" ? "text-orange-600 shadow-sm bg-white" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setTabs("employer")}
                aria-pressed={tabs === "employer"}
              >
                J’ai besoin de quelqu’un
              </button>
            </div>

            <span
              aria-hidden
              className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />
          </div>
        </div>
        {Array.isArray(annonces) && annonces.length > 0 ? (
          annonces.map((annonce: IAnnouncementDTO) => {
            const metadata = annonce.metadata as Record<string, string> | undefined;
            const bgClass = metadata?.background || metadata?.backgroundColor;
            const metaColor = metadata?.backgroundColor as string | undefined;
            const metaSize = metadata?.fontSize;
            return (
              <div key={annonce.id} className="mt-3 md:mt-4 rounded-2xl border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl flex-shrink-0 shadow-sm"></div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">

                        <span className="font-semibold text-gray-900 text-sm md:text-base">{annonce.title}</span>
                        <span className="text-gray-500 text-xs md:text-sm">
                          @{annonce.created_at ? new Date(annonce.created_at as unknown as Date).toLocaleDateString() : ""}
                        </span>
                        <span className="text-gray-500 text-xs md:text-sm items-end">
                          <RelativeTime date={annonce.created_at ? annonce.created_at : annonce.updated_at || ""} />
                        </span>
                      </div>

                      <PostMenu announcementId={annonce.id} />
                    </div>

                    <div
                      className={`${bgClass ? `${bgClass} items-center` : "bg-gray-50 items-start"} p-4 rounded-lg min-h-[180px] flex flex-col gap-4 justify-center overflow-hidden`}
                      style={{
                        backgroundColor: metaColor,
                        fontSize: metaSize,
                      }}
                    >

                      <p
                        className={`${metaSize ?? "text-base md:text-lg"} ${bgClass ? "text-white" : "text-neutral-500"} font-semibold mb-1 md:mb-2 leading-relaxed`}
                      >
                        {annonce.description}
                      </p>

                      {/* Afficharge des images */}
                      {metadata?.image && typeof metadata.image === "string" && (
                        <figure className="w-full relative overflow-hidden rounded-xl border border-white/40 bg-black/5 aspect-[4/5] md:aspect-[16/10]">
                          <img
                            src={metadata.image}
                            alt="Announcement Image"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 720px"
                            className="object-cover w-full h-full relative z-0 transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </figure>
                      )}

                    </div>
                    <div className="flex justify-between items-center gap-1 md:gap-3 text-gray-500 text-xs md:text-sm bg-gray-50 px-2 md:px-3 py-2.5 md:py-3 rounded-xl mt-2 border border-gray-100 overflow-x-auto">
                      <button
                        className="flex items-center gap-1.5 md:gap-2 hover:text-green-600 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap"

                        onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)}

                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{annonce.commentCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 md:gap-2 hover:text-green-500 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap">
                        <Repeat2 className="w-4 h-4" />
                        <span>187</span>
                      </button>
                      <button className="flex items-center gap-1.5 md:gap-2 hover:text-red-500 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap">
                        <Heart className="w-4 h-4" />
                        <span>1K</span>
                      </button>
                      <button className="flex hover:text-orange-500 rounded-lg p-1.5 hover:bg-white transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                      <button className="flex hover:text-gray-700 rounded-lg p-1.5 hover:bg-white transition-colors">
                        <ChevronDown className="w-4 h-4"
                          onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)} />
                      </button>
                    </div>
                    {
                      openCommentId === annonce.id && (
                        <div className="min-h-20 m-h-60 relative z-10 rounded-b-lg -mt-2">
                          <Comment
                            isOpen={true}
                            onClose={() => setOpenCommentId(null)}
                            annonce={annonce}
                          />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            <AnnounceSkeleton />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="p-4 w-full fixed top-0 bg-white/90 border-b border-gray-200 z-20 backdrop-blur">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-orange-500 tracking-tight">Manounou Job</h1>
      </div>
      <div className="max-w-7xl mx-auto flex gap-3 md:gap-4 px-2 sm:px-3 md:px-4 pb-24 lg:pb-0">
        <Navigation />

        <Main />

        <InfoPanel />
      </div>

      <button
        onClick={handleOpenModal}
        className="fixed lg:hidden bottom-5 right-4 z-30 bg-orange-500 text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-semibold">Announce</span>
      </button>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchAnnonces}
        announcement={selectedAnnouncement}
      />

      {selectedAnnouncement && (
        <Comment
          isOpen={commentModalOpen}
          onClose={handleCommentModalClose}
          annonce={selectedAnnouncement}
        />
      )}
    </div>
  );
}
