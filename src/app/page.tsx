"use client";
import Image from "next/image";

import Buttons from "@/components/buttons";
import Header from "@/components/header";
import FadeInSection from "@/utils/animationUtils";
import { useRouter } from "next/navigation";
import styled from "styled-components";


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


export default function Home() {

  const router = useRouter();
  const handleCall = () => {
    router.push("/login");
  };
  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start border-gray-200 border-2 border-solid pb-5 rounded-xl">
        <div className="flex flex-col w-full">

          <div className="grid md:grid-cols-2 items-center justify-center w-full">
            <div className="col-span-1 px-12">
              <div className="flex flex-col justify-start items-center px-24 py-8">
                <div className="w-full">
                  <div className="flex flex-col items-start w-full">
                    <h3 className="text-8xl font-bold text-start">
                      Ma <strong>Nounou</strong>
                    </h3>
                    <p className="text-xl text-center my-4">
                      Trouve ta fille de menage
                    </p>
                  </div>
                  <div className="flex justify-start items-center">
                    <Buttons
                      onClick={handleCall}
                      className="py-5 bg-gray-900 hover:bg-slate-700 text-gray-900 rounded-lg text-[10px] sm:text-sm"
                    >
                      Announce
                      <i className="fa fa-arrow-right ml-2"></i>
                    </Buttons>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="flex flex-col justify-center items-center px-12 py-8 min-h-[900px] bg-[#d9788b] rounded-lg">
                <FadeInImage
                  src="/02.png"
                  alt="hero"
                  width={1000}
                  height={100}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>

          <section>
            <div className="flex flex-row items-center justify-center h-screen  gap-4">
              <div className=" h-full w-full bg-[#d9788b]  rounded-lg items-center p-4">
                <div className="flex justify-center items-center">
                  <FadeInImage
                    src="/001.png"
                    alt="hero"
                    width={1000}
                    height={100}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
              <div className="flex h-full flex-col w-full justify-center items-center p-4">
                <p className="text-center my-4 text-8xl font-bold">
                  Participez à des défis provenant de divers pays
                  <span className="text-9xl font-bold  animated-text block text-red-500 ">
                    +130 pays
                  </span>
                </p>
              </div>
            </div>
          </section>

          <FadeInSection>
            <section>
              <div className="flex flex-row items-center  gap-4 justify-center h-screen">
                <div className="flex h-full flex-col w-full justify-center container ">
                  <p className="text-center text-6xl font-bold py-20 text-wrap">
                    {` Faites-vous plein d'amis plein d'argent, pleine de joies`}
                  </p>
                </div>

                <div className=" h-full flex justify-center items-center flex-col w-full bg-[#d9788b] rounded-lg ani">
                  <FadeInImage
                    src="/03.png"
                    alt="hero"
                    className="object-cover items-center"
                    width={600}
                    height={100}
                  />
                </div>
              </div>
            </section>
          </FadeInSection>
        </div>
      </main>
      =    </>
  );
}