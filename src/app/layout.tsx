import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '../styles/animations.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Manounous - Plateforme de mise en relation",
//   description: "Plateforme de mise en relation entre employeurs et chercheurs d'emploi",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-300">{children}</body>
    </html>
  );
}
