import { ICreateRepostDTO, IRepost } from './../../models/Repost';
import { RepostRepository } from '@/repositories/RepostRepository';
export class RepostService {

   constructor(
      repostRepository: RepostRepository,
   ) {
      this.repostRepository = repostRepository;
   }


   private readonly repostRepository: RepostRepository;


   async createRepost(createRepostDto: ICreateRepostDTO): Promise<IRepost> {
      return this.repostRepository.create(createRepostDto);
   }

   async findAllReposts(): Promise<IRepost[]> {
      return this.repostRepository.findAll();
   }

   async findRepostById(id: string): Promise<IRepost> {
      return this.repostRepository.findOne(id);
   }

   async findRepostsByPost(postId: string): Promise<IRepost[]> {
      return this.repostRepository.findByPost(postId);
   }

   async findRepostsByAuthor(authorId: string): Promise<IRepost[]> {
      return this.repostRepository.findByAuthor(authorId);
   }

   async deleteRepost(id: string): Promise<void> {
      await this.repostRepository.remove(id);
   }

   async countReposts(announce_id: string): Promise<number> {
      return this.repostRepository.countReposts(announce_id);
   }

}