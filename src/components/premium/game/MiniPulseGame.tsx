"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface MiniPulseGameProps {
   userId?: string;
}

interface GameProgress {
   score: number;
   level: number;
   xp: number;
}

export default function MiniPulseGame({ userId }: MiniPulseGameProps) {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const animationRef = useRef<number | null>(null);
   const [isPaused, setIsPaused] = useState(false);
   const [isReady, setIsReady] = useState(false);
   const [progress, setProgress] = useState<GameProgress>({ score: 0, level: 1, xp: 0 });

   useEffect(() => {
      let mounted = true;
      if (!userId) return;

      fetch(`/api/v1/gamification/progress?userId=${encodeURIComponent(userId)}`)
         .then((response) => response.json())
         .then((result: { data?: GameProgress }) => {
            if (!mounted) return;
            if (result.data) {
               setProgress(result.data);
            }
         })
         .catch(() => undefined);

      return () => {
         mounted = false;
      };
   }, [userId]);

   const syncProgress = useCallback(
      async (next: GameProgress) => {
         if (!userId) return;
         try {
            await fetch("/api/v1/gamification/progress", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  userId,
                  score: next.score,
                  xp: next.xp,
                  level: next.level,
               }),
            });
         } catch {
            return;
         }
      },
      [userId],
   );

   const levelThreshold = useMemo(() => progress.level * 100, [progress.level]);

   useEffect(() => {
      const handleVisibility = () => {
         setIsPaused(document.hidden);
      };

      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
         document.removeEventListener("visibilitychange", handleVisibility);
      };
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      let pulseX = 10;
      const pulseSpeed = 2;

      setIsReady(true);

      const render = () => {
         if (!context) return;
         context.clearRect(0, 0, width, height);
         context.fillStyle = "rgba(249, 115, 22, 0.12)";
         context.fillRect(0, 0, width, height);

         context.beginPath();
         context.strokeStyle = "#fb923c";
         context.lineWidth = 2;
         context.moveTo(0, centerY);
         context.lineTo(width, centerY);
         context.stroke();

         context.beginPath();
         context.fillStyle = "#ea580c";
         context.arc(pulseX, centerY + Math.sin(pulseX * 0.05) * 22, 8, 0, Math.PI * 2);
         context.fill();

         pulseX += pulseSpeed;

         if (pulseX >= width - 8) {
            pulseX = 8;
            setProgress((current) => {
               const nextScore = current.score + 8;
               const nextXp = current.xp + 12;
               const nextLevel = Math.floor(nextXp / 100) + 1;
               const next = { score: nextScore, xp: nextXp, level: nextLevel };
               void syncProgress(next);
               return next;
            });
         }

         animationRef.current = requestAnimationFrame(render);
      };

      if (!isPaused) {
         animationRef.current = requestAnimationFrame(render);
      }

      return () => {
         if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
         }
      };
   }, [isPaused, syncProgress]);

   return (
      <section className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
         <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Mini Game Pulse</h3>
            <button
               type="button"
               className="rounded-lg border border-orange-200 px-2.5 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50"
               onClick={() => setIsPaused((value) => !value)}
            >
               {isPaused ? "Reprendre" : "Pause"}
            </button>
         </div>

         <canvas
            ref={canvasRef}
            width={320}
            height={110}
            className="h-[110px] w-full rounded-xl border border-orange-50 bg-orange-50/50"
         />

         <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-gray-50 px-2 py-1.5">Score: {progress.score}</div>
            <div className="rounded-lg bg-gray-50 px-2 py-1.5">Niveau: {progress.level}</div>
            <div className="rounded-lg bg-gray-50 px-2 py-1.5">XP: {progress.xp}/{levelThreshold}</div>
         </div>

         {!isReady && <p className="mt-2 text-xs text-gray-500">Chargement du module...</p>}
      </section>
   );
}
