"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../components/Logo";
import Header from "../../components/header";
import Loyout from "../layout";
import Input from "@/components/ui/forms/Input";
import Buttons from "@/components/ui/buttons/buttons";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  otp: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
  general?: string;
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    otp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validations per step
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Adresse email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.otp || form.otp.length !== 5) {
      newErrors.otp = "Le code doit contenir 5 chiffres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.password || form.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Au moins une majuscule, une minuscule et un chiffre";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep(2);
      } else {
        setErrors({ general: data.message || "Erreur lors de l'envoi du code" });
      }
    } catch {
      setErrors({ general: "Erreur réseau, veuillez réessayer" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep(3);
      } else {
        setErrors({ general: data.message || "Code invalide" });
      }
    } catch {
      setErrors({ general: "Erreur réseau, veuillez réessayer" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep3()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          otp: form.otp,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/login?registered=true");
      } else {
        setErrors({ general: data.message || "Erreur lors de l'inscription" });
      }
    } catch {
      setErrors({ general: "Erreur réseau, veuillez réessayer" });
    } finally {
      setIsLoading(false);
    }
  };

  // Content renderers for each step
  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col items-center w-full">
        <h3 className="text-3xl font-bold">Créer un compte</h3>
        <p className="text-lg text-center my-2 text-gray-600">
          Rejoignez la plateforme Manounou
        </p>
      </div>

      <div className="flex flex-row gap-3 w-full">
        <div className="flex flex-col w-full">
          <Input
            Placeholder="Prénom"
            className="w-full"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange("firstName")}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col w-full">
          <Input
            Placeholder="Nom"
            className="w-full"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange("lastName")}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <Input
          Placeholder="Adresse email"
          className="w-full"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email}</span>
        )}
      </div>

      <Buttons
        onClick={handleSendOtp}
        className={`w-full py-5 border-2 shadow-sm ${
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            : "bg-gray-300 border-gray-300 text-gray-600"
        }`}
        disabled={isLoading || !form.email}
      >
        {isLoading ? "Envoi en cours..." : "Suivant"}
      </Buttons>

      <div className="w-full py-2 bg-[#575656] text-black rounded-2xl px-3">
        <p className="text-center text-lg text-white">
          Déjà un compte ?{" "}
          <a href="/login" className="underline text-orange-300 hover:text-orange-400">
            Se connecter
          </a>
        </p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col items-center w-full">
        <h3 className="text-3xl font-bold">Vérification Email</h3>
        <p className="text-sm text-center my-2 text-gray-600">
          Un code de validation a été envoyé à <b>{form.email}</b>.
        </p>
      </div>

      <div className="flex flex-col w-full items-center">
        <Input
          Placeholder="Code à 5 chiffres"
          className="w-full text-center text-2xl tracking-[0.5em]"
          type="text"
          maxLength={5}
          name="otp"
          value={form.otp}
          onChange={handleChange("otp")}
          required
          disabled={isLoading}
        />
        {errors.otp && (
          <span className="text-red-500 text-xs mt-1">{errors.otp}</span>
        )}
      </div>

      <div className="flex gap-4 w-full">
        <Buttons
          onClick={() => setStep(1)}
          className="w-1/3 py-5 bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-gray-200"
          disabled={isLoading}
        >
          Retour
        </Buttons>
        <Buttons
          onClick={handleVerifyOtp}
          className={`w-2/3 py-5 border-2 shadow-sm ${
            form.otp.length === 5
              ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
              : "bg-gray-300 border-gray-300 text-gray-600"
          }`}
          disabled={isLoading || form.otp.length !== 5}
        >
          {isLoading ? "Vérification..." : "Suivant"}
        </Buttons>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col items-center w-full">
        <h3 className="text-3xl font-bold">Sécuriser le compte</h3>
        <p className="text-sm text-center my-2 text-gray-600">
          Créez un mot de passe pour {form.email}
        </p>
      </div>

      <div className="flex flex-col w-full">
        <Input
          Placeholder="Mot de passe"
          className="w-full"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange("password")}
          required
          disabled={isLoading}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password}</span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <Input
          Placeholder="Confirmer le mot de passe"
          className="w-full"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          required
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>
        )}
      </div>

      <Buttons
        onClick={handleFinalSubmit}
        className={`w-full py-5 border-2 shadow-sm ${
          form.password.length >= 8 && form.password === form.confirmPassword
            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            : "bg-gray-300 border-gray-300 text-gray-600"
        }`}
        disabled={isLoading || form.password.length < 8 || form.password !== form.confirmPassword}
      >
        {isLoading ? "Création en cours..." : "Valider"}
      </Buttons>
    </motion.div>
  );

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
          <main className="flex flex-col row-start-2 items-center border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl w-full max-w-2xl overflow-hidden min-h-[500px]">
            <div className="flex flex-col gap-6 items-center w-full">
              <div className="flex flex-col items-center w-full">
                <Logo />
              </div>

              {/* Progress Bar Display */}
              <div className="flex w-full justify-center mb-4 gap-2">
                <div className={`h-2 rounded w-8 ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                <div className={`h-2 rounded w-8 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                <div className={`h-2 rounded w-8 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`} />
              </div>

              {errors.general && (
                <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
                  {errors.general}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </AnimatePresence>

            </div>
          </main>
        </div>
      </motion.div>
    </Loyout>
  );
}