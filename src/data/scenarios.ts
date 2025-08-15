import { Scenario, WordProgress } from "@/types/learning";

export const AUTO_NEGOTIATION_WORDS: Omit<WordProgress, 'masteryLevel' | 'timesCorrect' | 'timesIncorrect' | 'pronunciationScore'>[] = [
  {
    wordId: "price_inquiry",
    english: "How much?",
    kannada: "ಎಷ್ಟು ಆಗುತ್ತೆ?",
    pronunciation: "Eshtu aagutte?"
  },
  {
    wordId: "too_expensive",
    english: "Too expensive",
    kannada: "ಹೆಚ್ಚು ಆಗಿದೆ",
    pronunciation: "Hecchu aagide"
  },
  {
    wordId: "reduce_please",
    english: "Reduce please",
    kannada: "ಕಡಿಮೆ ಮಾಡಿ",
    pronunciation: "Kadime maadi"
  },
  {
    wordId: "okay_agreed",
    english: "Okay",
    kannada: "ಸರಿ",
    pronunciation: "Sari"
  },
  {
    wordId: "forum_to_koramangala",
    english: "Forum Mall to Koramangala",
    kannada: "ಫೋರಂ ಮಾಲ್‌ನಿಂದ ಕೊರಮಂಗಲಕ್ಕೆ",
    pronunciation: "Forum mall nindu Koramangalakke"
  },
  {
    wordId: "meter_please",
    english: "By meter please",
    kannada: "ಮೀಟರ್ ಇಟ್ಟು ಹೋಗಿ",
    pronunciation: "Meter ittu hogi"
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: "auto_negotiation",
    title: "Auto Negotiation",
    description: "Learn to negotiate auto rickshaw fares in Koramangala traffic",
    location: "Koramangala, Bangalore",
    difficulty: "beginner",
    prerequisiteWords: ["price_inquiry", "too_expensive", "reduce_please", "okay_agreed", "forum_to_koramangala"],
    estimatedTime: 25,
    unlocked: true,
    completed: false
  },
  {
    id: "restaurant_ordering",
    title: "Restaurant Ordering",
    description: "Order food confidently at local Bangalore restaurants",
    location: "Brigade Road, Bangalore", 
    difficulty: "beginner",
    prerequisiteWords: [],
    estimatedTime: 30,
    unlocked: false,
    completed: false
  },
  {
    id: "market_shopping",
    title: "Market Shopping",
    description: "Bargain like a local at Russell Market",
    location: "Russell Market, Bangalore",
    difficulty: "intermediate", 
    prerequisiteWords: [],
    estimatedTime: 35,
    unlocked: false,
    completed: false
  }
];