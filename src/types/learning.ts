export interface WordProgress {
  wordId: string;
  english: string;
  kannada: string;
  pronunciation: string;
  masteryLevel: number; // 0-7
  lastPracticed?: Date;
  timesCorrect: number;
  timesIncorrect: number;
  pronunciationScore: number; // 0-100
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisiteWords: string[];
  estimatedTime: number; // minutes
  unlocked: boolean;
  completed: boolean;
  completionScore?: number;
}

export interface LearningActivity {
  id: string;
  type: "flashcard" | "pronunciation" | "multiple_choice" | "conversation" | "scenario";
  wordId?: string;
  scenarioId?: string;
  content: any;
  xpReward: number;
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  currentStreak: number;
  wordsLearned: WordProgress[];
  scenariosCompleted: string[];
  badges: string[];
  currentScenario?: string;
}

export const MASTERY_LEVELS = {
  0: "unknown",
  1: "introduced", 
  2: "recognized",
  3: "recalled",
  4: "pronounced",
  5: "contextualized",
  6: "applied",
  7: "mastered"
} as const;

export const MASTERY_COLORS = {
  0: "gray",
  1: "gray", 
  2: "blue",
  3: "blue",
  4: "green",
  5: "green",
  6: "gold",
  7: "purple"
} as const;