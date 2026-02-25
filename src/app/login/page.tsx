"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Buttons from "../../components/ui/buttons/buttons";
import Logo from "../../components/Logo";
import Input from "../../components/ui/forms/Input";
import Header from "../../components/header";
import Loyout from "../layout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [isNumberValid, setIsNumberValid] = useState<boolean>(true);
  const [step, setStep] = useState<"phone" | "loading" | "password">("phone");


  // const isValidate = email.includes("@") && password.length >= 1;
  const isValidate = true;

  const handleFocus = () => {
    setInputFocus(true);
  };

  const handleBlur = () => {
    setInputFocus(false);
  };


  const slideVariants = {

    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),


    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },

    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 1, 1],
      },
    }),


  };


  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    setIsNumberValid(/^\d*$/.test(value));
  };

  const handleSubmit = async () => {
    setStep("loading");
    if (!isValidate) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (res.ok && data.success) {
        router.push("/manounou");
        setStep("password");
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPhone = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStep("password");
  };

  return (
    <Loyout>
      <Header />

      <AnimatePresence initial={false} mode="wait" custom={1}>
        {step === "phone" && (

          <motion.div
            key="phone"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={1}
          >
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
              <main className="flex flex-col row-start-2 items-center sm:items-start border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl">
                <div className="flex flex-col gap-8 items-center content">
                  <div className="flex flex-col items-center w-full">
                    <Logo />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <h3 className="text-4xl font-bold">Connexion Nounou</h3>
                    <p className="text-xl text-center my-4">
                      Connectez-vous à votre compte Manounou
                    </p>
                  </div>

                  {error && (
                    <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    disabled={isLoading}
                    Placeholder="Numéro de téléphone"
                    className="w-full"
                    type="tel"
                    name="telephone"
                    value={email}
                    onChange={handleNumberChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={true}
                  />

                  {inputFocus && (
                    <p className="text-sm text-gray-500 mt-1">
                      Entrez votre numéro de téléphone pour vous connecter
                    </p>
                  )}

                  <Buttons
                    onClick={handleSubmitPhone}
                    className={`w-full py-5 border-2 hover:bg-slate-300 shadow-sm ${isValidate
                      ? "bg-orange-500 text-white "
                      : "bg-gray-300  text-gray-900"
                      }`}
                    disabled={!isValidate || isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Buttons>
                </div>
              </main>
            </div>
          </motion.div>

        )}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center py-4"
          >
            <div className="h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            key="password"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={-1}
          >
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
              <main className="flex flex-col row-start-2 items-center border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl w-full max-w-2xl">
                <div className="flex flex-col gap-6 items-center w-full">
                  <div className="flex flex-col items-center w-full">
                    <Logo />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <h3 className="text-3xl font-bold">Entrez votre mot de passe</h3>
                    <p className="text-lg text-center my-2 text-gray-600">
                      Pour sécuriser votre compte Manounou
                    </p>
                  </div>

                  {error && (
                    <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    disabled={isLoading}
                    Placeholder="Mot de passe"
                    className="w-full"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />

                  <Buttons
                    onClick={handleSubmit}
                    className={`w-full py-5 border-2 shadow-sm ${isValidate
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                      : "bg-gray-300 border-gray-300 text-gray-600"
                      }`}
                    disabled={!isValidate || isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Buttons>
                </div>
              </main>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </Loyout>
  );
}
