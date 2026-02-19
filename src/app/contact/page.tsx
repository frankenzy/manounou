"use client";
import HEAD from "@/components/header";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./style.css";
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
                className="leftCol cols flex flex-row bg-[url(/sd.jpg)] bg-cover bg-no-repeat bg-center"
              >
                <div
                  className="leftColOverlay flex justify-center items-center w-full max-h-full bg-black bg-opacity-25"
                >
                  <p className="text-white font-bold hidden">Contact</p>
                </div>
              </div>
              <div
                className="rightCol cols flex flex-col bg-black h-screen pt-10"
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
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setIsAccepted(!isAccepted);
  };

  useEffect(() => {
    const formValidator = () => {
      const errors: Record<string, string> = {};
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
    formValidator();
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (isFormValid) {
      // TODO: Implement contact form submission endpoint
      alert("Formulaire valide (envoi non implémenté)");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setIsAccepted(false);
    } else {
      alert("Formulaire invalide");
      return;
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
