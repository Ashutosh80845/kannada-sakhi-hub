import { useState, useEffect } from "react";
import { WordProgress, UserProgress, Scenario } from "@/types/learning";
import { AUTO_NEGOTIATION_WORDS, SCENARIOS } from "@/data/scenarios";

const STORAGE_KEY = "kannada_sakhi_progress";

const createInitialWordProgress = (): WordProgress[] => {
  return AUTO_NEGOTIATION_WORDS.map(word => ({
    ...word,
    masteryLevel: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    pronunciationScore: 0
  }));
};

const createInitialProgress = (): UserProgress => ({
  userId: "user_1",
  totalXP: 0,
  currentStreak: 0,
  wordsLearned: createInitialWordProgress(),
  scenariosCompleted: [],
  badges: [],
  currentScenario: "auto_negotiation"
});

export const useLearningProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress);
  const [scenarios] = useState<Scenario[]>(SCENARIOS);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateWordProgress = (wordId: string, updates: Partial<WordProgress>) => {
    setProgress(prev => ({
      ...prev,
      wordsLearned: prev.wordsLearned.map(word =>
        word.wordId === wordId ? { ...word, ...updates } : word
      )
    }));
  };

  const incrementWordLevel = (wordId: string) => {
    setProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + 10,
      wordsLearned: prev.wordsLearned.map(word =>
        word.wordId === wordId 
          ? { 
              ...word, 
              masteryLevel: Math.min(word.masteryLevel + 1, 7),
              timesCorrect: word.timesCorrect + 1,
              lastPracticed: new Date()
            }
          : word
      )
    }));
  };

  const markWordIncorrect = (wordId: string) => {
    setProgress(prev => ({
      ...prev,
      wordsLearned: prev.wordsLearned.map(word =>
        word.wordId === wordId 
          ? { 
              ...word, 
              timesIncorrect: word.timesIncorrect + 1,
              lastPracticed: new Date()
            }
          : word
      )
    }));
  };

  const updatePronunciationScore = (wordId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      wordsLearned: prev.wordsLearned.map(word =>
        word.wordId === wordId 
          ? { ...word, pronunciationScore: score }
          : word
      )
    }));
  };

  const completeScenario = (scenarioId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + 100,
      scenariosCompleted: [...prev.scenariosCompleted, scenarioId]
    }));
  };

  const getWordProgress = (wordId: string): WordProgress | undefined => {
    return progress.wordsLearned.find(word => word.wordId === wordId);
  };

  const getScenarioProgress = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return { wordsLearned: 0, totalWords: 0, prerequisitesComplete: false };

    const scenarioWords = progress.wordsLearned.filter(word => 
      scenario.prerequisiteWords.includes(word.wordId)
    );
    
    const wordsAtRequiredLevel = scenarioWords.filter(word => word.masteryLevel >= 5);
    
    return {
      wordsLearned: wordsAtRequiredLevel.length,
      totalWords: scenarioWords.length,
      prerequisitesComplete: wordsAtRequiredLevel.length === scenarioWords.length
    };
  };

  const resetProgress = () => {
    setProgress(createInitialProgress());
  };

  return {
    progress,
    scenarios,
    updateWordProgress,
    incrementWordLevel,
    markWordIncorrect,
    updatePronunciationScore,
    completeScenario,
    getWordProgress,
    getScenarioProgress,
    resetProgress
  };
};