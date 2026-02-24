"use client";
import React from "react";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function Buttons({
  onClick,
  children,
  className,
  disabled,
}: ButtonProps) {
  if (!onClick) {
    console.error("onClick handler is required");
    return null;
  }

  return (
    <button
      className={`bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 rounded ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
