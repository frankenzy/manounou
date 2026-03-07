"use client";

import { AnimatedReveal } from "@/components/premium/motion/AnimatedReveal";
import { StaggerItem, StaggerList } from "@/components/premium/motion/StaggerList";
import { motion } from "framer-motion";
import { BriefcaseBusiness, CircleCheck, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileStats {
   score: number;
   level: number;
   xp: number;
}

export default function UserPage() {
   const [isLoading, setIsLoading] = useState(true);
   const [stats, setStats] = useState<ProfileStats>({ score: 0, level: 1, xp: 0 });

   useEffect(() => {
      let mounted = true;

      const loadProgress = async () => {
         try {
            const meResponse = await fetch("/api/auth/me");
            const mePayload = (await meResponse.json()) as { data?: { id?: string } };
            const userId = mePayload.data?.id;

            if (!userId) {
               return;
            }

            const progressResponse = await fetch(`/api/v1/gamification/progress?userId=${encodeURIComponent(userId)}`);
            const progressPayload = (await progressResponse.json()) as { data?: ProfileStats };

            if (mounted && progressPayload.data) {
               setStats(progressPayload.data);
            }
         } catch {
            return;
         } finally {
            if (mounted) {
               setIsLoading(false);
            }
         }
      };

      void loadProgress();
      return () => {
         mounted = false;
      };
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-8 md:py-24">
         <div className="mx-auto max-w-5xl space-y-5">
            <AnimatedReveal className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-300 to-orange-500 md:h-16 md:w-16" />
                     <div>
                        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Profil professionnel</h1>
                        <p className="text-sm text-gray-600">Compétences, progression et activités récentes</p>
                     </div>
                  </div>
                  <motion.button
                     whileHover={{ y: -2 }}
                     className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:w-auto"
                  >
                     Mettre à jour le profil
                  </motion.button>
               </div>
            </AnimatedReveal>

            <StaggerList className="grid gap-3 md:grid-cols-3" aria-live="polite">
               {[
                  { icon: TrendingUp, label: "Score", value: stats.score },
                  { icon: Sparkles, label: "Niveau", value: stats.level },
                  { icon: BriefcaseBusiness, label: "XP", value: stats.xp },
               ].map((item) => (
                  <StaggerItem key={item.label}>
                     <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm md:p-4">
                        <item.icon className="h-4 w-4 text-orange-500" />
                        <p className="mt-2 text-xs text-gray-600">{item.label}</p>
                        <p className="text-base font-semibold text-gray-900 md:text-lg">
                           {isLoading ? <span className="inline-block h-6 w-16 animate-pulse rounded bg-gray-100" /> : item.value}
                        </p>
                     </div>
                  </StaggerItem>
               ))}
            </StaggerList>

            <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
               <h2 className="text-sm font-semibold text-gray-900">Compétences</h2>
               <div className="mt-3 flex flex-wrap gap-2">
                  {["Garde d'enfants", "Cuisine", "Organisation", "Communication", "Aide ménagère"].map((skill) => (
                     <span key={skill} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
                        {skill}
                     </span>
                  ))}
               </div>
            </AnimatedReveal>

            <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
               <h2 className="text-sm font-semibold text-gray-900">Timeline</h2>
               <ul className="mt-3 space-y-2">
                  {[
                     "Profil vérifié",
                     "Nouvelle mission complétée",
                     "Feedback 5 étoiles reçu",
                     "Niveau supérieur débloqué",
                  ].map((event) => (
                     <li key={event} className="flex items-center gap-2 text-sm text-gray-700">
                        <CircleCheck className="h-4 w-4 text-orange-500" />
                        {event}
                     </li>
                  ))}
               </ul>
            </AnimatedReveal>
         </div>
      </div>
   );
}
