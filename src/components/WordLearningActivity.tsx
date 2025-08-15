import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Volume2, CheckCircle, X, RotateCcw } from "lucide-react";
import { WordProgress } from "@/types/learning";
import { cn } from "@/lib/utils";

interface WordLearningActivityProps {
  word: WordProgress;
  onComplete: (correct: boolean) => void;
  onClose: () => void;
}

type ActivityType = "introduction" | "recognition" | "typing" | "pronunciation";

export const WordLearningActivity: React.FC<WordLearningActivityProps> = ({
  word,
  onComplete,
  onClose
}) => {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>("introduction");
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activityProgress, setActivityProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const activities: ActivityType[] = ["introduction", "recognition", "typing"];
  
  useEffect(() => {
    const activityIndex = activities.indexOf(currentActivity);
    setActivityProgress(((activityIndex + 1) / activities.length) * 100);
  }, [currentActivity]);

  const playPronunciation = () => {
    // Simulated pronunciation - in real app would use text-to-speech
    console.log(`Playing pronunciation for: ${word.kannada}`);
  };

  const handleActivityComplete = (correct: boolean) => {
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);
    
    setTimeout(() => {
      const currentIndex = activities.indexOf(currentActivity);
      if (currentIndex < activities.length - 1) {
        setCurrentActivity(activities[currentIndex + 1]);
        setIsCorrect(null);
        setUserAnswer("");
      } else {
        onComplete(correct);
      }
    }, 1500);
  };

  const renderIntroduction = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <h2 className="text-4xl font-bold kannada-text text-primary mb-3">
          {word.kannada}
        </h2>
        <p className="text-xl text-muted-foreground mb-2">
          {word.pronunciation}
        </p>
        <p className="text-lg font-medium">
          {word.english}
        </p>
      </div>
      
      <Button
        onClick={playPronunciation}
        variant="outline"
        className="mb-6"
      >
        <Volume2 className="w-4 h-4 mr-2" />
        Listen to pronunciation
      </Button>
      
      <div className="bg-accent-light p-4 rounded-lg mb-6">
        <p className="text-sm">
          💡 <strong>Cultural Context:</strong> This phrase is essential for auto negotiations in Bangalore. 
          Auto drivers expect this question and will respect you for speaking Kannada!
        </p>
      </div>
      
      <Button onClick={() => handleActivityComplete(true)} className="bg-gradient-primary">
        Got it! Let's practice
      </Button>
    </div>
  );

  const renderRecognition = () => {
    const options = [
      word.english,
      "Where are you going?",
      "Stop here please",
      "Turn left"
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-4">What does this mean?</h3>
          <div className="p-6 bg-primary-light rounded-lg">
            <p className="text-3xl font-bold kannada-text text-primary">
              {word.kannada}
            </p>
            <Button
              variant="ghost"
              onClick={playPronunciation}
              className="mt-2"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleActivityComplete(option === word.english)}
              className={cn(
                "p-4 text-left justify-start",
                isCorrect !== null && option === word.english && "bg-secondary border-secondary",
                isCorrect !== null && option !== word.english && "opacity-50"
              )}
              disabled={isCorrect !== null}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderTyping = () => (
    <div className="py-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-4">Type the Kannada phrase</h3>
        <p className="text-lg text-muted-foreground mb-2">
          English: <strong>{word.english}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Pronunciation: {word.pronunciation}
        </p>
      </div>
      
      <div className="space-y-4">
        <Input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type in Kannada..."
          className="text-lg kannada-text"
          disabled={isCorrect !== null}
        />
        
        <div className="flex gap-2">
          <Button
            onClick={playPronunciation}
            variant="outline"
            className="flex-1"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Hear it again
          </Button>
          
          <Button
            onClick={() => handleActivityComplete(userAnswer.trim() === word.kannada)}
            disabled={!userAnswer.trim()}
            className="flex-1 bg-gradient-primary"
          >
            Check Answer
          </Button>
        </div>
        
        {isCorrect !== null && (
          <div className={cn(
            "p-4 rounded-lg flex items-center gap-2",
            isCorrect ? "bg-secondary-light text-secondary" : "bg-destructive/20 text-destructive"
          )}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Excellent! Perfect spelling!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                <span>Correct answer: {word.kannada}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentActivity = () => {
    switch (currentActivity) {
      case "introduction":
        return renderIntroduction();
      case "recognition":
        return renderRecognition();
      case "typing":
        return renderTyping();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Learning: {word.english}
              <span className="text-sm font-normal text-muted-foreground">
                ({currentActivity})
              </span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={activityProgress} className="mt-2" />
        </CardHeader>
        
        <CardContent>
          {renderCurrentActivity()}
        </CardContent>
      </Card>
    </div>
  );
};