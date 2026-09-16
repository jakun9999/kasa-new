import { z } from "zod";

/** Auteur d’un message dans le fil (correspondant ou utilisateur connecté). */
export const MessageAuthorSchema = z.object({
  name: z.string().min(1),
  picture: z.string().nullable().optional(),
});

export type MessageAuthor = z.infer<typeof MessageAuthorSchema>;

/** Un message du fil (`MessagePane`). */
export const PaneMessageSchema = z.object({
  id: z.string().min(1),
  from: z.enum(["correspondent", "me"]),
  /** Clé de jour pour regrouper (ex. `2025-09-03`). */
  dateKey: z.string().min(1),
  /** Libellé affiché (ex. `03 Septembre 2025`). */
  dateLabel: z.string().min(1),
  authorName: z.string().min(1),
  authorPicture: z.string().nullable().optional(),
  /** Heure formatée sans date (ex. `11:04pm`). */
  sentAt: z.string().min(1),
  content: z.string().min(1),
});

export type PaneMessage = z.infer<typeof PaneMessageSchema>;

export const PaneMessagesSchema = z.array(PaneMessageSchema);

/** Ligne de la liste latérale (`MessageList` / `MessageListItem`). */
export const MessageListConversationSchema = z.object({
  id: z.string().min(1),
  correspondentName: z.string().min(1),
  correspondentPicture: z.string().nullable().optional(),
  lastMessagePreview: z.string(),
  lastMessageAt: z.string().min(1),
  hasUnread: z.boolean().optional(),
});

export type MessageListConversation = z.infer<
  typeof MessageListConversationSchema
>;

export const MessageListConversationsSchema = z.array(
  MessageListConversationSchema,
);

/**
 * Conversation complète mock / future API :
 * métadonnées liste + historique de messages.
 */
export const ConversationSchema = z.object({
  id: z.string().min(1),
  correspondentName: z.string().min(1),
  correspondentPicture: z.string().nullable().optional(),
  lastMessagePreview: z.string(),
  lastMessageAt: z.string().min(1),
  hasUnread: z.boolean().optional(),
  messages: PaneMessagesSchema,
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const ConversationsSchema = z.array(ConversationSchema);
