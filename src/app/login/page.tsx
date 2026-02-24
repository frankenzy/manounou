"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Buttons from "../../components/ui/buttons/buttons";
import Logo from "../../components/Logo";
import Input from "../../components/ui/forms/Input";
import Header from "../../components/header";
import RegisterLink from "../../components/RegisterLink";
import Loyout from "../layout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isValidate = email.includes("@") && password.length >= 1;

  const handleFocus = () => {
    setOnFocus(true);
  };

  const handleBlur = () => {
    setOnFocus(false);
  };

  const handleSubmit = async () => {
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
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setIsLoading(false);
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
                  Connectez-vous à votre compte Manounou
                </p>
              </div>

              {error && (
                <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* input form */}

              <Input
                disabled={isLoading}
                Placeholder="Adresse email"
                className="w-full"
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={true}
              />
              <Input
                disabled={isLoading}
                Placeholder="Mot de passe"
                className="w-full"
                type="password"
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required={true}
              />
              <Buttons
                onClick={handleSubmit}
                className={`w-full py-5 border-2 hover:bg-slate-300 shadow-sm ${isValidate
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-300 border-red-500 text-gray-900"
                  }`}
                disabled={!isValidate || isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
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
