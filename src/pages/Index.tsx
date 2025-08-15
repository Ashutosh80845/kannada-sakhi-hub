import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, Trophy, Star, Zap, Settings } from "lucide-react";
import { WordCard } from "@/components/WordCard";
import { ScenarioCard } from "@/components/ScenarioCard";
import { KavyaAI } from "@/components/KavyaAI";
import { WordLearningActivity } from "@/components/WordLearningActivity";
import { AudioSettings } from "@/components/AudioSettings";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const {
    progress,
    scenarios,
    incrementWordLevel,
    markWordIncorrect,
    getWordProgress,
    getScenarioProgress
  } = useLearningProgress();

  const [learningWord, setLearningWord] = useState<string | null>(null);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('Aria');
  
  const { speak, isPlaying } = useTextToSpeech({ 
    apiKey: elevenLabsApiKey, 
    voiceId: selectedVoice 
  });

  const currentScenario = scenarios.find(s => s.id === progress.currentScenario);
  const scenarioWords = currentScenario 
    ? progress.wordsLearned.filter(word => 
        currentScenario.prerequisiteWords.includes(word.wordId)
      )
    : [];

  const handleWordPractice = (wordId: string) => {
    setLearningWord(wordId);
  };

  const handleWordComplete = (correct: boolean) => {
    if (learningWord) {
      if (correct) {
        incrementWordLevel(learningWord);
        toast({
          title: "Great job! 🎉",
          description: "Word mastery increased!"
        });
      } else {
        markWordIncorrect(learningWord);
      }
    }
    setLearningWord(null);
  };

  const handlePronunciation = (wordId: string) => {
    const word = getWordProgress(wordId);
    if (word) {
      speak(word.kannada);
    }
  };

  const handleScenarioStart = (scenarioId: string) => {
    toast({
      title: "Scenario starting soon! 🚗",
      description: "Real scenario practice coming in the next update!"
    });
  };

  const scenarioProgress = currentScenario ? getScenarioProgress(currentScenario.id) : null;
  const overallProgress = scenarioWords.length > 0 
    ? (scenarioWords.filter(w => w.masteryLevel >= 5).length / scenarioWords.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                ಕನ್ನಡ ಸಖಿ
              </h1>
              <p className="text-muted-foreground mt-1">
                Learn Kannada through real Bangalore scenarios
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-bold">{progress.totalXP} XP</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {progress.currentStreak} day streak
                </div>
              </div>
              
              <Badge variant="secondary" className="gap-1">
                <Trophy className="w-3 h-3" />
                Beginner
              </Badge>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Auto Negotiation Progress</span>
              <span className="font-medium">{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vocabulary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vocabulary" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2">
              <Target className="w-4 h-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <Star className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Audio
            </TabsTrigger>
          </TabsList>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary" className="space-y-6">
            <Card className="bg-gradient-warm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚗 Auto Negotiation Vocabulary
                  <Badge variant="outline">Essential Phrases</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Master these key phrases to confidently negotiate auto rickshaw fares in Bangalore traffic.
                  Each word builds your mastery level through progressive practice.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scenarioWords.map((word) => (
                    <WordCard
                      key={word.wordId}
                      word={word}
                      onPractice={handleWordPractice}
                      onPronounce={handlePronunciation}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => {
                const progress = getScenarioProgress(scenario.id);
                return (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onStart={handleScenarioStart}
                    prerequisitesComplete={progress.prerequisitesComplete}
                    wordsLearned={progress.wordsLearned}
                    totalWords={progress.totalWords}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total XP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {progress.totalXP}
                  </div>
                  <p className="text-sm text-muted-foreground">Experience Points</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Words Mastered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {progress.wordsLearned.filter(w => w.masteryLevel >= 7).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Level 7 Achievement</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {progress.currentStreak}
                  </div>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.wordsLearned.map((word) => (
                    <div key={word.wordId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{word.english}</p>
                        <p className="text-sm text-muted-foreground kannada-text">{word.kannada}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={word.masteryLevel >= 7 ? "default" : "secondary"}>
                          Level {word.masteryLevel}
                        </Badge>
                        {word.timesCorrect > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round((word.timesCorrect / (word.timesCorrect + word.timesIncorrect)) * 100)}% accuracy
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <AudioSettings
              apiKey={elevenLabsApiKey}
              voiceId={selectedVoice}
              onApiKeyChange={setElevenLabsApiKey}
              onVoiceChange={setSelectedVoice}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Learning Activity Modal */}
      {learningWord && (
        <WordLearningActivity
          word={getWordProgress(learningWord)!}
          onComplete={handleWordComplete}
          onClose={() => setLearningWord(null)}
        />
      )}

      {/* AI Companion */}
      <KavyaAI
        currentScenario={progress.currentScenario}
        userProgress={overallProgress}
      />
    </div>
  );
};

export default Index;
