import { IPostDTO } from "@/models/Post";
import { IRepost, RepostApiResponse, RepostCreateRequest } from "@/models/Repost";
import { FeedPost } from "@/types/feed";

async function fetchJson(url: string, options?: RequestInit) {
   const res = await fetch(url, options);
   const data = await res.json().catch(() => null);
   if (!res.ok) {
      const err = new Error(data?.message || `Request failed: ${res.status}`);
      (err as any).response = data;
      throw err;
   }
   return data;
}

export async function getPosts(): Promise<IPostDTO[]> {
   const payload = await fetchJson("/api/posts");
   if (Array.isArray(payload)) return payload;
   if (Array.isArray(payload?.data)) return payload.data;
   return [];
}

export async function getReposts(): Promise<IRepost[]> {
   const payload = await fetchJson("/api/repost");
   if (Array.isArray(payload)) return payload;
   if (Array.isArray(payload?.data)) return payload.data;
   return [];
}

export async function getFeed(): Promise<FeedPost[]> {
   const [posts, reposts] = await Promise.all([getPosts(), getReposts()]);

   const toTimestamp = (value: unknown): number => {
      if (!value) return 0;
      const date = new Date(value as string | number | Date);
      const time = date.getTime();
      return Number.isNaN(time) ? 0 : time;
   };

   const postsById = new Map<string, IPostDTO>();
   posts.forEach((p) => p.id !== undefined && postsById.set(p.id, p));

   const postFeed: FeedPost[] = posts.map((post) => ({
      ...post,
      feedId: `post-${post.id}`,
      feedType: "post",
      feedTimestamp: toTimestamp(post.created_at),
   }));

   const repostFeed = reposts.reduce<FeedPost[]>((acc, repostItem) => {
      const parentPost = postsById.get((repostItem.announce_id));
      if (!parentPost) return acc;
      acc.push({
         ...parentPost,
         feedId: `repost-${repostItem.id}`,
         feedType: "repost",
         repostText: repostItem.text,
         repostAuthorId: repostItem.author_id,
         created_at: repostItem.created_at || parentPost.created_at,
         feedTimestamp: toTimestamp(repostItem.created_at || parentPost.created_at),
      });
      return acc;
   }, []);

   const merged = [...postFeed, ...repostFeed].sort((a, b) => {
      const d = b.feedTimestamp - a.feedTimestamp;
      if (d !== 0) return d;
      return Number(b.id || 0) - Number(a.id || 0);
   });

   return merged;
}

export async function getById(id: string | number) {
   return await fetchJson(`/api/posts/${id}`);
}

export async function createPost(payload: Record<string, unknown>) {
   return await fetchJson(`/api/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function updatePost(id: string | number, payload: Record<string, unknown>) {
   return await fetchJson(`/api/posts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function deletePost(id: string | number) {
   return await fetchJson(`/api/posts/${id}`, { method: "DELETE" });
}

export async function createRepost(request: RepostCreateRequest): Promise<RepostApiResponse> {
   return await fetchJson(`/api/repost`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
}

export default {
   getPosts,
   getReposts,
   getFeed,
   getById,
   createPost,
   updatePost,
   deletePost,
   createRepost,
};
