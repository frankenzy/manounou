"use client";

import Modal from "@/components/Modal";
import Header from "@/components/header";

import UploadImage, { UploadImageRef } from "@/components/uploadImage";
// import Localization, { LocalizationRef, LocationData } from "@/components/localization";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import { faCalendar, faClock, faImage, faUser } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const uploadImageRef = useRef<UploadImageRef>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputBg, setInputBg] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [lastSelectedColor, setLastSelectedColor] = useState("");
  const [showUploadImage, setShowUploadImage] = useState(false);
  
  // État pour les annonces
  const [announcements, setAnnouncements] = useState<IAnnouncementDTO[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);

  // Récupérer les annonces via l'API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoadingAnnouncements(true);
      try {
        const response = await fetch('/api/announcements');
        const data = await response.json();
        if (data.success) {
          setAnnouncements(data.data || []);
        } else {
          console.error('Client: Échec de la récupération des annonces:', data.message);
        }
      } catch (error) {
        console.error('Client: Erreur lors de la récupération des annonces:', error);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };
    
    fetchAnnouncements();
  }, []);

  // Fonction pour ajuster automatiquement la hauteur du textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Réinitialise la hauteur
      const newHeight = Math.min(textarea.scrollHeight, 180); // Max 180px
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Ajuster la hauteur quand inputValue change
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);


  const handleInputBg = (color: string) => {
    if(inputValue.length >lengthLimit){ 
      return;
    }
    setInputBg(`${color} p-8`);
    setInputColor('text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center');
    setLastSelectedColor(color); // Sauvegarder la couleur choisie
    console.log("Input text color set to: ",inputColor);
  }




  const handleSubmit = () => {

    console.log("Search initiated with input: ", inputValue);

   //
    
  }
  const handleInputClick = () => {
    console.log('Input clicked');
    initialInputBg();
    setIsModalOpen(true);
  };


  const initialInputBg  = () => {
    setInputBg('bg-white');
    setInputColor('text-black');
    setInputSize('text-normal');
    setLastSelectedColor('');
    setInputComment('');
    setInputValue(''); // Réinitialise le texte
    // Réinitialise la hauteur du textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    console.log("Input changed: ", value);
    if (value.length > lengthLimit) {
      initialInputBg();
    } else if (value.length <= lengthLimit && lastSelectedColor) {
      handleInputBg(lastSelectedColor);
    }
    setInputValue(e.target.value);
  }

  // load image
  const handleLoadingImage = () => {
    initialInputBg();
    console.log("Loading image...");
    setShowUploadImage(true);
    setTimeout(() => {
      uploadImageRef.current?.openFileDialog();
    }, 100);
  }


  // set user
  const handleSetUser = () => {
    initialInputBg();
    console.log("Setting user...");
  }

  // set id card
  const handleSetIdCard = () => {
    console.log("Setting ID Card...");
  }

  // set calendar
  const handleSetCalendar = () => {
    initialInputBg();
    console.log("Setting calendar...");
  }

  return (
    <Layout>
      <Header />
      <main className="flex flex-col justify-center gap-8 row-start-2 md:items-center  sm:items-start border-gray-200 border-2 border-solid pb-5 rounded-xl h-screen ">
        <div className="flex flex-col w-full h-full px-4 py-8 gap-8">
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
                      className="border border-gray-300 rounded-full px-4 py-4 w-full md:w-[740px] sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={handleInputClick }
                    />
                    <button
                      className="ml-4 px-6 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 ml-[-6rem]"
                      onClick={handleSubmit}
                    >
                      Publier
                    </button>
                  </div>
                  
                  </div>
                </div>
              </div>



        <div className="p-4">
          <ListAnnouncement announcements={announcements} isLoadingAnnouncements={isLoadingAnnouncements} />
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
            <h2 className="text-[clamp(1rem,2vw,2rem)] font-bold mb-4">Publier une annonce</h2>
            <button className="flex items-end justify-end text-3xl mb-4" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <hr className="mb-4" />
         
         {/* section formulaire */}

         <div className={`"modal modalForms row justify-normal items-center rounded-lg gap-4 my-8 ${inputBg}`}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              placeholder="Décrire votre publication..."
              className={`flex flex-auto w-full p-2 rounded-lg focus:outline-none bg-inherit resize-none overflow-y-auto ${inputColor}`}
              style={{ minHeight: '60px', maxHeight: '180px' }}
              onChange={handleInput}
            />
            {
              showUploadImage && (
                <div className="flex flex-auto items-center justify-start">
                  <UploadImage
                    ref={uploadImageRef}
                    onUpload={(file) => {
                      console.log("Image uploaded: ", file);
                    }}
                  />
                </div>
              )
            }

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



           <div className="icons flex flex-row text-[clamp(1.5rem,2vw,2.5rem)] justify-start items-start gap-12">
              <div className="flex justify-start items-start">
                <FontAwesomeIcon icon={faImage} onClick={handleLoadingImage} color="gray" size="sm"/>
              </div>
              {/* TODO: Add location icon */}
              {/* <div className="flex justify-start items-start">
                <FontAwesomeIcon icon={faLocationDot} color="gray" size="sm" onClick={handleLoadingLocation}/>
              </div> */}
              <div className="flex justify-start items-start">
                <FontAwesomeIcon icon={faUser} color="gray" size="sm" onClick={handleSetUser} />
              </div>
              <div className="flex justify-start items-start">
                <FontAwesomeIcon icon={faCalendar} color="gray" size="sm" onClick={handleSetCalendar}/>
              </div>
              <div className="flex justify-start items-start">
                <FontAwesomeIcon icon={faClock} color="gray" size="sm" onClick={handleSetIdCard}/>
              </div>
          </div>

            <div className="flex justify-center items-center mt-4">
                <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            onClick={handleSubmit}
          >
            Suivant
          </button>
          </div>
        </div>
      </Modal>


    </Layout>
  );
}


const ListAnnouncement = ({ announcements, isLoadingAnnouncements }: { announcements: IAnnouncementDTO[], isLoadingAnnouncements: boolean }) => {
  const renderContent = () => {
    if (isLoadingAnnouncements) {
      return <p>Chargement des annonces...</p>;
    }
    
    if (announcements.length === 0) {
      return <p>Aucune annonce disponible.</p>;
    }
    
    return (
      <div className="flex flex-row gap-4 overflow-x-auto">
        {announcements.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md flex-col w-80">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
           <div className="w-full  h-full">
        <div className="p-4">
          {/* <p className="text-xl font-bold mb-4">Liste des annonces ({announcements.length})</p> */}
          {renderContent()}
        </div>

      </div>
    </div>
  );
}



/**
 * create announcement component
 * props: announcements: IAnnouncementDTO[], isLoadingAnnouncements: boolean
 */

const CreateAnnouncement = "";