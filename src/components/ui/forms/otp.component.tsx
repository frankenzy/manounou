"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Input from "./Input";

interface OtpComponentProps {
  number?: number;
  length?: number;
  onChange?: (value: string, isValid: boolean) => void;
  onComplete?: (value: string) => void;
}

export default function OtpComponent({
  number,
  length,
  onChange,
  onComplete,
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
      <div className="flex items-center gap-2 sm:gap-3">
        {Array.from({ length: otpLength }).map((_, index) => (
          <motion.div
            key={`otp-field-${index}`}
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}
            whileFocus={{ scale: 1.02 }}
            className="w-12 sm:w-14"
          >
            <Input
              type="text"
              name="otp-digit"
              value={digits[index]}
              onChange={(event) => updateDigits(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) {
                  focusField(index - 1);
                  return;
                }
                if (event.key === "ArrowLeft" && index > 0) {
                  event.preventDefault();
                  focusField(index - 1);
                  return;
                }
                if (event.key === "ArrowRight" && index < otpLength - 1) {
                  event.preventDefault();
                  focusField(index + 1);
                }
              }}
              required={true}
              className="h-12 w-full p-0 text-center text-xl tracking-widest"
            />
          </motion.div>
        ))}
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