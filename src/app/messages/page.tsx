import type { Metadata } from "next";
import { MessagesView } from "@/components/ui/messages/messages-view";

export const metadata: Metadata = {
  title: "Messages — Kasa",
  description: "Vos conversations Kasa",
};

export default function MessagesPage() {
  return <MessagesView />;
}
