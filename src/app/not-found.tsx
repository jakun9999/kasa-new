import type { Metadata } from "next";
import NotFoundPage from "@/components/ui/not-found/not-found-page";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n'existe pas sur Kaza",
};

export default function NotFound() {
  return <NotFoundPage />;
}
