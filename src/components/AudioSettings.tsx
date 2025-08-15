import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Volume2, Key } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { toast } from '@/hooks/use-toast';

interface AudioSettingsProps {
  onApiKeyChange: (apiKey: string) => void;
  onVoiceChange: (voiceId: string) => void;
  apiKey?: string;
  voiceId?: string;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  onApiKeyChange,
  onVoiceChange,
  apiKey = '',
  voiceId = 'Aria'
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { speak, isPlaying } = useTextToSpeech({ apiKey, voiceId });

  const handleSaveApiKey = () => {
    onApiKeyChange(tempApiKey);
    toast({
      title: "API Key Saved",
      description: "ElevenLabs API key has been saved for high-quality audio."
    });
  };

  const handleTestAudio = () => {
    speak("ಎಷ್ಟು ಆಗುತ್ತೆ?"); // Test with a Kannada phrase
  };

  // Top ElevenLabs voices for multilingual content
  const voiceOptions = [
    { id: 'Aria', name: 'Aria (Recommended)', description: 'Natural, clear female voice' },
    { id: 'Roger', name: 'Roger', description: 'Professional male voice' },
    { id: 'Sarah', name: 'Sarah', description: 'Warm female voice' },
    { id: 'Brian', name: 'Brian', description: 'Clear male voice' },
    { id: 'Laura', name: 'Laura', description: 'Friendly female voice' }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Audio Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Configuration */}
        <div className="space-y-3">
          <Label htmlFor="elevenlabs-key" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            ElevenLabs API Key (Optional)
          </Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="elevenlabs-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
                size="sm"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
              <Button onClick={handleSaveApiKey} size="sm">
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {apiKey 
                ? "✅ Using ElevenLabs for high-quality audio" 
                : "⚠️ Using browser speech (lower quality). Get your API key from elevenlabs.io"
              }
            </p>
          </div>
        </div>

        {/* Voice Selection */}
        {apiKey && (
          <div className="space-y-3">
            <Label>Voice Selection</Label>
            <Select value={voiceId} onValueChange={onVoiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-xs text-muted-foreground">{voice.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Test Audio */}
        <div className="space-y-3">
          <Label>Test Audio</Label>
          <Button 
            onClick={handleTestAudio} 
            disabled={isPlaying}
            className="w-full"
            variant="outline"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isPlaying ? "Playing..." : "Test Pronunciation"}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">How to get ElevenLabs API Key:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Visit <span className="font-mono">elevenlabs.io</span></li>
            <li>Sign up for a free account</li>
            <li>Go to Profile → API Keys</li>
            <li>Copy your API key and paste it above</li>
          </ol>
          <p className="text-xs mt-2 text-muted-foreground">
            Free tier includes 10,000 characters per month
          </p>
        </div>
      </CardContent>
    </Card>
  );
};