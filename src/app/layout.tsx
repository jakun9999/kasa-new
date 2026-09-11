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
        <div className="mx-auto flex min-h-full w-full max-w-360 flex-1 flex-col items-center gap-10 pt-10 lg:px-0">
          <Header />
          <div className="flex flex-col px-4 lg:px-0 w-full">{children}</div>
          <div className="mt-auto w-full">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
