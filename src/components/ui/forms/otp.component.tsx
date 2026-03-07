"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Input from "./Input";
import Logo from "@/components/Logo";
import Buttons from "../buttons/buttons";

interface OtpComponentProps {
  number?: number;
  length?: number;
  onChange?: (value: string, isValid: boolean) => void;
  onComplete?: (value: string) => void;
  onBack?: () => void;
}

export default function OtpComponent({
  number,
  length,
  onChange,
  onComplete,
  onBack,
}: OtpComponentProps) {
  const otpLength = Math.max(1, Math.floor(length ?? number ?? 4));
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: otpLength }, () => "")
  );

  useEffect(() => {
    setDigits((previousDigits) => {
      const nextDigits = Array.from({ length: otpLength }, (_, index) => {
        return previousDigits[index] ?? "";
      });
      return nextDigits;
    });
  }, [otpLength]);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const isOTPStepValid =
    otpValue.length === otpLength && /^\d+$/.test(otpValue);

  useEffect(() => {
    onChange?.(otpValue, isOTPStepValid);
    if (isOTPStepValid) {
      onComplete?.(otpValue);
    }
  }, [otpValue, isOTPStepValid, onChange, onComplete]);

  const focusField = (index: number) => {
    const fields = document.getElementsByName("otp-digit");
    const nextField = fields[index] as HTMLInputElement | undefined;
    nextField?.focus();
    nextField?.select();
  };

  const updateDigits = (startIndex: number, rawValue: string) => {
    const cleanValue = rawValue.replace(/\D/g, "");
    if (!cleanValue) {
      setDigits((previousDigits) => {
        const nextDigits = [...previousDigits];
        nextDigits[startIndex] = "";
        return nextDigits;
      });
      return;
    }

    setDigits((previousDigits) => {
      const nextDigits = [...previousDigits];
      for (
        let valueOffset = 0;
        valueOffset < cleanValue.length && startIndex + valueOffset < otpLength;
        valueOffset++
      ) {
        nextDigits[startIndex + valueOffset] = cleanValue[valueOffset];
      }
      return nextDigits;
    });

    const nextFocusIndex = Math.min(startIndex + cleanValue.length, otpLength - 1);
    focusField(nextFocusIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col row-start-2 items-center sm:items-start border-gray-200 border-2 border-solid px-20 pt-10 pb-5 rounded-xl">
          <div className="flex flex-col gap-8 items-center content">
            <div className="flex flex-col items-center w-full">
              <Logo />
            </div>

            <div className="flex gap-3">
              {digits.map((digit, index) => (
                <Input
                  key={index}
                  name="otp-digit"
                  type="text"
                  value={digit}
                  onChange={(e) => updateDigits(index, e.target.value)}
                  className="w-16 h-12 text-center text-lg text-black rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 focus:outline-none transition-colors"
                />
              ))}
            </div>
            {/* button de retour */}
            <div className="flex gap-4 w-full">
              <button
                type="button"
                className="w-full mt-4 py-4 px-2 bg-gray-200 text-black rounded-md"
                onClick={onBack}
              >
                Retour
              </button>

              <Buttons
                disabled={!isOTPStepValid}
                onClick={() => onComplete?.(otpValue)}
                className="w-full mt-4 py-4 px-2"
              >
                Vérifier
              </Buttons>


            </div>
          </div>
        </main>
      </div>

      <AnimatePresence mode="wait">
        {!isOTPStepValid && otpValue.length > 0 && (
          <motion.p
            key="otp-error"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500"
          >
            Le code OTP est incomplet.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}