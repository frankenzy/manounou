"use client";
import HEAD from "@/components/header";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as styles from "./style.css";
import { Layout } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Layout>
        <main>
          <HEAD />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2">
              <div
                className={`${styles.leftCol} cols flex flex-row bg-[url(/sd.jpg)] bg-cover bg-no-repeat bg-center`}
              >
                <div
                  className={`${styles.leftColOverlay} flex justify-center items-center w-full max-h-full bg-black bg-opacity-25`}
                >
                  <p className="text-white font-bold hidden">Contact</p>
                </div>
              </div>
              <div
                className={`${styles.rightCol} cols flex flex-col bg-black h-screen pt-10`}
              >
                <div className="flex w-full justify-center">
                  <motion.h1
                    className="text-white text-7xl"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Contactez-nous
                  </motion.h1>
                  {/* <h1 className="text-white text-7xl">Contactez nous</h1> */}
                </div>
                <div className="flex flex-col justify-center items-center w-full h-full px-4">
                  <ContactForms />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </Layout>
    </>
  );
};

const ContactForms = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setIsAccepted(!isAccepted);
  };

  useEffect(() => {
    formValidator();
  }, ["name", "email", "message"]);

  const formValidator = () => {
    const errors: any = {};
    if (formData.name === "") {
      errors.name = "Le nom est requis";
    }
    if (!formData.email) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "L'email est invalide";
    }
    if (!formData.message) {
      errors.message = "Le message est requis";
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //logique d'envoie
    console.log(formData);
    if (isFormValid) {
      alert("Formulaire valide");
    } else {
      alert("Formulaire invalide");
      return;
    }
    //Ajoute la logique d'envois des données
    try {
      const response = await fetch("/api/utilisateurs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        alert("Message envoyé avec succès!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setIsAccepted(false);
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'envoi du message");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-5/6">
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <input
        name="name"
        placeholder="Entre votre nom"
        className="w-full border-b-2 border-white rounded-sm bg-black h-16 text-white"
        value={formData.name}
        onChange={handleInputChange}
      />

      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <input
        name="email"
        placeholder="Entre votre Email"
        className="w-full border-b-2 border-white rounded-sm bg-black h-16 text-white"
        value={formData.email}
        onChange={handleInputChange}
      />
      <textarea
        name="message"
        value={formData.message}
        className="w-full border-b-2 border-white bg-black h-24 text-white flex flex-col justify-end bottom-0"
        // onChange={handleInputChange}
        placeholder="Votre message"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-5 w-5 mr-2 bg-white text-white"
          name="accepted"
          onChange={handleCheckboxChange}
          value="j'accepte les condition d'utilisation"
        />
        <label htmlFor="accepted" className="text-white">
          {"J'accepte les conditions d'utilisation"}
        </label>
      </div>

      {/* <button
        type="submit"
        className={`bg-orange-500 text-white p-2 rounded-lg h-16 ${
          isAccepted ? "" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isAccepted}
      >
        Envoyer
      </button> */}

      <motion.button
        type="submit"
        className={`bg-orange-500 text-white p-2 rounded-lg h-16 ${isAccepted ? "" : "opacity-50 cursor-not-allowed"
          }`}
        disabled={!isAccepted}
        whileHover={{ scale: isAccepted ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        Envoyer
      </motion.button>
    </form>
  );
};

export default Contact;
