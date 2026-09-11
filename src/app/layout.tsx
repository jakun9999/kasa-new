import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kasa",
  description: "Location d’hébergements entre particuliers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <div className="flex w-full max-w-360 flex-col gap-10 items-center pt-10 mx-auto px-4 lg:px-0">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
