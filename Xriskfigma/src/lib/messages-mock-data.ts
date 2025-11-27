import { Conversation, Message, RiskDetails } from "../types/message";
import { users } from "./user-mock-data";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    riskId: "R-100002",
    riskTitle: "Wohnungsabsicherung für Geburtstagsparty - 40. Geburtstag mit 25-30 Gästen in Altbauwohnung",
    riskCoverageAmount: 5000,
    partnerId: "u1",
    partnerName: users.u1.displayName,
    partnerAvatar: users.u1.avatar,
    partnerRole: "Risikonehmer",
    myRole: "Risikogeber", // Ich habe das Risiko angelegt, Thomas hat mir ein Angebot gemacht
    lastMessage: "Das Angebot deckt alle Schäden, Ersatz und Verlust/Diebstahl ab. Lass mich wissen, ob das für dich passt!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
    unreadCount: 2,
    riskCategory: "Immobilien",
    riskLevel: 3,
    riskStatus: "in-negotiation",
    currentOffer: {
      offerId: "offer-1",
      premium: 50,
      status: "pending",
      recommendedPriceRange: {
        min: 45,
        max: 65
      }
    }
  },
  {
    id: "conv-2",
    riskId: "R-100009",
    riskTitle: "Kameraausrüstung für Hochzeitsfotografie - Canon EOS R5 mit Profi-Objektiven und Zubehör",
    riskCoverageAmount: 9500,
    partnerId: "u3",
    partnerName: users.u3.displayName,
    partnerAvatar: users.u3.avatar,
    partnerRole: "Risikogeber",
    myRole: "Risikonehmer", // Ich habe ein Angebot für Lisa's Kamera-Risiko abgegeben
    lastMessage: "Perfekt! Ich hole die Ausrüstung am Freitag um 18 Uhr ab.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    riskCategory: "Elektronik",
    riskLevel: 4,
    riskStatus: "active",
    currentOffer: {
      offerId: "offer-2",
      premium: 110,
      status: "accepted",
      recommendedPriceRange: {
        min: 95,
        max: 125
      }
    }
  },
  {
    id: "conv-3",
    riskId: "R-100003",
    riskTitle: "E-Bike Verleih für Wochenendtour - Canyon Pathlite:ON 7 E-Bike im Allgäu",
    riskCoverageAmount: 2800,
    partnerId: "u4",
    partnerName: users.u4.displayName,
    partnerAvatar: users.u4.avatar,
    partnerRole: "Risikogeber",
    myRole: "Risikonehmer", // Ich habe ein Angebot für Stefan's E-Bike abgegeben
    lastMessage: "Das Canyon E-Bike ist top gepflegt. Viel Spaß im Allgäu!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 1,
    riskCategory: "Fahrzeuge",
    riskLevel: 2,
    riskStatus: "in-negotiation",
    currentOffer: {
      offerId: "offer-3",
      premium: 38,
      status: "pending",
      recommendedPriceRange: {
        min: 35,
        max: 45
      }
    }
  },
];

export const mockMessages: { [conversationId: string]: Message[] } = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "u1",
      senderName: users.u1.displayName,
      senderAvatar: users.u1.avatar,
      senderVerified: true,
      content: "Hallo! Ich habe dein Risiko im Marktplatz gesehen und möchte dir ein Angebot machen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isRead: true,
      offerData: {
        offerId: "offer-1",
        riskId: "R-100002",
        riskTitle: "Wohnungsabsicherung für Geburtstagsparty - 40. Geburtstag mit 25-30 Gästen in Altbauwohnung",
        riskCategory: "Immobilien",
        riskLevel: 3,
        coverageAmount: 5000,
        offeredPremium: 50,
        recommendedPriceRange: {
          min: 45,
          max: 65
        },
        coverageTypes: {
          damage: true,
          replacement: true,
          lossOrTheft: true,
        },
        status: "pending",
      },
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "u1",
      senderName: users.u1.displayName,
      senderAvatar: users.u1.avatar,
      senderVerified: true,
      content: "Altbauwohnungen mit hochwertiger Ausstattung - das kenne ich gut. Die Party ist am 23. November?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30),
      isRead: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Genau, am 23. November von 19-03 Uhr. Es werden 25-30 Gäste erwartet.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      isRead: true,
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Dein Angebot sieht gut aus! Lass mich kurz überlegen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
    },
    {
      id: "msg-5",
      conversationId: "conv-1",
      senderId: "u1",
      senderName: users.u1.displayName,
      senderAvatar: users.u1.avatar,
      senderVerified: true,
      content: "Das Angebot deckt alle Schäden, Ersatz und Verlust/Diebstahl ab. Lass mich wissen, ob das für dich passt!",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-7",
      conversationId: "conv-2",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Hallo Lisa! Ich habe deine Canon R5 Profi-Ausrüstung im Marktplatz gesehen und möchte dir gerne ein Angebot machen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isRead: true,
      offerData: {
        offerId: "offer-2",
        riskId: "R-100009",
        riskTitle: "Kameraausrüstung für Hochzeitsfotografie - Canon EOS R5 mit Profi-Objektiven und Zubehör",
        riskCategory: "Elektronik",
        riskLevel: 4,
        coverageAmount: 9500,
        offeredPremium: 110,
        recommendedPriceRange: {
          min: 95,
          max: 125
        },
        coverageTypes: {
          damage: true,
          replacement: true,
          lossOrTheft: true,
        },
        status: "accepted",
      },
    },
    {
      id: "msg-8",
      conversationId: "conv-2",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Als Fotograf kenne ich mich bestens mit Kameraequipment aus und kann das Risiko gut einschätzen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
      isRead: true,
    },
    {
      id: "msg-9",
      conversationId: "conv-2",
      senderId: "u3",
      senderName: users.u3.displayName,
      senderAvatar: users.u3.avatar,
      senderVerified: true,
      content: "Super! Die R5 ist in perfektem Zustand. RF 24-70mm f/2.8, RF 70-200mm f/2.8 und alle Blitze sind dabei.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
      isRead: true,
    },
    {
      id: "msg-10",
      conversationId: "conv-2",
      senderId: "u3",
      senderName: users.u3.displayName,
      senderAvatar: users.u3.avatar,
      senderVerified: true,
      content: "Ich nehme dein Angebot an! 110€ ist fair für die gesamte Ausrüstung.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
    {
      id: "msg-11",
      conversationId: "conv-2",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Perfekt! Ich hole die Ausrüstung am Freitag um 18 Uhr ab.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-12",
      conversationId: "conv-3",
      senderId: "u5",
      senderName: users.u5.displayName,
      senderAvatar: users.u5.avatar,
      senderVerified: true,
      content: "Hi Stefan! Dein Canyon E-Bike-Risiko interessiert mich. Hier ist mein Angebot:",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      isRead: true,
      offerData: {
        offerId: "offer-3",
        riskId: "R-100003",
        riskTitle: "E-Bike Verleih für Wochenendtour - Canyon Pathlite:ON 7 E-Bike im Allgäu",
        riskCategory: "Fahrzeuge",
        riskLevel: 2,
        coverageAmount: 2800,
        offeredPremium: 38,
        recommendedPriceRange: {
          min: 35,
          max: 45
        },
        coverageTypes: {
          damage: true,
          replacement: true,
          lossOrTheft: true,
        },
        status: "pending",
      },
    },
    {
      id: "msg-13",
      conversationId: "conv-3",
      senderId: "u4",
      senderName: users.u4.displayName,
      senderAvatar: users.u4.avatar,
      senderVerified: true,
      content: "Danke für dein Angebot! Das Canyon Pathlite ist erst 1 Jahr alt und absolut top gepflegt.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
      isRead: true,
    },
    {
      id: "msg-14",
      conversationId: "conv-3",
      senderId: "u4",
      senderName: users.u4.displayName,
      senderAvatar: users.u4.avatar,
      senderVerified: true,
      content: "Das Canyon E-Bike ist top gepflegt. Viel Spaß im Allgäu!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: false,
    },
  ],
};

export const mockRiskDetails: { [riskId: string]: RiskDetails } = {
  "R-100002": {
    id: "R-100002",
    title: "Wohnungsabsicherung für Geburtstagsparty - 40. Geburtstag mit 25-30 Gästen in Altbauwohnung",
    category: "Immobilien",
    status: "in-negotiation",
    riskLevel: 3,
    volume: 5000,
    currency: "EUR",
    startDate: new Date(2024, 10, 23),
    endDate: new Date(2024, 10, 23),
    description:
      "Absicherung einer 3-Zimmer Altbauwohnung (85qm, 3. OG) für Geburtstagsfeier mit 25-30 Personen. Wohnung verfügt über Parkettboden im Wohnzimmer (45qm), Designer-Sofa (3.500€), offene Küche mit hochwertigen Geräten, Stuck an Decken und bodentiefe Fenster. Party von 19-03 Uhr. Nichtraucher-Wohnung, keine Haustiere.",
    keyParameters: {
      probability: 15,
      potentialDamage: 5000,
      var: 750,
    },
    parties: {
      riskGiver: {
        id: "u5",
        name: users.u5.displayName,
        share: 100,
      },
      riskTaker: {
        id: "u1",
        name: users.u1.displayName,
        share: 100,
      },
    },
    documents: [
      {
        id: "doc-1",
        name: "Wohnung_Inventarliste.pdf",
        type: "Inventar",
        url: "#",
      },
      {
        id: "doc-2",
        name: "Designer_Sofa_Rechnung.pdf",
        type: "Rechnung",
        url: "#",
      },
    ],
    milestones: [
      {
        id: "m-1",
        title: "Risikobewertung abgeschlossen",
        date: new Date(2024, 10, 26),
        completed: true,
      },
      {
        id: "m-2",
        title: "Vertragsverhandlung",
        date: new Date(2024, 10, 28),
        completed: true,
      },
      {
        id: "m-3",
        title: "Vertragsabschluss",
        date: new Date(2024, 10, 23),
        completed: false,
      },
      {
        id: "m-4",
        title: "Absicherungsende",
        date: new Date(2024, 10, 24),
        completed: false,
      },
    ],
    historicalData: [
      { date: new Date(2024, 10, 26), riskLevel: 3 },
      { date: new Date(2024, 10, 28), riskLevel: 3 },
    ],
  },
  "R-100009": {
    id: "R-100009",
    title: "Kameraausrüstung für Hochzeitsfotografie - Canon EOS R5 mit Profi-Objektiven und Zubehör",
    category: "Elektronik",
    status: "active",
    riskLevel: 4,
    volume: 9500,
    currency: "EUR",
    startDate: new Date(2024, 11, 7),
    endDate: new Date(2024, 11, 8),
    description: "Verleih einer professionellen Kameraausrüstung für Hochzeit. Equipment: Canon EOS R5 (3.800€), RF 24-70mm f/2.8 (2.400€), RF 70-200mm f/2.8 (2.400€), 2x Speedlite Blitz, 6x SD-Karten, 3x Ersatzakkus, Stativ, Kameratasche. Gesamtwert 9.500€. Body-Shutterzahl: 18.000. Alle Objektive ohne Kratzer oder Fungus. Übergabe am Vorabend.",
    keyParameters: {
      probability: 10,
      potentialDamage: 9500,
      var: 950,
    },
    parties: {
      riskGiver: {
        id: "u3",
        name: users.u3.displayName,
        share: 100,
      },
      riskTaker: {
        id: "u5",
        name: users.u5.displayName,
        share: 100,
      },
    },
    documents: [
      {
        id: "doc-3",
        name: "Canon_R5_Kaufbeleg.pdf",
        type: "Rechnung",
        url: "#",
      },
      {
        id: "doc-4",
        name: "RF_Objektive_Rechnung.pdf",
        type: "Rechnung",
        url: "#",
      },
    ],
    milestones: [
      {
        id: "m-5",
        title: "Vertrag aktiv",
        date: new Date(2024, 11, 7),
        completed: true,
      },
      {
        id: "m-6",
        title: "Absicherungsende",
        date: new Date(2024, 11, 8),
        completed: false,
      },
    ],
    historicalData: [
      { date: new Date(2024, 10, 25), riskLevel: 4 },
      { date: new Date(2024, 11, 7), riskLevel: 4 },
    ],
  },
  "R-100003": {
    id: "R-100003",
    title: "E-Bike Verleih für Wochenendtour - Canyon Pathlite:ON 7 E-Bike im Allgäu",
    category: "Fahrzeuge",
    status: "in-negotiation",
    riskLevel: 2,
    volume: 2800,
    currency: "EUR",
    startDate: new Date(2024, 10, 17),
    endDate: new Date(2024, 10, 19),
    description: "Verleih eines Canyon Pathlite:ON 7 E-Bikes, Modelljahr 2023, Neupreis 3.299€, Kilometerstand 1.850km. Ausstattung: Bosch Performance Line Motor, 625Wh Akku, hydraulische Scheibenbremsen. Letzte Inspektion September 2024. Inklusive ABUS Bordo Fahrradschloss. Transport auf Fahrradträger. Keine Unfälle oder Stürze.",
    keyParameters: {
      probability: 8,
      potentialDamage: 2800,
      var: 224,
    },
    parties: {
      riskGiver: {
        id: "u4",
        name: users.u4.displayName,
        share: 100,
      },
      riskTaker: {
        id: "u5",
        name: users.u5.displayName,
        share: 100,
      },
    },
    documents: [
      {
        id: "doc-5",
        name: "Canyon_E-Bike_Kaufvertrag.pdf",
        type: "Rechnung",
        url: "#",
      },
      {
        id: "doc-6",
        name: "Inspektion_September_2024.pdf",
        type: "Wartung",
        url: "#",
      },
    ],
    milestones: [
      {
        id: "m-7",
        title: "Risikobewertung",
        date: new Date(2024, 10, 27),
        completed: true,
      },
      {
        id: "m-8",
        title: "Vertragsabschluss",
        date: new Date(2024, 10, 17),
        completed: false,
      },
      {
        id: "m-9",
        title: "Absicherungsende",
        date: new Date(2024, 10, 19),
        completed: false,
      },
    ],
    historicalData: [
      { date: new Date(2024, 10, 27), riskLevel: 2 },
    ],
  },
};
