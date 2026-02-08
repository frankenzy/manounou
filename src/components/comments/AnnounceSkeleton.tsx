import React from 'react';

const CommentSkeleton = () => {
   return (
      <>
         {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
               <div className="bg-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-3">
                     <div className="w-12 h-12 bg-gray-400 rounded-full mr-3"></div>
                     <div className="flex-1">
                        <div className="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-400 rounded w-1/6"></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-4 bg-gray-400 rounded w-full"></div>
                     <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                     <div className="h-4 bg-gray-400 rounded w-4/6"></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                     <div className="h-8 bg-gray-400 rounded w-20"></div>
                     <div className="h-8 bg-gray-400 rounded w-20"></div>
                  </div>
               </div>
            </div>
         ))}
      </>
   );
};

export default CommentSkeleton;