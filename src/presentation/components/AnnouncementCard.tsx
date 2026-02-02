/**
 * Composant de présentation: AnnouncementCard
 * Affiche une carte d'annonce
 * Suit le principe Single Responsibility (SOLID)
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { Heart, MessageCircle, MoreHorizontal, Repeat2, Share } from 'lucide-react';
import { GetCreatedAt } from '@/utils/getCreatedAt';

interface AnnouncementCardProps {
   announcement: AnnouncementResponseDTO;
   onComment: (announcement: AnnouncementResponseDTO) => void;
   onMenuOpen?: (announcementId: number | string) => void;
   renderMenu?: (announcementId: number | string) => React.ReactNode;
}

export function AnnouncementCard({
   announcement,
   onComment,
   renderMenu
}: AnnouncementCardProps) {
   const metadata = announcement.metadata;
   const bgClass = metadata?.background || metadata?.backgroundColor;
   const metaColor = metadata?.backgroundColor;
   const metaSize = metadata?.fontSize;

   return (
      <div className="p-4 hover:bg-gray-50">
         <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

            <div className="flex-1">
               <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center justify-between gap-2">
                     <span className="font-semibold">{announcement.title}</span>
                     <span className="text-gray-500 text-sm">
                        @{announcement.created_at
                           ? new Date(announcement.created_at as any).toLocaleDateString()
                           : ""}
                     </span>
                     <span className="text-gray-500 text-sm items-end">
                        {GetCreatedAt(
                           announcement.created_at
                              ? announcement.created_at
                              : announcement.updated_at || ""
                        )}
                     </span>
                  </div>

                  {renderMenu && announcement.id && renderMenu(announcement.id)}
               </div>

               <div
                  className={`${bgClass ?? "bg-gray-200"} p-4 rounded-lg mb-3 h-64 items-center flex justify-center`}
                  style={{
                     backgroundColor: metaColor as string,
                     fontSize: metaSize as string,
                  }}
               >
                  <p
                     className={`${metaSize ?? "text-lg"} ${bgClass ? "text-white" : "text-black"} font-semibold mb-3`}
                  >
                     {announcement.description}
                  </p>
               </div>

               <div className="flex items-center gap-8 text-gray-500 text-sm">
                  <button
                     className="flex items-center gap-2 hover:text-green-600"
                     onClick={() => onComment(announcement)}
                  >
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
}
