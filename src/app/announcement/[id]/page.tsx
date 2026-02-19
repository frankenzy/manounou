"use client";

import Header from "@/components/header";
import { IAnnouncementDTO } from "@/models/Announcement";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../layout";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [announcement, setAnnouncement] = useState<IAnnouncementDTO | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/announcements/${id}`);
          const data = await response.json();

          if (data.success) {
            setAnnouncement(data.data);
          } else {
            console.error(
              "Erreur lors de la récupération de l'annonce:",
              data.message,
            );
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'annonce:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnnouncementDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Chargement...</p>
        </div>
      </Layout>
    );
  }

  if (!announcement) {
    return (
      <Layout>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Annonce non trouvée</p>
        </div>
      </Layout>
    );
  }

  const metadata = announcement.metadata as
    | {
      background?: string;
      backgroundColor?: string;
      fontSize?: string;
    }
    | undefined;

  const bgClass =
    metadata?.background || metadata?.backgroundColor || "bg-white";

  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`${bgClass} p-8 rounded-lg shadow-lg`}>
            <h1
              className={`text-4xl font-bold mb-4 ${metadata?.backgroundColor ? "text-white" : "text-gray-900"}`}
            >
              {announcement.title}
            </h1>

            <div
              className={`text-lg mb-6 ${metadata?.backgroundColor ? "text-white text-opacity-90" : "text-gray-700"}`}
            >
              {announcement.description}
            </div>

            <div
              className={`border-t ${metadata?.backgroundColor ? "border-white border-opacity-30" : "border-gray-300"} pt-4 mt-4`}
            >
              <p
                className={`text-sm ${metadata?.backgroundColor ? "text-white text-opacity-80" : "text-gray-600"}`}
              >
                <strong>Localisation:</strong> {announcement.location}
              </p>
              {announcement.created_at && (
                <p
                  className={`text-sm ${metadata?.backgroundColor ? "text-white text-opacity-80" : "text-gray-600"} mt-2`}
                >
                  <strong>Publié le:</strong>{" "}
                  {new Date(announcement.created_at).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              ←
            </button>
          </div>

        </div>
      </main>
    </Layout>
  );
}
