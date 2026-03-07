"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Buttons from "@/components/ui/buttons/buttons";
import Loyout from "../layout";
import { IFriendshipDTO } from "@/models/Friendship.model";
import { IUserDTO } from "@/models/User.model";
import { AnimatedReveal } from "@/components/premium/motion/AnimatedReveal";
import { StaggerItem, StaggerList } from "@/components/premium/motion/StaggerList";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Search, UserPlus, Users } from "lucide-react";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default function FriendsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<IUserDTO | null>(null);
  const [pendingRequests, setPendingRequests] = useState<IFriendshipDTO[]>([]);
  const [friends, setFriends] = useState<IFriendshipDTO[]>([]);
  const [newFriendId, setNewFriendId] = useState<string>("");
  const [sendError, setSendError] = useState<string>("");
  const [sendSuccess, setSendSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFriendId, setActiveFriendId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [meRes, pendingRes, friendsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/friendships?type=pending"),
        fetch("/api/friendships"),
      ]);
      if (meRes.status === 401 || pendingRes.status === 401 || friendsRes.status === 401) {
        router.push("/login");
        return;
      }
      const meData = (await meRes.json()) as ApiResponse<IUserDTO>;
      const pendingData = (await pendingRes.json()) as ApiResponse<IFriendshipDTO[]>;
      const friendsData = (await friendsRes.json()) as ApiResponse<IFriendshipDTO[]>;
      if (meData.success && meData.data) setCurrentUser(meData.data);
      if (pendingData.success && pendingData.data) setPendingRequests(pendingData.data);
      if (friendsData.success && friendsData.data) setFriends(friendsData.data);
    } catch {
      console.error("Failed to load friends data");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRespond = async (friendshipId: number, action: "ACCEPT" | "REJECT") => {
    try {
      const res = await fetch(`/api/friendships/${friendshipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as ApiResponse<IFriendshipDTO>;
      if (data.success) {
        await fetchData();
      }
    } catch {
      console.error("Failed to respond to request");
    }
  };

  const handleSendRequest = async () => {
    setSendError("");
    setSendSuccess("");
    const addresseeId = parseInt(newFriendId, 10);
    if (isNaN(addresseeId) || addresseeId <= 0) {
      setSendError("Veuillez entrer un ID utilisateur valide");
      return;
    }
    try {
      const res = await fetch("/api/friendships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresseeId }),
      });
      const data = (await res.json()) as ApiResponse<IFriendshipDTO>;
      if (data.success) {
        setSendSuccess("Demande d'amitié envoyée !");
        setNewFriendId("");
        await fetchData();
      } else {
        setSendError(data.message || "Erreur lors de l'envoi");
      }
    } catch {
      setSendError("Erreur réseau");
    }
  };

  const getFriendUsername = (friendship: IFriendshipDTO): string => {
    if (!currentUser?.id) return friendship.addresseeUsername ?? "Inconnu";
    return friendship.requesterId === currentUser.id
      ? (friendship.addresseeUsername ?? "Inconnu")
      : (friendship.requesterUsername ?? "Inconnu");
  };

  const filteredFriends = friends.filter((friendship) =>
    getFriendUsername(friendship).toLowerCase().includes(search.toLowerCase())
  );

  const activeFriend = filteredFriends.find((friendship) => friendship.id === activeFriendId) ?? filteredFriends[0];

  return (
    <Loyout>
      <Header />
      <div className="min-h-screen px-4 py-20 md:px-8 font-[family-name:var(--font-geist-sans)]">
        <div className="mx-auto max-w-6xl space-y-4">
          <AnimatedReveal className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Réseau & Conversations</h1>
                <p className="text-sm text-gray-600">Gérez vos relations et vos échanges en temps réel</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                <Users className="h-4 w-4" />
                {friends.length} amis
              </div>
            </div>
          </AnimatedReveal>

          <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
            <div className="space-y-4">
              <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm md:p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <UserPlus className="h-4 w-4 text-orange-500" />
                  Envoyer une demande
                </h2>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="number"
                    aria-label="Identifiant utilisateur pour envoyer une demande"
                    placeholder="ID de l'utilisateur"
                    value={newFriendId}
                    onChange={(e) => setNewFriendId(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  />
                  <Buttons
                    onClick={handleSendRequest}
                    className="px-4 py-2 bg-orange-500 text-white border-orange-500 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-auto"
                    disabled={!newFriendId}
                  >
                    Envoyer
                  </Buttons>
                </div>
                {sendError && <p aria-live="polite" className="mt-2 text-xs text-red-500">{sendError}</p>}
                {sendSuccess && <p aria-live="polite" className="mt-2 text-xs text-green-600">{sendSuccess}</p>}
              </AnimatedReveal>

              <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm md:p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                  Demandes reçues
                  {pendingRequests.length > 0 && (
                    <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">{pendingRequests.length}</span>
                  )}
                </h2>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                    ))}
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <p className="text-sm text-gray-600">Aucune demande en attente</p>
                ) : (
                  <StaggerList className="space-y-2">
                    {pendingRequests.map((req) => (
                      <StaggerItem key={req.id}>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{req.requesterUsername}</p>
                              <p className="text-xs text-gray-600">{new Date(req.created_at).toLocaleDateString("fr-FR")}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Buttons
                                onClick={() => handleRespond(req.id, "ACCEPT")}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs border-green-500 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 sm:flex-none"
                              >
                                Accepter
                              </Buttons>
                              <Buttons
                                onClick={() => handleRespond(req.id, "REJECT")}
                                className="flex-1 px-3 py-1.5 bg-red-500 text-white text-xs border-red-500 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:flex-none"
                              >
                                Refuser
                              </Buttons>
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerList>
                )}
              </AnimatedReveal>

              <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm md:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">Mes amis</h2>
                  <span className="text-xs text-gray-600">{friends.length}</span>
                </div>
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    aria-label="Rechercher un ami"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un ami"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />
                    ))}
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <p className="text-sm text-gray-600">Aucun ami trouvé</p>
                ) : (
                  <StaggerList className="space-y-2">
                    {filteredFriends.map((friendship) => {
                      const friendName = getFriendUsername(friendship);
                      const isActive = activeFriend?.id === friendship.id;

                      return (
                        <StaggerItem key={friendship.id}>
                          <button
                            type="button"
                            onClick={() => setActiveFriendId(friendship.id)}
                            aria-pressed={isActive}
                            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${isActive
                                ? "border-orange-200 bg-orange-50"
                                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                              }`}
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                              {friendName[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">{friendName}</p>
                              <p className="text-xs text-gray-600">Disponible</p>
                            </div>
                          </button>
                        </StaggerItem>
                      );
                    })}
                  </StaggerList>
                )}
              </AnimatedReveal>
            </div>

            <AnimatedReveal className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 p-3.5 md:p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Conversation</p>
                  <p className="text-xs text-gray-600">
                    {activeFriend ? getFriendUsername(activeFriend) : "Sélectionnez un ami"}
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-orange-500" />
              </div>

              <div className="h-[360px] space-y-3 overflow-y-auto p-3.5 md:h-[420px] md:p-4">
                <AnimatePresence mode="popLayout">
                  {!activeFriend ? (
                    <motion.div
                      key="empty-chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500"
                    >
                      Choisissez un ami pour commencer une conversation
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeFriend.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="space-y-3"
                    >
                      <div className="max-w-[80%] rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700">
                        Bonjour 👋, disponible pour échanger sur les missions cette semaine ?
                      </div>
                      <div className="ml-auto max-w-[80%] rounded-xl bg-orange-500 px-3 py-2 text-sm text-white">
                        Oui, je peux commencer dès lundi matin.
                      </div>
                      <div className="max-w-[80%] rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700">
                        Parfait, je vous envoie les détails dans l’après-midi.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-100 p-3.5 md:p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="Message à envoyer"
                    placeholder="Écrire un message..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    disabled={!activeFriend}
                  />
                  <button
                    type="button"
                    disabled={!activeFriend}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </div>
    </Loyout>
  );
}
