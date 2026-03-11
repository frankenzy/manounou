"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PostModal } from "@/components/Post";
import AnnounceSkeleton from "@/components/Post/AnnounceSkeleton";
import { StaggerItem, StaggerList } from "@/components/premium/motion/StaggerList";
import Comment from "@/components/comments/comment";
import { IPostDTO } from "@/models/Post";
import { IRepost } from "@/models/Repost";
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
  SlidersHorizontal,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Repost from "@/components/repost/repost";
import DeleteModal from "@/components/modals/deleteModal";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import MiniPulseGame from "@/components/premium/game/MiniPulseGame";

const ParticleFieldScene = dynamic(() => import("@/components/premium/webgl/ParticleFieldScene"), {
  ssr: false,
});


const enum NavTabs {
  Annonces = 'annonces',
  MesAnnonces = 'mes-annonces',
}


export default function BlueskyLayout() {
  type FeedPost = IPostDTO & {
    feedId: string;
    feedType: "post" | "repost";
    repostText?: string;
    repostAuthorId?: number;
    feedTimestamp: number;
  };

  const [annonces, setAnnonces] = useState<FeedPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPostDTO | undefined>(undefined);
  const [activeNavTab, setActiveNavTab] = useState<NavTabs>(NavTabs.Annonces);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [tabs, setTabs] = useState<'job-seeker' | 'employer'>('job-seeker');

  const [openCommentId, setOpenCommentId] = useState<string | number | null>(null);

  const [repost, setRepost] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showOnlyReposts, setShowOnlyReposts] = useState(false);
  const [sortMode, setSortMode] = useState<"recent" | "engaged">("recent");

  const handleOpenComment = (postId: string | number) => {
    if (openCommentId === postId) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(postId);
    }
  };

  const handleCommentModalClose = () => {
    setCommentModalOpen(false);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmVisible(false);
    window.setTimeout(() => {
      setDeleteTargetId(null);
    }, 220);
  };

  const openDeleteConfirmModal = (postId?: string | number) => {
    if (postId === undefined) return;
    setDeleteTargetId(postId);
    requestAnimationFrame(() => setIsDeleteConfirmVisible(true));
  };

  const confirmDeletePost = async () => {
    if (deleteTargetId === null) return;

    setIsDeletingPost(true);
    try {
      const response = await fetch(`/api/posts/${deleteTargetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAnnonces();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeletingPost(false);
      closeDeleteConfirmModal();
    }
  };

  const fetchAnnonces = useCallback(async () => {
    try {
      const [announceResponse, repostResponse] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/repost"),
      ]);

      const announcePayload = await announceResponse.json();
      const repostPayload = await repostResponse.json();

      const posts: IPostDTO[] = Array.isArray(announcePayload)
        ? announcePayload
        : Array.isArray(announcePayload?.data)
          ? announcePayload.data
          : [];

      const reposts: IRepost[] = Array.isArray(repostPayload)
        ? repostPayload
        : Array.isArray(repostPayload?.data)
          ? repostPayload.data
          : [];

      const toTimestamp = (value: unknown): number => {
        if (!value) return 0;
        const date = new Date(value as string | number | Date);
        const time = date.getTime();
        return Number.isNaN(time) ? 0 : time;
      };

      const postsById = new Map<number, IPostDTO>();
      posts.forEach((post) => {
        if (post.id !== undefined) {
          postsById.set(Number(post.id), post);
        }
      });

      const postFeed: FeedPost[] = posts.map((post) => ({
        ...post,
        feedId: `post-${post.id}`,
        feedType: "post",
        feedTimestamp: toTimestamp(post.created_at),
      }));

      const repostFeed = reposts.reduce<FeedPost[]>((acc, repostItem) => {
        const parentPost = postsById.get(Number(repostItem.announce_id));
        if (!parentPost) {
          return acc;
        }

        acc.push({
          ...parentPost,
          feedId: `repost-${repostItem.id}`,
          feedType: "repost" as const,
          repostText: repostItem.text,
          repostAuthorId: repostItem.author_id,
          created_at: repostItem.create_at || repostItem.created_at || parentPost.created_at,
          feedTimestamp: toTimestamp(
            repostItem.create_at || repostItem.created_at || parentPost.created_at
          ),
        });

        return acc;
      }, []);

      const mergedFeed = [...postFeed, ...repostFeed].sort((a, b) => {
        const timeDelta = b.feedTimestamp - a.feedTimestamp;
        if (timeDelta !== 0) {
          return timeDelta;
        }

        const aId = Number(a.id || 0);
        const bId = Number(b.id || 0);
        return bId - aId;
      });

      setAnnonces(mergedFeed);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setAnnonces([]);
    }
  }, []);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  useEffect(() => {
    if (deleteTargetId === null) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeletingPost) {
        closeDeleteConfirmModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [deleteTargetId, isDeletingPost]);

  const filteredFeed = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const items = annonces.filter((item) => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        item.title?.toLowerCase().includes(normalizedQuery) ||
        String(item.description || "").toLowerCase().includes(normalizedQuery);

      if (!queryMatch) return false;
      if (showOnlyReposts && item.feedType !== "repost") return false;
      return true;
    });

    if (sortMode === "engaged") {
      return [...items].sort(
        (left, right) =>
          (Number(right.commentCount || 0) + Number(right.repostCount || 0)) -
          (Number(left.commentCount || 0) + Number(left.repostCount || 0)),
      );
    }

    return items;
  }, [annonces, searchQuery, showOnlyReposts, sortMode]);

  const InfoPanel = () => {
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
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-8 pr-2 py-1.5 bg-transparent rounded-xl focus:outline-none text-sm"
          />
        </div>

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
                onChange={(event) => setShowOnlyReposts(event.target.checked)}
                className="accent-orange-500"
              />
              Afficher seulement les reposts
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortMode("recent")}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${sortMode === "recent" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}
              >
                Plus récents
              </button>
              <button
                type="button"
                onClick={() => setSortMode("engaged")}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${sortMode === "engaged" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}
              >
                Plus engageants
              </button>
            </div>
          </div>
        </div>

        <MiniPulseGame />

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
    setSelectedPost(undefined); // Reset pour création
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(undefined);
  };

  // Menu pour les posts avec options (éditer, supprimer, etc.)

  const PostMenu = ({ postId }: { postId?: string | number }) => {
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
      console.log("Edit post:", postId);
      setIsOpen(false);

      // Récupérer les données complètes de l'annonce
      try {
        const response = await fetch(`/api/posts/${postId}`);

        if (response.ok) {
          const result = await response.json();

          console.log("Fetch response for edit:", result.data);



          if (result.success) {
            setSelectedPost(result.data);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching post for edit:", error);
      }
    };

    const handleDelete = async () => {
      openDeleteConfirmModal(postId);
      setIsOpen(false);
    };

    const handleShare = async () => {
      console.log("Share post:", postId);
      try {
        const response = await fetch(`/api/posts/${postId}`);

        setIsOpen(false);

        if (response.ok) {
          const result = await response.json();

          console.log("Fetch response for edit:", result.data);

          if (result.success) {
            setSelectedPost(result.data);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching post for edit:", error);
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

  const FilterDrawer = () => {
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
  };



  const handleRepost = (postId: number) => {

    const annonceToRepost = annonces.find(a => a.id === postId);
    if (annonceToRepost) {
      setSelectedPost(annonceToRepost);
      setRepost(true);
    }

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
        <div className="sticky top-[4.35rem] md:top-16 bg-white/90 border border-gray-100 rounded-2xl z-10 backdrop-blur shadow-sm p-1">
          <div ref={tabsContainerRef} className="relative">
            <div className="flex bg-gray-50 rounded-xl p-1">
              <button
                ref={btnJobRef}
                className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === "job-seeker" ? "text-orange-600" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setTabs("job-seeker")}
                aria-pressed={tabs === "job-seeker"}
                aria-label="Afficher les annonces"
              >
                Announce
              </button>

              <button
                ref={btnEmpRef}
                className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === "employer" ? "text-orange-600" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => setTabs("employer")}
                aria-pressed={tabs === "employer"}
                aria-label="Afficher le fil"
              >
                feeds
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

        {/* <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2 text-xs text-orange-800">
          {filteredFeed.length} résultats • tri: {sortMode === "recent" ? "récents" : "engagement"}
        </div> */}

        {Array.isArray(filteredFeed) && filteredFeed.length > 0 ? (
          <StaggerList className="mt-2" staggerChildren={0.09}>
            {filteredFeed.map((annonce: FeedPost, index: number) => {
              const metadata = annonce.metadata as Record<string, string> | undefined;
              const bgClass = metadata?.background || metadata?.backgroundColor;
              const metaColor = metadata?.backgroundColor as string | undefined;
              const metaSize = metadata?.fontSize;
              const isRepostItem = annonce.feedType === "repost";

              return (
                <StaggerItem key={annonce.feedId}>
                  <motion.div
                    layout
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                      width: "100%",
                      minHeight: `${165 + (index % 3) * 35}px`,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <div className="mt-3 md:mt-4 rounded-2xl border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow duration-300">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl flex-shrink-0 shadow-sm" />

                        <div className="flex-1">
                          {isRepostItem && (
                            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-800 border border-orange-100">
                              <Repeat2 className="w-3.5 h-3.5" />
                              Reposté par utilisateur #{annonce.repostAuthorId}
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900 text-sm md:text-base">{annonce.title}</span>
                              <span className="text-gray-600 text-xs md:text-sm">
                                @{annonce.created_at ? new Date(annonce.created_at as unknown as Date).toLocaleDateString() : ""}
                              </span>
                              <span className="text-gray-600 text-xs md:text-sm items-end">
                                <RelativeTime date={annonce.created_at ? annonce.created_at : annonce.updated_at || ""} />
                              </span>
                            </div>

                            {!isRepostItem && <PostMenu postId={annonce.id} />}
                          </div>

                          {isRepostItem && annonce.repostText && (
                            <p className="mb-3 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2">{annonce.repostText}</p>
                          )}

                          <div
                            className={`${bgClass ? `${bgClass} items-center` : "bg-gray-50 items-start"} p-4 rounded-lg min-h-[180px] flex flex-col gap-4 justify-center overflow-hidden`}
                            style={{
                              backgroundColor: metaColor,
                              fontSize: metaSize,
                            }}
                          >
                            <p className={`${metaSize ?? "text-base md:text-lg"} ${bgClass ? "text-white" : "text-neutral-500"} font-semibold mb-1 md:mb-2 leading-relaxed`}>
                              {annonce.description}
                            </p>

                            {metadata?.image && typeof metadata.image === "string" && (
                              <figure className="w-full relative overflow-hidden rounded-xl border border-white/40 bg-black/5 aspect-[4/5] md:aspect-[16/10]">
                                <Image
                                  src={metadata.image}
                                  alt="Post Image"
                                  fill
                                  loading="lazy"
                                  decoding="async"
                                  fetchPriority="low"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 720px"
                                  className="object-cover w-full h-full relative z-0 transition-transform duration-500 hover:scale-[1.02]"
                                />
                              </figure>
                            )}
                          </div>

                          <div className="flex justify-between items-center gap-1 md:gap-3 text-gray-600 text-xs md:text-sm bg-gray-50 px-2 md:px-3 py-2.5 md:py-3 rounded-xl mt-2 border border-gray-100 overflow-x-auto">
                            <button
                              aria-label="Ouvrir les commentaires"
                              className="flex items-center gap-1.5 md:gap-2 hover:text-green-600 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                              onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{annonce.commentCount || 0}</span>
                            </button>
                            <button
                              aria-label="Reposter"
                              className="flex items-center gap-1.5 md:gap-2 hover:text-green-500 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                              onClick={() => handleRepost(annonce.id as number)}
                            >
                              <Repeat2 className="w-4 h-4" />
                              <span>{annonce.repostCount || 0}</span>
                            </button>
                            <button
                              aria-label="Aimer"
                              className="flex items-center gap-1.5 md:gap-2 hover:text-red-500 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                              <Heart className="w-4 h-4" />
                              <span>1K</span>
                            </button>
                            <button
                              aria-label="Partager"
                              className="flex hover:text-orange-500 rounded-lg p-1.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                            >
                              <Share className="w-4 h-4" />
                            </button>
                            <button
                              aria-label="Afficher ou masquer les commentaires"
                              className="flex hover:text-gray-700 rounded-lg p-1.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                              onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <AnimatePresence initial={false}>
                            {openCommentId === annonce.id && (
                              <motion.div
                                key="comments"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="min-h-20 m-h-60 relative z-10 rounded-b-lg -mt-2"
                              >
                                <Comment isOpen={true} onClose={() => setOpenCommentId(null)} annonce={annonce} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerList>
        ) : (
          <div className="p-4 text-center text-gray-600">
            <AnnounceSkeleton />
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="fixed top-0 z-20 w-full border-b border-gray-200 bg-white/90 p-3 backdrop-blur sm:p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-orange-500 sm:text-2xl md:text-3xl">Manounou Job</h1>
          <button
            type="button"
            aria-label="Ouvrir les filtres"
            className="inline-flex items-center gap-1 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-3 px-2 pb-24 sm:px-3 md:gap-4 md:px-4 lg:pb-0">
        <Navigation />

        <Main />

        <InfoPanel />
      </div>

      <button
        onClick={handleOpenModal}
        aria-label="Créer une annonce"
        className="fixed lg:hidden bottom-5 right-4 z-30 bg-orange-500 text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-semibold">Announces</span>
      </button>

      <FilterDrawer />

      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchAnnonces}
        post={selectedPost}
      />

      {selectedPost && (
        <Comment
          isOpen={commentModalOpen}
          onClose={handleCommentModalClose}
          annonce={selectedPost}
        />
      )}

      {selectedPost && repost && (
        <Repost
          date={selectedPost.created_at || new Date()}
          announceId={selectedPost.id as number}
          alreadyReposted={false}
          annonce={selectedPost}
          isOpen={repost}
          onClose={() => setRepost(false)}
          onSuccess={fetchAnnonces}
        />
      )}

      {deleteTargetId !== null && (
        <DeleteModal
          isOpen={isDeleteConfirmVisible}
          onClose={closeDeleteConfirmModal}
          onConfirm={confirmDeletePost}
          isDeletingPost={isDeletingPost}
        />
      )}

    </div>
  );
}
