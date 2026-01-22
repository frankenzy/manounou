"use client";

import CreateAnnouncement from "@/components/CreateAnnouncement";
import Header from "@/components/header";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import "../styles/animations.css";
import Layout from "./layout";

const FadeInImage = styled(Image)`
  animation: fadeIn 1s ease-out forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const lengthLimit = 140;
export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État pour les annonces
  const [announcements, setAnnouncements] = useState<IAnnouncementDTO[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [announce, setAnnounce] = useState<IAnnouncementDTO | null>(null);

  // Récupérer les annonces via l'API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoadingAnnouncements(true);
    try {
      const response = await fetch("/api/announcements");
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.data || []);
      } else {
        console.error(
          "Client: Échec de la récupération des annonces:",
          data.message,
        );
      }
    } catch (error) {
      console.error(
        "Client: Erreur lors de la récupération des annonces:",
        error,
      );
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShowDetail = (id: number) => {
    console.log("Show announcement detail...", id);
    const foundAnnounce = announcements.find((a) => a.id === id) || null;
    setAnnounce(foundAnnounce);
    console.log("Announce detail...", foundAnnounce);
    router.push(`/announcement/${id}`);
  };

  return (
    <Layout>
      <div className="w-full container mx-auto p-4 justify-center items-center">
        <Header />
        <main className="flex flex-col justify-center gap-8 row-start-2 md:items-center sm:items-start border-gray-200 border-2 border-solid pb-5 rounded-xl h-screen">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full h-full py-8 gap-8">
              {/* Section  landing page*/}
              <div className="grid grid-cols-1 items-center justify-center w-full">
                <div className="px-12 h-full w-full">
                  <div className="flex flex-col justify-start items-center px-24 py-8">
                    {/* <Logo className="items-start" /> */}
                    <div className="w-full">
                      <div className="flex flex-col items-center w-full">
                        <h3 className="text-6xl font-bold text-start text-[clamp(2rem,4vw,8rem)]">
                          Ma <strong>Nounou</strong>
                        </h3>

                        <div className="flex justify-center items-center my-4 w-full">
                          <input
                            type="text"
                            placeholder="Qoui de neuf ?"
                            className="border border-gray-300 rounded-full px-4 py-4 w-full md:w-[740px] sm:w-96 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onClick={handleInputClick}
                          />
                          <button
                            className="ml-4 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 ml-[-6rem]"
                            onClick={handleInputClick}
                          >
                            Publier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <ListAnnouncement
                      announcements={announcements}
                      isLoadingAnnouncements={isLoadingAnnouncements}
                      onShowDetail={handleShowDetail}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <CreateAnnouncement
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchAnnouncements}
        />
      </div>
    </Layout>
  );
}

const ListAnnouncement = ({
  announcements,
  isLoadingAnnouncements,
  onShowDetail,
}: {
  announcements: IAnnouncementDTO[];
  isLoadingAnnouncements: boolean;
  onShowDetail: (id: number) => void;
}) => {
  const renderContent = () => {
    if (isLoadingAnnouncements) {
      return <p>Chargement des annonces...</p>;
    }

    if (announcements.length === 0) {
      return <p>Aucune annonce disponible.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {announcements.map((post) => {
          const metadata = post.metadata;
          const bgClass =
            metadata?.background || metadata?.backgroundColor || "bg-white";
          const metaColor = metadata?.backgroundColor;
          const metaSize = metadata?.fontSize;
          return (
            <div
              key={post.id}
              role="button"
              tabIndex={0}
              className={`${bgClass}  p-8 rounded-lg shadow-md flex flex-col min-h-48 items-center cursor-pointer`}
              onClick={() => onShowDetail(post.id!)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onShowDetail(post.id!);
                }
              }}
            >
              <h2
                className={`${metaSize} text-3xl font-semibold ${metaColor ? "text-white" : ""}`}
              >
                {post.title}
              </h2>
              <p
                className={`${metaSize || "text-2xl"} ${metaColor ? "text-white" : ""} text-opacity-90`}
              >
                {post.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full">
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

const DynamicListAnnouncement = ({
  announcements,
  isLoadingAnnouncements,
}: {
  announcements: IAnnouncementDTO[];
  isLoadingAnnouncements: boolean;
}) => {
  const renderContent = () => {
    if (isLoadingAnnouncements) {
      return <p>Chargement des annonces...</p>;
    }

    if (announcements.length === 0) {
      return <p>Aucune annonce disponible.</p>;
    }

    const rows = [];
    let index = 0;

    while (index < announcements.length) {
      if (rows.length % 4 === 0) {
        rows.push(
          <div key={rows.length} className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">
                {announcements[index].title}
              </h2>
              <p className="text-gray-600">
                {announcements[index].description}
              </p>
            </div>
            {index + 1 < announcements.length && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  {announcements[index + 1].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index + 1].description}
                </p>
              </div>
            )}
            {index + 2 < announcements.length && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  {announcements[index + 2].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index + 2].description}
                </p>
              </div>
            )}
          </div>,
        );
        index += 3;
      } else if (rows.length % 4 === 1) {
        const cols = [];
        for (let i = 0; i < 4 && index < announcements.length; i++, index++) {
          cols.push(
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">
                {announcements[index].title}
              </h2>
              <p className="text-gray-600">
                {announcements[index].description}
              </p>
            </div>,
          );
        }
        rows.push(
          <div key={rows.length} className="grid grid-cols-4 gap-4 mb-4">
            {cols}
          </div>,
        );
      } else if (rows.length % 4 === 2) {
        rows.push(
          <div key={rows.length} className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">
                {announcements[index].title}
              </h2>
              <p className="text-gray-600">
                {announcements[index].description}
              </p>
            </div>
            {index + 1 < announcements.length && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  {announcements[index + 1].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index + 1].description}
                </p>
              </div>
            )}
          </div>,
        );
        index += 2;
      } else {
        rows.push(
          <div key={rows.length} className="grid grid-cols-3 gap-4 mb-4">
            {index < announcements.length && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  {announcements[index].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index].description}
                </p>
              </div>
            )}
            {index + 1 < announcements.length && (
              <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">
                  {announcements[index + 1].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index + 1].description}
                </p>
              </div>
            )}
            {index + 2 < announcements.length && (
              <div className="bg-white p-4 rounded-lg shadow-md ">
                <h2 className="text-lg font-semibold">
                  {announcements[index + 2].title}
                </h2>
                <p className="text-gray-600">
                  {announcements[index + 2].description}
                </p>
              </div>
            )}
          </div>,
        );
        index += 3;
      }
    }

    return rows;
  };

  return (
    <div>
      <div className="w-full">
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};
