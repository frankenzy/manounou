"use client";

import Header from "@/components/header";
import { IPostDTO } from "@/models/Post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import postsRepository from "@/repositories/postsRepository";
import Layout from "../../layout";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<IPostDTO | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await postsRepository.getById(id);
          if (data?.success) {
            setPost(data.data);
          } else {
            console.error("Erreur lors de la récupération de l'annonce:", data?.message);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'annonce:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPostDetails();
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

  if (!post) {
    return (
      <Layout>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Annonce non trouvée</p>
        </div>
      </Layout>
    );
  }

  const metadata = post.metadata as
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
              {post.title}
            </h1>

            <div
              className={`text-lg mb-6 ${metadata?.backgroundColor ? "text-white text-opacity-90" : "text-gray-700"}`}
            >
              {post.description}
            </div>

            <div
              className={`border-t ${metadata?.backgroundColor ? "border-white border-opacity-30" : "border-gray-300"} pt-4 mt-4`}
            >
              <p
                className={`text-sm ${metadata?.backgroundColor ? "text-white text-opacity-80" : "text-gray-600"}`}
              >
                <strong>Localisation:</strong> {post.location}
              </p>
              {post.created_at && (
                <p
                  className={`text-sm ${metadata?.backgroundColor ? "text-white text-opacity-80" : "text-gray-600"} mt-2`}
                >
                  <strong>Publié le:</strong>{" "}
                  {new Date(post.created_at).toLocaleDateString(
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
