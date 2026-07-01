import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHÉNIX SOLAR ÉNERGIE - Installation Photovoltaïque Tunisie",
  description: "Leader en installation de panneaux photovoltaïques en Tunisie. Solutions solaires pour résidences, industries et agriculture.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/pwa-icon.png",
    apple: "/icons/pwa-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PHÉNIX SOLAR ÉNERGIE",
  },
};

export const viewport: Viewport = {
  themeColor: "#EC6608",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#EC6608" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/pwa-icon.png" />
        <link rel="mask-icon" href="/icons/pwa-icon.png" color="#EC6608" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-light min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <JsonLd />
          <ServiceWorkerRegister />
          <main className="grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
