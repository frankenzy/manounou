'use client';
import { PostModal } from '@/components/Post';
import AnnounceSkeleton from '@/components/Post/AnnounceSkeleton';
import Comment from '@/components/comments/comment';
import { IPostDTO } from '@/models/Post';

import DeleteModal from '@/components/modals/deleteModal';
import Repost from '@/components/repost/repost';
import useEscapeKey from '@/hooks/useEscapeKey';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import FilterDrawer from '@/components/Manounou/FilterDrawer';
import InfoPanel from '@/components/Manounou/InfoPanel';
import Navigation from '@/components/Manounou/Navigation';
import PostList from '@/components/Post/PostList';
import { useAnnonces } from '@/hooks/useAnnonces';
import postsRepository from '@/repositories/postsRepository';

const enum NavTabs {
  Annonces = 'annonces',
  MesAnnonces = 'mes-annonces',
}

export default function BlueskyLayout() {
  const { annonces, fetchAnnonces, loading, error } = useAnnonces();

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showOnlyReposts, setShowOnlyReposts] = useState(false);
  const [sortMode, setSortMode] = useState<'recent' | 'engaged'>('recent');

  const handleOpenComment = (postId: string | number) => {
    if (openCommentId === postId) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(postId);
    }
  };

  const handleCommentModalClose = () => setCommentModalOpen(false);

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmVisible(false);
    window.setTimeout(() => setDeleteTargetId(null), 220);
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
      await postsRepository.deletePost(deleteTargetId);
      await fetchAnnonces();
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setIsDeletingPost(false);
      closeDeleteConfirmModal();
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  useEscapeKey(() => closeDeleteConfirmModal(), deleteTargetId !== null && !isDeletingPost);

  const filteredFeed = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items = annonces.filter(item => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        item.title?.toLowerCase().includes(normalizedQuery) ||
        String(item.description || '')
          .toLowerCase()
          .includes(normalizedQuery);
      if (!queryMatch) return false;
      if (showOnlyReposts && item.feedType !== 'repost') return false;
      return true;
    });
    if (sortMode === 'engaged') {
      return [...items].sort(
        (left, right) =>
          Number(right.commentCount || 0) +
          Number(right.repostCount || 0) -
          (Number(left.commentCount || 0) + Number(left.repostCount || 0))
      );
    }
    return items;
  }, [annonces, searchQuery, showOnlyReposts, sortMode]);

  const handleOpenModal = () => {
    setSelectedPost(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(undefined);
  };

  const handleRepost = (postId: string) => {
    const annonceToRepost = annonces.find(a => a.id === postId);
    if (annonceToRepost) {
      setSelectedPost(annonceToRepost);
      setRepost(true);
    }
  };

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const btnJobRef = useRef<HTMLButtonElement | null>(null);
  const btnEmpRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState<{ left: string; width: string }>({
    left: '0px',
    width: '0px',
  });

  useEffect(() => {
    const update = () => {
      const container = tabsContainerRef.current;
      const activeBtn = tabs === 'job-seeker' ? btnJobRef.current : btnEmpRef.current;
      if (container && activeBtn) {
        const cRect = container.getBoundingClientRect();
        const bRect = activeBtn.getBoundingClientRect();
        setIndicator({ left: `${bRect.left - cRect.left}px`, width: `${bRect.width}px` });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [tabs]);

  const Main = () => (
    <div className="w-full lg:flex-1 lg:max-w-3xl">
      <div className="sticky top-[4.35rem] md:top-16 bg-white/90 border border-gray-100 rounded-2xl z-10 backdrop-blur shadow-sm p-1">
        <div ref={tabsContainerRef} className="relative">
          <div className="flex bg-gray-50 rounded-xl p-1">
            <button
              ref={btnJobRef}
              className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === 'job-seeker' ? 'text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setTabs('job-seeker')}
              aria-pressed={tabs === 'job-seeker'}
              aria-label="Afficher les annonces"
            >
              Announce
            </button>
            <button
              ref={btnEmpRef}
              className={`flex-1 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold rounded-xl transition-colors duration-150 ${tabs === 'employer' ? 'text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setTabs('employer')}
              aria-pressed={tabs === 'employer'}
              aria-label="Afficher le fil"
            >
              feeds
            </button>
          </div>
          <span
            aria-hidden
            className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>

        {loading ? (
          <div className="space-y-4 p-4">
            <AnnounceSkeleton />
            <AnnounceSkeleton />
            <AnnounceSkeleton />
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="mx-auto max-w-3xl rounded-lg border border-red-100 bg-red-50 p-4 text-center text-red-800">
              <p className="mb-2 font-semibold">Erreur lors du chargement des annonces.</p>
              <p className="text-sm mb-3">{String(error?.message || 'Erreur réseau')}</p>
              <button
                onClick={() => fetchAnnonces()}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : Array.isArray(filteredFeed) && filteredFeed.length > 0 ? (
          <PostList
            feed={filteredFeed}
            openCommentId={openCommentId}
            handleOpenComment={handleOpenComment}
            handleRepost={handleRepost}
            setSelectedPost={setSelectedPost}
            setIsModalOpen={setIsModalOpen}
            openDeleteConfirmModal={openDeleteConfirmModal}
          />
        ) : (
          <div className="p-4 text-center text-gray-600">Aucune annonce trouvée.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="fixed top-0 z-20 w-full border-b border-gray-200 bg-white/90 p-3 backdrop-blur sm:p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-orange-500 sm:text-2xl md:text-3xl">
            Manounou Job
          </h1>
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
        <Navigation onOpenModal={handleOpenModal} />
        <Main />
        <InfoPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeNavTab={activeNavTab}
          setActiveNavTab={v => setActiveNavTab(v as NavTabs)}
          showOnlyReposts={showOnlyReposts}
          setShowOnlyReposts={setShowOnlyReposts}
          sortMode={sortMode}
          setSortMode={setSortMode}
        />
      </div>

      <button
        onClick={handleOpenModal}
        aria-label="Créer une annonce"
        className="fixed lg:hidden bottom-5 right-4 z-30 bg-orange-500 text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-semibold">Announces</span>
      </button>

      <FilterDrawer
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showOnlyReposts={showOnlyReposts}
        setShowOnlyReposts={setShowOnlyReposts}
        sortMode={sortMode}
        setSortMode={setSortMode}
      />

      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchAnnonces}
        post={selectedPost}
      />

      {selectedPost && (
        <Comment isOpen={commentModalOpen} onClose={handleCommentModalClose} post={selectedPost} />
      )}

      {selectedPost && repost && (
        <Repost
          date={selectedPost.created_at || new Date()}
          postId={String(selectedPost.id)}
          alreadyReposted={false}
          post={selectedPost}
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
