import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, HelpCircle, Volume2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface KavyaMessage {
  id: string;
  type: "tip" | "encouragement" | "cultural" | "pronunciation";
  message: string;
  timestamp: Date;
}

interface KavyaAIProps {
  currentWord?: string;
  currentScenario?: string;
  userProgress?: number;
  onHelp?: () => void;
}

export const KavyaAI: React.FC<KavyaAIProps> = ({
  currentWord,
  currentScenario,
  userProgress = 0,
  onHelp
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<KavyaMessage[]>([
    {
      id: "welcome",
      type: "encouragement",
      message: "ನಮಸ್ಕಾರ! I'm Kavya, your Kannada learning companion! Ready to master auto negotiations in Bangalore? 🚗",
      timestamp: new Date()
    }
  ]);

  const getContextualTip = () => {
    if (currentWord === "price_inquiry") {
      return "Remember, 'ಎಷ್ಟು ಆಗುತ್ತೆ?' is your most powerful phrase! Auto drivers expect this question. Practice the soft 'gu' sound in 'ಆಗುತ್ತೆ'. 💪";
    }
    if (currentWord === "too_expensive") {
      return "When saying 'ಹೆಚ್ಚು ಆಗಿದೆ', say it with a gentle smile! Bangalore auto drivers appreciate polite negotiation over aggressive demands. 😊";
    }
    if (currentScenario === "auto_negotiation") {
      return "Pro tip: Evening rush hour means higher prices. If they quote ₹120 for a ₹80 route, start with 'ಹೆಚ್ಚು ಆಗಿದೆ' and see their reaction! 🕐";
    }
    return "You're doing great! Consistent practice is the key to mastering real conversations. Keep it up! 🌟";
  };

  const addContextualMessage = () => {
    const tip = getContextualTip();
    const newMessage: KavyaMessage = {
      id: Date.now().toString(),
      type: "tip",
      message: tip,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const culturalInsights = [
    "Did you know? In Bangalore, saying 'meter ಇಟ್ಟು ಹೋಗಿ' (by meter) often gets you a better deal than negotiating! 📊",
    "Cultural tip: Auto drivers respect passengers who speak a little Kannada. Even basic phrases show you understand local culture! 🙏",
    "Bangalore trick: Mention nearby landmarks instead of exact addresses. 'Forum mall ಬಳಿ' (near Forum mall) works better than street numbers! 🗺️",
    "Fun fact: 'ಸರಿ' (sari) is the most versatile word - it means okay, correct, right, and yes! Master this first! ✨"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-primary shadow-glow hover:scale-110 transition-transform"
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary-light text-primary-foreground text-xs font-bold">
              ಕ
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 max-h-96 bg-gradient-card shadow-warm border-primary/20">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  ಕ
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Kavya AI</h3>
                <p className="text-xs text-muted-foreground">Your Kannada guide</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-lg text-sm",
                  message.type === "encouragement" && "bg-secondary-light border border-secondary/30",
                  message.type === "tip" && "bg-primary-light border border-primary/30",
                  message.type === "cultural" && "bg-accent-light border border-accent/30"
                )}
              >
                {message.message}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addContextualMessage}
              className="flex-1 text-xs"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const randomInsight = culturalInsights[Math.floor(Math.random() * culturalInsights.length)];
                const newMessage: KavyaMessage = {
                  id: Date.now().toString(),
                  type: "cultural",
                  message: randomInsight,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, newMessage]);
              }}
              className="flex-1 text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Culture
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};