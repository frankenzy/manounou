"use client";
import { AnimatePresence, motion } from "framer-motion";
import Buttons from "../../components/ui/buttons/buttons";
import Logo from "../../components/Logo";
import Input from "../../components/ui/forms/Input";
import Header from "../../components/header";
import Loyout from "../layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginAnimation from "@/components/animations/LoginAnimation";
import { error } from "node:console";

export default function Home() {
  const router = useRouter();
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [step, setStep] = useState<"phone" | "password" | "login">("phone");


  const isPhoneStepValid = phone.trim().length > 0 && /^[0-9]{10}$/.test(phone);
  const isPasswordStepValid = password.trim().length > 0;

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


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setError("");
    setIsPhoneValid(value.trim().length === 0 || /^[0-9]{10}$/.test(value));
  };

  const handleSubmit = async () => {
    if (!isPasswordStepValid || !isPhoneStepValid) {
      setError("Numéro de téléphone ou mot de passe invalide");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
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

  const handleSubmitPhone = async () => {
    if (!isPhoneStepValid) {
      setError("Veuillez saisir un numéro de téléphone valide");
      return;
    }

    setIsLoading(true);
    // setStep("login");

    setError("");

    try {
      const res = await fetch("/api/auth/login/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = (await res.json()) as {
        success: boolean;
        exists?: boolean;
        message?: string;
      };

      if (!res.ok || !data.success) {
        setError(data.message || "Impossible de vérifier le numéro");
        return;
      }

      if (!data.exists) {
        setError("Ce numéro n'est associé à aucun compte");
        return;
      }

      setStep("password");
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setIsLoading(false);
    }
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
                  <LoginAnimation />


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
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={true}
                  />

                  {!isPhoneValid && (
                    <p className="text-sm text-red-500 mt-1">Numéro de téléphone invalide</p>
                  )}

                  {inputFocus && (
                    <p className="text-sm text-gray-500 mt-1">
                      Entrez votre numéro de téléphone pour vous connecter
                    </p>
                  )}

                  <Buttons
                    onClick={handleSubmitPhone}
                    className={`w-full py-5 border-2 hover:bg-slate-300 shadow-sm ${isPhoneStepValid
                      ? "bg-orange-500 text-white "
                      : "bg-gray-300  text-gray-900"
                      }`}
                    disabled={!isPhoneStepValid || isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Buttons>
                </div>
              </main>
            </div>
          </motion.div>

        )}

        {step === "login" && (
          <div className="flex items-center justify-center min-h-screen bg-red-500">
            <LoginAnimation />
          </div>
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
            <Login
              error={error}
              isLoading={isLoading}
              password={password}
              setPassword={setPassword}
              phone={phone}
              handleSubmit={handleSubmit}
              isPasswordStepValid={isPasswordStepValid}
              setStep={setStep}
              setError={setError}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </Loyout>
  );

}



type LoginProps = {
  error: string;
  isLoading: boolean;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  handleSubmit: () => void;
  isPasswordStepValid: boolean;
  setStep: React.Dispatch<React.SetStateAction<"phone" | "password" | "login">>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

const Login = ({
  error,
  isLoading,
  password,
  setPassword,
  phone,
  handleSubmit,
  isPasswordStepValid,
  setStep,
  setError,
}: LoginProps) => {
  return (
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

          <p className="text-sm text-gray-500 w-full text-left">
            Numéro confirmé: {phone}
          </p>

          <Buttons
            onClick={handleSubmit}
            className={`w-full py-5 border-2 shadow-sm ${isPasswordStepValid
              ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
              : "bg-gray-300 border-gray-300 text-gray-600"
              }`}
            disabled={!isPasswordStepValid || isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Buttons>

          <Buttons
            onClick={() => {
              setStep("phone");
              setPassword("");
              setError("");
            }}
            className="w-full py-5 border-2 shadow-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Modifier le numéro
          </Buttons>
        </div>
      </main>
    </div>
  );
};

