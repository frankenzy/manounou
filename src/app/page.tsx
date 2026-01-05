"use client";

import Logo from "@/components/Logo";
import Modal from "@/components/Modal";
import Buttons from "@/components/buttons";
import Header from "@/components/header";

import { faIdCard, faImage, faLocation, faUser } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputBg, setInputBg] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [inputSize, setInputSize] = useState("");

  const handleInputBg = (color: string) => {
    setInputBg(`${color} p-8`);
    setInputColor('text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold');
    // setInputSize('text-32px');
    console.log("Input text color set to: ",inputColor);
  }


  const handleSearch = () => {

    console.log("Search initiated with input: ", inputValue);
    // router.push(`/search?query=${encodeURIComponent(inputValue)}`);
  }
  //ouverture d'un modal au click sur le input
  const handleInputClick = () => {
    console.log('Input clicked');
    initialInputBg();
    setIsModalOpen(true);
  };


  const initialInputBg  = () => {
    setInputBg('bg-white');
    setInputColor('text-black');
    setInputSize('text-normal');
    setInputComment('');
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  // load image
  const handleLoadingImage = () => {
    console.log("Image loading...");
  }

  // set location
  const handleSetLocation = () => {
    console.log("Setting location...");
  }

  // set user
  const handleSetUser = () => {
    console.log("Setting user...");
  }

  // set id card
  const handleSetIdCard = () => {
    console.log("Setting ID Card...");
  }

  return (
    <Layout>
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start border-gray-200 border-2 border-solid pb-5 rounded-xl">
        <div className="flex flex-col w-full">
          {/* Section  landing page*/}
          <div className="grid grid-cols-1 items-center justify-center w-full">
            <div className="col-span-1 px-12">
              <div className="flex flex-col justify-start items-center px-24 py-8">
                <Logo className="items-start" />
                <div className="w-full">
                  <div className="flex flex-col items-center w-full">
                    <h3 className="text-4xl font-bold text-start">
                      Ma <strong>Nounou</strong>
                    </h3>
                  

                  <div className="flex justify-center items-center my-4">
                    <input
                      type="text"
                      placeholder="Qoui de neuf ?"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-96"
                      onClick={handleInputClick }
                      // onChange={handleInput}
                    />
                  </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <Buttons
                      onClick={handleSearch}
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
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="my-modal">
        <div className="p-6">
          <div className="modalHeader flex items-center justify-between">
            <div className="void">

            </div>
            <h2 className="text-[clamp(1rem,2vw,2rem)] font-bold mb-4">Créer une publication</h2>
            <button className="flex items-end justify-end text-3xl mb-4" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <hr className="mb-4" />
         


         {/* section formulaire */}

         <div className={`"modal modalForms flex flex-auto justify-normal items-center rounded-lg gap-4 my-8 ${inputBg}`}>
            <textarea
              placeholder="Décrire votre publication..."
              className={`w-full h-32 p-2 rounded-lg focus:outline-none bg-inherit ${inputColor}`}
            ></textarea>

          </div>


          {/* Set input background color */}
          <div className="flex-auto flex flex-row gap-4 text-[clamp(1rem,2vw,1.5rem)] justify-start items-start mb-4">
          <button className="w-5 bg-red-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
          onClick={() => handleInputBg('bg-gradient-to-br from-red-500 to-yellow-500')}/>
          <button className="w-5 bg-green-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
          onClick={() => handleInputBg('bg-gradient-to-br from-emerald-400 to-cyan-600')}/>
          <button className="w-5 bg-blue-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
          onClick={() => handleInputBg('bg-gradient-to-br from-blue-600 to-indigo-700')}/>
          <button className="w-5 bg-yellow-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
          onClick={() => handleInputBg('bg-gradient-to-br from-amber-400 to-orange-500')}/>
          <button className="w-5 bg-gray-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
          onClick={() => handleInputBg('bg-gradient-to-br from-slate-600 to-slate-800')}/>
          
          <button className="w-5 bg-white rounded-md h-6 p-2 text-white flex items-center justify-center border-2 border-black"
          onClick={() => initialInputBg()}/>
          </div>


          <div className="modal forms modalForms footer modalFormsFooters bg-gray-600 border-2 border-white-600 flex flex-auto justify-normal items-center p-2 rounded-lg gap-4">

          <h2>Ajouter un details sur la publication:</h2>

           <div className="icons flex flex-row gap-4 text-[clamp(1rem,2vw,1.5rem)] justify-end items-end">
            <FontAwesomeIcon icon={faImage} onClick={handleLoadingImage} className=""/>
            <FontAwesomeIcon icon={faLocation} />
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon icon={faIdCard} />
            </div>
          </div>


            <div className="flex justify-center items-center mt-4">
                <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={handleSearch}
          >
            Suivant
          </button>
    </div>
        </div>
      </Modal>
    </Layout>
  );
}
