"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Buttons from "../../components/buttons";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import Header from "../../components/header";
import RegisterLink from "../../components/RegisterLink";
import Login from "@/Auth/login";
import Loyout from "../layout";
import { useState } from "react";

export default function Home() {
  const [telephone, setTelephone] = useState<string>("");
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const [isValidate, setIsValidate] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelephone(e.target.value);
    const valueCompte = e.target.value.replace("/s/g", "").length;

    if (valueCompte >= 10) {
      setIsValidate(true);
    } else {
      setIsValidate(false);
    }
  };

  const handleFocus = () => {
    setOnFocus(true);
    console.log("Input focused");
  };

  const handleBlur = () => {
    setOnFocus(false);
    console.log("Input lost focus");
  };

  const handleSubmit = async () => {
    try {
      const response = await Login.loginService(telephone);
      if (response.success) {
        // Gérer la réponse positive
        console.log("Login réussi");
      } else {
        // Gérer la réponse négative
        console.log("Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    }
  };

  return (
    <Loyout>
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col row-start-2 items-center sm:items-start border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl">
            <div className="flex flex-col gap-8 items-center content">
              <div className="flex flex-col items-center w-full">
                <Logo />
              </div>

              <div className="flex flex-col items-center w-full">
                <h3 className="text-4xl font-bold">Connexion DJALO</h3>
                <p className="text-xl text-center my-4">
                  Sign in to v0 using your Vercel account.
                </p>
              </div>

              {/* input form */}

              <Input
                disabled={false}
                Placeholder="Numéro de telephone"
                className="w-full"
                type="number"
                name="numero"
                value={telephone}
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={true}
              />
              <Buttons
                onClick={handleSubmit}
                className={`w-full py-5 border-2 hover:bg-slate-300 shadow-sm ${isValidate
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-300 border-red-500 text-gray-900"
                  }`}
                disabled={!isValidate}
              >
                Continuer avec un Numero
              </Buttons>

              <div className="flex flex-col items-center w-full">
                <hr className="border border-solid border-gray-500 w-full"></hr>
              </div>

              <div className="flex flex-row gap-1 justify-between items-center w-full">
                <Buttons
                  onClick={() => { }}
                  className="px-6 py-5 bg-white text-gray-900 hover:bg-slate-300 transition duration-200"
                >
                  <div className="flex gap-2 flex-row justify-between items-center">
                    <Image
                      src="/github.svg"
                      alt="Github icon"
                      width={20}
                      height={20}
                    />
                    Github
                  </div>
                </Buttons>
                <Buttons
                  onClick={() => { }}
                  className="px-6 py-5 bg-violet-500  hover:bg-violet-800 transition duration-200"
                >
                  <div className="flex gap-2 flex-row justify-between items-center">
                    <Image
                      src="/gitlab.svg"
                      alt="Google icon"
                      width={20}
                      height={20}
                    />
                    Gitlab
                  </div>
                </Buttons>
                <Buttons
                  onClick={() => { }}
                  className="px-6 py-5 hover:bg-green-900 transition duration-200"
                >
                  <div className="flex gap-2 flex-row justify-between items-center">
                    <Image
                      src="/bitbucket.svg"
                      alt="Bitbucket icon"
                      width={20}
                      height={20}
                    />
                    Bitbucket
                  </div>
                </Buttons>
              </div>

              <div className="flex flex-col gap-2 items-center w-full">
                <Buttons
                  onClick={() => { }}
                  className={`
                  ${onFocus
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-300 text-gray-900"
                    }border-black border-2 shadow-sm
                  `}
                >
                  <div className="flex gap-2 flex-row justify-center items-center text-xl">
                    <Image
                      src="/cadenar.svg"
                      alt="keys"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    Continiue with SAML SSO
                  </div>
                </Buttons>
                <Buttons
                  onClick={() => { }}
                  className="py-4 px-5 w-full bg-inherit border border-solid bottom-2 border-gray-600 rounded-xl hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-shadow duration-200"
                >
                  <div className="flex gap-2 flex-row justify-center items-center text-xl">
                    <Image
                      src="/keys.svg"
                      alt="password"
                      width={30}
                      height={30}
                    />
                    Continiue with passkey
                  </div>
                </Buttons>
              </div>
            </div>

            <div className="w-full py-2 bg-[#575656] text-black rounded-2xl px-3">
              <p className="text-center text-xl">
                Vous n&apos;avez pas de compte ?
                <span className="underline ml-2">
                  <RegisterLink className="text-white" />
                </span>
              </p>
            </div>
          </main>
        </div>
      </motion.div>
    </Loyout>
  );
}
