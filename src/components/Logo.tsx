import React from "react";

interface LogoProps {
  className?: string;
}
export default function Logo({className}: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-4 border-gray-200 border-2 border-solid rounded-full p-4 align-center`+className}>
      <svg
        aria-label="v0 logomark"
        height="52"
        role="img"
        viewBox="0 0 145 72"
        width="52"
      >
        <path
          d="M84.7967 0H119.333C133.336 0 144.689 11.3524 144.689 25.3563V58.2927H130.504V25.3563C130.504 25.0189 130.491 24.6839 130.465 24.3519L95.9291 58.2871C96.0455 58.2908 96.1624 58.2927 96.2797 58.2927H130.504V71.6897H96.2797C82.2758 71.6897 70.6117 60.2263 70.6117 46.2224V13.3736H84.7967V46.2224C84.7967 46.8548 84.8459 47.4798 84.9407 48.0926L120.236 13.4109C119.939 13.3862 119.638 13.3736 119.333 13.3736H84.7967V0Z"
          fill="white"
        ></path>
        <path
          d="M49.9128 69.2224L0 13.3677H20.0804L49.3843 46.1601V13.3677H64.3573V63.7088C64.3573 71.3067 54.9755 74.8878 49.9128 69.2224Z"
          fill="white"
        ></path>
      </svg>
    </div>
  );
}
