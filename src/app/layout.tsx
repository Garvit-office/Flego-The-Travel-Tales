import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TravelProvider } from "@/context/TravelContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/common/Navbar";
import AuthModal from "@/components/auth/AuthModal";
import CreateTripModal from "@/components/trips/CreateTripModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flego — Esparrow",
  description:
    "Find travel companions and host trips with the Flego community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        <ToastProvider>
          <AuthProvider>
            <TravelProvider>
              <Navbar />
              {children}
              <AuthModal />
              <CreateTripModal />
            </TravelProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}