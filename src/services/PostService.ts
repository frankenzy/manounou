import { IPost, IPostDTO } from "@/models/Post";
import { PostRepository } from "@/repositories/PostRepository";

export class PostService {
  private readonly postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }
  getPostsByLocation(location: string): Promise<IPostDTO[]> {

    const result = this.postRepository.findAll().then(posts =>

      posts.filter(post => post.location === location)
    );
    return result;
  }
  searchPosts(query: string): Promise<IPostDTO[]> {
    const result = this.postRepository.findAll().then(posts =>
      posts.filter(post =>
        post.title.includes(query) || post.description.toString().includes(query)
      )
    );
    return result;
  }

  async createPost(post: IPost): Promise<IPostDTO> {

    return this.postRepository.create(post);
  }

  async getPostById(id: number): Promise<IPostDTO | null> {
    return this.postRepository.findById(id);
  }

  async getAllPosts(page: number = 1, limit: number = 20): Promise<IPostDTO[]> {
    console.log(`🔍 Service: Appel de getAllPosts (page: ${page}, limit: ${limit})...`);
    const offset = (page - 1) * limit;
    const result = await this.postRepository.findAll(limit, offset);
    console.log(`✅ Service: ${result.length} annonces retournées`);
    return result;
  }

  async updatePost(id: number, post: Partial<IPost>): Promise<IPostDTO | null> {
    return this.postRepository.update(id, post);
  }

  async deletePost(id: number): Promise<boolean> {
    return this.postRepository.delete(id);
  }

  async getPostsByUserId(user_id: string): Promise<IPostDTO[]> {
    return this.postRepository.findByUserId(user_id);
  }


  async getPostImagePublicId(id: number): Promise<string | null> {
    const post = await this.postRepository.findById(id);
    if (post) {
      return (post.metadata?.imagePublicId as string | null) || null;
    }
    return null;
  }


  async getPostMetadata(id: number): Promise<Record<string, unknown> | null> {
    const post = await this.postRepository.findById(id);
    if (post) {
      return post.metadata || null;
    }
    return null;
  }

  async getPostImageUrl(id: number): Promise<string | null> {
    const post = await this.postRepository.findById(id);
    if (post) {
      return (post.metadata?.image as string | null) || null;
    }
    return null;
  }
}