import {
  ConversationsSchema,
  MessageAuthorSchema,
  MessageListConversationsSchema,
  PaneMessagesSchema,
  type Conversation,
  type MessageAuthor,
  type MessageListConversation,
  type PaneMessage,
} from "@/schemas/messages-schema";

/** Profil « moi » pour les bulles `MessageMe` (pas d’API). */
export const MOCK_CURRENT_USER: MessageAuthor = MessageAuthorSchema.parse({
  name: "Matthieu",
  picture: null,
});

/**
 * 5 conversations fictives pour la messagerie (sprint 1 / démo).
 * Aucun appel backend : brancher `MOCK_CONVERSATIONS` dans la page Messages.
 * Validées au chargement du module via `ConversationsSchema`.
 */
const MOCK_CONVERSATIONS_RAW: Conversation[] = [
  {
    id: "conv-nathalie",
    correspondentName: "Nathalie Jean",
    correspondentPicture: null,
    lastMessagePreview:
      "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
    lastMessageAt: "11:04 am",
    hasUnread: true,
    messages: [
      {
        id: "msg-n-1",
        from: "correspondent",
        dateKey: "2025-09-02",
        dateLabel: "02 Septembre 2025",
        authorName: "Nathalie Jean",
        authorPicture: null,
        sentAt: "09:12am",
        content:
          "Bonjour ! Je suis intéressée par votre logement près du canal.",
      },
      {
        id: "msg-n-2",
        from: "correspondent",
        dateKey: "2025-09-02",
        dateLabel: "02 Septembre 2025",
        authorName: "Nathalie Jean",
        authorPicture: null,
        sentAt: "09:14am",
        content: "Est-ce qu’il y a un parking à proximité ?",
      },
      {
        id: "msg-n-3",
        from: "me",
        dateKey: "2025-09-02",
        dateLabel: "02 Septembre 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "10:02am",
        content:
          "Bonjour Nathalie, oui il y a un parking public à 3 minutes à pied.",
      },
      {
        id: "msg-n-4",
        from: "correspondent",
        dateKey: "2025-09-03",
        dateLabel: "03 Septembre 2025",
        authorName: "Nathalie Jean",
        authorPicture: null,
        sentAt: "11:04am",
        content:
          "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      },
      {
        id: "msg-n-5",
        from: "me",
        dateKey: "2025-09-03",
        dateLabel: "03 Septembre 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "11:20am",
        content:
          "Oui, ces dates sont encore libres. Souhaitez-vous que je bloque le logement ?",
      },
    ],
  },
  {
    id: "conv-lucas",
    correspondentName: "Lucas Bernard",
    correspondentPicture: null,
    lastMessagePreview: "Parfait, à vendredi alors !",
    lastMessageAt: "4:22 pm",
    hasUnread: true,
    messages: [
      {
        id: "msg-l-1",
        from: "me",
        dateKey: "2025-09-01",
        dateLabel: "01 Septembre 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "2:05pm",
        content:
          "Bonjour Lucas, la remise des clés se fait à 16h à l’entrée de l’immeuble.",
      },
      {
        id: "msg-l-2",
        from: "correspondent",
        dateKey: "2025-09-01",
        dateLabel: "01 Septembre 2025",
        authorName: "Lucas Bernard",
        authorPicture: null,
        sentAt: "2:40pm",
        content: "Merci, mon train arrive vers 15h30. Je serai ponctuel.",
      },
      {
        id: "msg-l-3",
        from: "correspondent",
        dateKey: "2025-09-04",
        dateLabel: "04 Septembre 2025",
        authorName: "Lucas Bernard",
        authorPicture: null,
        sentAt: "4:22pm",
        content: "Parfait, à vendredi alors !",
      },
    ],
  },
  {
    id: "conv-amina",
    correspondentName: "Amina Traoré",
    correspondentPicture: null,
    lastMessagePreview: "Le wifi est inclus dans le prix, c’est bien ça ?",
    lastMessageAt: "8:47 am",
    hasUnread: false,
    messages: [
      {
        id: "msg-a-1",
        from: "correspondent",
        dateKey: "2025-08-28",
        dateLabel: "28 Août 2025",
        authorName: "Amina Traoré",
        authorPicture: null,
        sentAt: "7:15pm",
        content: "Bonsoir, le loft est-il adapté pour 2 personnes ?",
      },
      {
        id: "msg-a-2",
        from: "me",
        dateKey: "2025-08-28",
        dateLabel: "28 Août 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "8:01pm",
        content: "Oui, lit queen size et canapé convertible si besoin.",
      },
      {
        id: "msg-a-3",
        from: "correspondent",
        dateKey: "2025-09-05",
        dateLabel: "05 Septembre 2025",
        authorName: "Amina Traoré",
        authorPicture: null,
        sentAt: "8:47am",
        content: "Le wifi est inclus dans le prix, c’est bien ça ?",
      },
      {
        id: "msg-a-4",
        from: "me",
        dateKey: "2025-09-05",
        dateLabel: "05 Septembre 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "9:10am",
        content: "Oui, fibre et mot de passe affiché dans le livret d’accueil.",
      },
    ],
  },
  {
    id: "conv-hugo",
    correspondentName: "Hugo Moreau",
    correspondentPicture: null,
    lastMessagePreview: "Je vous envoie mon IBAN pour l’acompte.",
    lastMessageAt: "1:05 pm",
    hasUnread: true,
    messages: [
      {
        id: "msg-h-1",
        from: "correspondent",
        dateKey: "2025-09-03",
        dateLabel: "03 Septembre 2025",
        authorName: "Hugo Moreau",
        authorPicture: null,
        sentAt: "12:30pm",
        content: "Bonjour, je confirme la réservation pour 3 nuits en octobre.",
      },
      {
        id: "msg-h-2",
        from: "me",
        dateKey: "2025-09-03",
        dateLabel: "03 Septembre 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "12:48pm",
        content: "Super. Un acompte de 30 % suffit pour valider.",
      },
      {
        id: "msg-h-3",
        from: "correspondent",
        dateKey: "2025-09-03",
        dateLabel: "03 Septembre 2025",
        authorName: "Hugo Moreau",
        authorPicture: null,
        sentAt: "1:05pm",
        content: "Je vous envoie mon IBAN pour l’acompte.",
      },
    ],
  },
  {
    id: "conv-claire",
    correspondentName: "Claire Dupont",
    correspondentPicture: null,
    lastMessagePreview: "Merci pour votre réponse, bonne journée !",
    lastMessageAt: "6:18 pm",
    hasUnread: false,
    messages: [
      {
        id: "msg-c-1",
        from: "correspondent",
        dateKey: "2025-08-20",
        dateLabel: "20 Août 2025",
        authorName: "Claire Dupont",
        authorPicture: null,
        sentAt: "3:02pm",
        content: "Bonjour, acceptez-vous les animaux de compagnie ?",
      },
      {
        id: "msg-c-2",
        from: "me",
        dateKey: "2025-08-20",
        dateLabel: "20 Août 2025",
        authorName: MOCK_CURRENT_USER.name,
        authorPicture: MOCK_CURRENT_USER.picture,
        sentAt: "4:40pm",
        content:
          "Oui, chiens de petite taille uniquement, avec un supplément de 15 €.",
      },
      {
        id: "msg-c-3",
        from: "correspondent",
        dateKey: "2025-08-21",
        dateLabel: "21 Août 2025",
        authorName: "Claire Dupont",
        authorPicture: null,
        sentAt: "6:18pm",
        content: "Merci pour votre réponse, bonne journée !",
      },
    ],
  },
];

export const MOCK_CONVERSATIONS: Conversation[] =
  ConversationsSchema.parse(MOCK_CONVERSATIONS_RAW);

/** Liste latérale : champs attendus par `MessageList`. */
export function getMockConversationList(): MessageListConversation[] {
  return MessageListConversationsSchema.parse(
    MOCK_CONVERSATIONS.map(
      ({
        id,
        correspondentName,
        correspondentPicture,
        lastMessagePreview,
        lastMessageAt,
        hasUnread,
      }) => ({
        id,
        correspondentName,
        correspondentPicture,
        lastMessagePreview,
        lastMessageAt,
        hasUnread,
      }),
    ),
  );
}

/** Fil d’une conversation, ou `undefined` si l’id est inconnu. */
export function getMockConversationMessages(
  conversationId: string,
): PaneMessage[] | undefined {
  const messages = MOCK_CONVERSATIONS.find(
    (c) => c.id === conversationId,
  )?.messages;
  return messages === undefined
    ? undefined
    : PaneMessagesSchema.parse(messages);
}

/** Première conversation (sélection par défaut côté UI). */
export const MOCK_DEFAULT_CONVERSATION_ID = MOCK_CONVERSATIONS[0]?.id ?? null;

export type { Conversation as MockConversation };
