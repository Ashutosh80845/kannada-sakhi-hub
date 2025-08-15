import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import { Scenario } from "@/types/learning";
import { cn } from "@/lib/utils";

interface ScenarioCardProps {
  scenario: Scenario;
  onStart: (scenarioId: string) => void;
  prerequisitesComplete: boolean;
  wordsLearned: number;
  totalWords: number;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onStart,
  prerequisitesComplete,
  wordsLearned,
  totalWords
}) => {
  const progressPercent = totalWords > 0 ? (wordsLearned / totalWords) * 100 : 0;
  const canStart = scenario.unlocked && prerequisitesComplete;

  const difficultyColors = {
    beginner: "bg-secondary/20 text-secondary border-secondary/30",
    intermediate: "bg-primary/20 text-primary border-primary/30", 
    advanced: "bg-destructive/20 text-destructive border-destructive/30"
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-warm",
      "bg-gradient-card border-border/50",
      !scenario.unlocked && "opacity-60",
      scenario.completed && "glow-primary border-secondary/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              {scenario.title}
              {scenario.completed && (
                <CheckCircle className="w-5 h-5 text-secondary" />
              )}
              {!scenario.unlocked && (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </CardTitle>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {scenario.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {scenario.estimatedTime}m
              </div>
            </div>
          </div>
          
          <Badge className={difficultyColors[scenario.difficulty]}>
            {scenario.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {scenario.description}
        </p>

        {/* Vocabulary Prerequisites */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Vocabulary Progress</span>
            <span className="font-medium">{wordsLearned}/{totalWords} words</span>
          </div>
          
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          {!prerequisitesComplete && (
            <p className="text-xs text-muted-foreground mt-2">
              Complete vocabulary to unlock scenario practice
            </p>
          )}
        </div>

        <Button 
          onClick={() => onStart(scenario.id)}
          disabled={!canStart}
          className={cn(
            "w-full",
            canStart 
              ? "bg-gradient-primary hover:opacity-90" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {scenario.completed ? "Practice Again" : 
           canStart ? "Start Scenario" : 
           !scenario.unlocked ? "Locked" : "Complete Vocabulary First"}
        </Button>
      </CardContent>
    </Card>
  );
};