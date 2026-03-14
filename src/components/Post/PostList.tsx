"use client";
import React from "react";
import { StaggerList, StaggerItem } from "@/components/premium/motion/StaggerList";
import PostItem from "@/components/Post/PostItem";
import { FeedPost } from "@/types/feed";

type Props = {
   feed: FeedPost[];
   openCommentId: string | number | null;
   handleOpenComment: (id: string | number) => void;
   handleRepost: (id: string) => void;
   setSelectedPost: (post: any) => void;
   setIsModalOpen: (v: boolean) => void;
   openDeleteConfirmModal: (postId?: string | number) => void;
};

export default function PostList({ feed, openCommentId, handleOpenComment, handleRepost, setSelectedPost, setIsModalOpen, openDeleteConfirmModal }: Props) {
   return (
      <StaggerList className="mt-2" staggerChildren={0.09}>
         {feed.map((annonce, index) => (
            <StaggerItem key={annonce.feedId}>
               <PostItem
                  annonce={annonce}
                  index={index}
                  openCommentId={openCommentId}
                  handleOpenComment={handleOpenComment}
                  handleRepost={handleRepost}
                  setSelectedPost={setSelectedPost}
                  setIsModalOpen={setIsModalOpen}
                  openDeleteConfirmModal={openDeleteConfirmModal}
               />
            </StaggerItem>
         ))}
      </StaggerList>
   );
}
