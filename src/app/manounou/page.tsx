"use client";
import { AnnouncementModal } from "@/components/Announcement";
import AnnounceSkeleton from "@/components/Announcement/AnnounceSkeleton";
import Comment from "@/components/comments/comment";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import { GetCreatedAt } from "@/utils/getCreatedAt";
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
import { use, useEffect, useRef, useState } from "react";


const enum Tabs {
  JobSeeker = 'job-seeker',
  Employer = 'employer',
}

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

  const [totalComments, setTotalComments] = useState<number>(0);

  const handleOpenComment = (announcementId: string | number) => {
    if (openCommentId === announcementId) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(announcementId);
    }
  };

  function fncreatedAt(date: Date | number | string) {
    return GetCreatedAt(date);
  }

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
      <section className="relative w-80 p-4 space-y-4">
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
        <div className="bg-gray-100 rounded-lg p-1 flex gap-4 justify-between">
          <button
            className={`flex-1 ${activeNavTab === NavTabs.Annonces ? "bg-white rounded-md" : "text-gray-600"} py-2 w-full px-4 text-sm font-semibold shadow-sm`}
            onClick={() => {
              setActiveNavTab(NavTabs.Annonces);
            }}
          >
            Nouveau
          </button>
          <button
            className={`flex-1 ${activeNavTab === NavTabs.MesAnnonces ? "bg-white rounded-md" : "text-gray-600"} py-2 px-4 text-sm w-full font-semibold shadow-sm`}
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
          onClick={handleOpenModal}
          className="mt-6 w-full bg-orange-500 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-semibold hover:bg-orange-600"
        >
          <Plus className="w-5 h-5" />
          Announce
        </button>
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
      <div className="flex-1 max-w-2xl border-r border-gray-200">

        <div className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10 p-2">
          <div ref={tabsContainerRef} className="relative">
            <div className="flex">
              <button
                ref={btnJobRef}
                className={`flex-1 py-4 text-center font-semibold rounded-2xl transition-colors duration-50 ${tabs === "job-seeker" ? "text-orange-600 shadow-sm rounded-lg bg-white" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setTabs("job-seeker")}
                aria-pressed={tabs === "job-seeker"}
              >
                Je cherche un travail
              </button>

              <button
                ref={btnEmpRef}
                className={`flex-1 py-4 text-center font-semibold rounded-md transition-colors duration-50 ${tabs === "employer" ? "text-orange-600 shadow-sm rounded-lg bg-white" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setTabs("employer")}
                aria-pressed={tabs === "employer"}
              >
                J’ai besoin de quelqu’un
              </button>
            </div>

            <span
              aria-hidden
              className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{
                left: indicator.left,
                width: indicator.width,
              }}
            />
          </div>
        </div>
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
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{annonce.title}</span>
                        <span className="text-gray-500 text-sm">
                          @{annonce.created_at ? new Date(annonce.created_at as any).toLocaleDateString() : ""}
                        </span>
                        <span className="text-gray-500 text-sm items-end">
                          {fncreatedAt(annonce.created_at ? annonce.created_at : annonce.updated_at || "")}
                        </span>
                      </div>

                      <PostMenu announcementId={annonce.id} />
                    </div>

                    <div
                      className={`${bgClass ?? "bg-gray-200"} p-4 rounded-t-lg h-64 items-center flex justify-center`}
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
                    <div className="flex justify-between items-center gap-4 text-gray-500 text-sm bg-neutral-100 px-2 py-4 rounded-b-lg">
                      <button
                        className="flex items-center gap-2 hover:text-green-600"
                        // onClick={() => {
                        //   setSelectedAnnouncement(annonce);
                        //   handleCommentModalOpen();
                        // }}
                        onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)}

                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{annonce.commentCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500">
                        <Repeat2 className="w-4 h-4" />
                        <span>187</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        <span>1K</span>
                      </button>
                      <button className="flex hover:text-orange-500">
                        <Share className="w-4 h-4" />
                      </button>
                      <button className="flex hover:text-gray-700">
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
    <div className="min-h-screen bg-white pt-16">
      <div className="p-4 w-full fixed top-0 bg-white border-b border-gray-200 z-20 mb-8">
        <h1 className="text-3xl font-bold text-center text-orange-500">Manounou Job</h1>
      </div>
      <div className="max-w-7xl mx-auto flex">
        <Navigation />

        <Main />

        <InfoPanel />
      </div>
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
