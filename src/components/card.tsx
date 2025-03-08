"use client";
import React from "react";


export default function Card ({children}: CardProps) {
    return (
        <div className="bg-white dark:bg-black/[.06] border border-solid border-black/[.08] dark:border-white/[.145] rounded-lg p-4 sm:p-6">
            {children}
        </div>
    );
}

type CardProps = {
    children: React.ReactNode;
};