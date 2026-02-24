"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Buttons from "@/components/buttons";
import Loyout from "../layout";
import { IFriendshipDTO } from "@/models/Friendship.model";
import { IUserDTO } from "@/models/User.model";

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

  return (
    <Loyout>
      <Header />
      <div className="min-h-screen p-8 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-3xl font-bold mb-8">Mes amis</h1>

        {/* Send friend request */}
        <section className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Envoyer une demande</h2>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="ID de l'utilisateur"
              value={newFriendId}
              onChange={(e) => setNewFriendId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <Buttons
              onClick={handleSendRequest}
              className="px-6 py-2 bg-orange-500 text-white border-orange-500"
              disabled={!newFriendId}
            >
              Envoyer
            </Buttons>
          </div>
          {sendError && <p className="text-red-500 text-sm mt-2">{sendError}</p>}
          {sendSuccess && <p className="text-green-600 text-sm mt-2">{sendSuccess}</p>}
        </section>

        {/* Pending requests */}
        <section className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Demandes reçues{" "}
            {pendingRequests.length > 0 && (
              <span className="bg-orange-500 text-white text-sm rounded-full px-2 py-0.5 ml-1">
                {pendingRequests.length}
              </span>
            )}
          </h2>
          {isLoading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-500">Aucune demande en attente</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.map((req) => (
                <li
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{req.requesterUsername}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(req.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Buttons
                      onClick={() => handleRespond(req.id, "ACCEPT")}
                      className="px-4 py-1.5 bg-green-500 text-white text-sm border-green-500 hover:bg-green-600"
                    >
                      Accepter
                    </Buttons>
                    <Buttons
                      onClick={() => handleRespond(req.id, "REJECT")}
                      className="px-4 py-1.5 bg-red-500 text-white text-sm border-red-500 hover:bg-red-600"
                    >
                      Refuser
                    </Buttons>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Friends list */}
        <section className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Mes amis ({friends.length})</h2>
          {isLoading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : friends.length === 0 ? (
            <p className="text-gray-500">Aucun ami pour le moment</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((f) => {
                const friendName = getFriendUsername(f);
                return (
                  <li key={f.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {friendName[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{friendName}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </Loyout>
  );
}
