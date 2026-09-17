import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Providers } from "@/context/providers";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Kasa",
    template: "%s — Kasa",
  },
  description: "Location d’hébergements entre particuliers",
  openGraph: {
    siteName: "Kasa",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <div className="mx-auto flex min-h-full w-full max-w-360 flex-1 flex-col items-center gap-10 pt-0 lg:pt-10">
            <Header />
            {/* `px-4` aussi dès `lg` : sinon entre ~1024px et max-w contenu (~1115px) plus aucune gouttière. */}
            <div className="flex w-full flex-1 flex-col px-4">
              {children}
            </div>
            <div className="mt-auto w-full">
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
