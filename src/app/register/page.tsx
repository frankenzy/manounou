"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Buttons from "../../components/buttons";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import Header from "../../components/header";
import Loyout from "../layout";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.username || form.username.length < 3) {
      newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Lettres, chiffres et _ uniquement";
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Adresse email invalide";
    }
    if (!form.password || form.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Au moins une majuscule, une minuscule et un chiffre";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
        }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (res.ok && data.success) {
        router.push("/manounou");
      } else {
        setErrors({ general: data.message || "Erreur lors de l'inscription" });
      }
    } catch {
      setErrors({ general: "Erreur réseau, veuillez réessayer" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.username.length >= 3 &&
    form.email.includes("@") &&
    form.password.length >= 8;

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
          <main className="flex flex-col row-start-2 items-center border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl w-full max-w-md">
            <div className="flex flex-col gap-6 items-center w-full">
              <div className="flex flex-col items-center w-full">
                <Logo />
              </div>
              <div className="flex flex-col items-center w-full">
                <h3 className="text-3xl font-bold">Créer un compte</h3>
                <p className="text-lg text-center my-2 text-gray-600">
                  Rejoignez la plateforme Manounou
                </p>
              </div>

              {errors.general && (
                <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

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
                  Placeholder="Nom d'utilisateur"
                  className="w-full"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange("username")}
                  required
                  disabled={isLoading}
                />
                {errors.username && (
                  <span className="text-red-500 text-xs mt-1">{errors.username}</span>
                )}
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

              <Buttons
                onClick={handleSubmit}
                className={`w-full py-5 border-2 shadow-sm ${
                  isFormValid
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 border-gray-300 text-gray-600"
                }`}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer mon compte"}
              </Buttons>

              <div className="w-full py-2 bg-[#575656] text-black rounded-2xl px-3">
                <p className="text-center text-lg text-white">
                  Déjà un compte ?{" "}
                  <a href="/login" className="underline text-orange-300 hover:text-orange-400">
                    Se connecter
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </motion.div>
    </Loyout>
  );
}