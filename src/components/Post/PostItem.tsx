"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Repeat2, ChevronDown, Heart, Share } from "lucide-react";
import Comment from "@/components/comments/comment";
import { RelativeTime } from "@/components/RelativeTime";
import PostMenu from "@/components/Post/PostMenu";
import { IPostDTO } from "@/models/Post";
import { FeedPost } from "@/types/feed";

type Props = {
   annonce: FeedPost;
   index: number;
   openCommentId: string | number | null;
   handleOpenComment: (id: string | number) => void;
   handleRepost: (id: string) => void;
   setSelectedPost: (post: IPostDTO) => void;
   setIsModalOpen: (v: boolean) => void;
   openDeleteConfirmModal: (postId?: string | number) => void;
};

export default function PostItem({
   annonce,
   index,
   openCommentId,
   handleOpenComment,
   handleRepost,
   setSelectedPost,
   setIsModalOpen,
   openDeleteConfirmModal,
}: Props) {
   const metadata = annonce.metadata as Record<string, string> | undefined;
   const bgClass = metadata?.background || metadata?.backgroundColor;
   const metaColor = metadata?.backgroundColor as string | undefined;
   const metaSize = metadata?.fontSize;
   const isRepostItem = annonce.feedType === "repost";

   return (
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
                        <span className="text-gray-600 text-xs md:text-sm">{annonce.created_at ? new Date(annonce.created_at as unknown as Date).toLocaleDateString() : ""}</span>
                        <span className="text-gray-600 text-xs md:text-sm items-end">
                           <RelativeTime date={annonce.created_at ? annonce.created_at : annonce.updated_at || ""} />
                        </span>
                     </div>

                     {!isRepostItem && (
                        <PostMenu
                           postId={annonce.id}
                           onSetSelectedPost={(p) => setSelectedPost(p)}
                           onOpenModal={() => setIsModalOpen(true)}
                           openDeleteConfirmModal={openDeleteConfirmModal}
                        />
                     )}
                  </div>

                  {isRepostItem && annonce.repostText && (
                     <p className="mb-3 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2">{annonce.repostText}</p>
                  )}

                  <div
                     className={`${bgClass ? `${bgClass} items-center` : "bg-gray-50 items-start"} p-4 rounded-lg min-h-[180px] flex flex-col gap-4 justify-center overflow-hidden`}
                     style={{ backgroundColor: metaColor, fontSize: metaSize }}
                  >
                     <p className={`${metaSize ?? "text-base md:text-lg"} ${bgClass ? "text-white" : "text-neutral-500"} font-semibold mb-1 md:mb-2 leading-relaxed`}>{annonce.description}</p>

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
                        onClick={() => handleRepost(annonce.id ?? "")}
                     >
                        <Repeat2 className="w-4 h-4" />
                        <span>{annonce.repostCount || 0}</span>
                     </button>
                     <button aria-label="Aimer" className="flex items-center gap-1.5 md:gap-2 hover:text-red-500 rounded-lg px-2 py-1 hover:bg-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                        <Heart className="w-4 h-4" />
                        <span>1K</span>
                     </button>
                     <button aria-label="Partager" className="flex hover:text-orange-500 rounded-lg p-1.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
                        <Share className="w-4 h-4" />
                     </button>
                     <button aria-label="Afficher ou masquer les commentaires" className="flex hover:text-gray-700 rounded-lg p-1.5 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2" onClick={() => annonce.id !== undefined && handleOpenComment(annonce.id)}>
                        <ChevronDown className="w-4 h-4" />
                     </button>
                  </div>

                  <AnimatePresence initial={false}>
                     {openCommentId === annonce.id && (
                        <motion.div key="comments" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }} className="min-h-20 m-h-60 relative z-10 rounded-b-lg -mt-2">
                           <Comment isOpen={true} onClose={() => handleOpenComment(annonce.id ?? "")} post={annonce} />
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </motion.div>
   );
}
