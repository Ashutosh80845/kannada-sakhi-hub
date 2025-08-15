import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Volume2, CheckCircle, Play } from "lucide-react";
import { WordProgress, MASTERY_LEVELS, MASTERY_COLORS } from "@/types/learning";
import { cn } from "@/lib/utils";

interface WordCardProps {
  word: WordProgress;
  onPractice: (wordId: string) => void;
  onPronounce: (wordId: string) => void;
  showMeaning?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPractice,
  onPronounce,
  showMeaning = false
}) => {
  const [isFlipped, setIsFlipped] = useState(showMeaning);
  const masteryPercent = (word.masteryLevel / 7) * 100;
  const colorVariant = MASTERY_COLORS[word.masteryLevel as keyof typeof MASTERY_COLORS];

  const handleCardClick = () => {
    if (!showMeaning) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-warm",
        "bg-gradient-card border-border/50",
        word.masteryLevel >= 6 && "glow-primary"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <ProgressRing 
            progress={masteryPercent}
            size={50}
            variant={colorVariant}
          >
            <span className="text-xs font-semibold">
              {word.masteryLevel}
            </span>
          </ProgressRing>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {MASTERY_LEVELS[word.masteryLevel as keyof typeof MASTERY_LEVELS]}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {word.timesCorrect > 0 && `${Math.round((word.timesCorrect / (word.timesCorrect + word.timesIncorrect)) * 100)}% accuracy`}
            </p>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-500",
          !showMeaning && isFlipped && "card-flip"
        )}>
          {!isFlipped ? (
            <div className="text-center py-4">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {word.english}
              </h3>
              <p className="text-sm text-muted-foreground">
                Tap to reveal
              </p>
            </div>
          ) : (
            <div className="text-center py-2">
              <h3 className="text-3xl font-bold kannada-text text-primary mb-2">
                {word.kannada}
              </h3>
              <p className="text-lg text-muted-foreground mb-2">
                {word.pronunciation}
              </p>
              <p className="text-sm text-foreground font-medium">
                {word.english}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPronounce(word.wordId);
            }}
            className="flex-1"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
          
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPractice(word.wordId);
            }}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" />
            Practice
          </Button>
        </div>

        {word.masteryLevel >= 7 && (
          <div className="flex items-center justify-center mt-3 text-progress-purple">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold">Mastered!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};