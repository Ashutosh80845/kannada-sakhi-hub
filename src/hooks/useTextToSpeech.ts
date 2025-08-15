import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface TextToSpeechConfig {
  apiKey?: string;
  voiceId?: string;
  speed?: number;
}

export const useTextToSpeech = (config: TextToSpeechConfig = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Browser Web Speech API as fallback
  const speakWithWebAPI = useCallback((text: string, lang = 'kn-IN') => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = config.speed || 0.8;
      
      // Try to find a Kannada or Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const kannadaVoice = voices.find(voice => 
        voice.lang.includes('kn') || 
        voice.lang.includes('hi') || 
        (voice.lang.includes('en') && voice.name.includes('India'))
      );
      
      if (kannadaVoice) {
        utterance.voice = kannadaVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Could not play pronunciation. Please try again.",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive"
      });
    }
  }, [config.speed]);

  // ElevenLabs API function
  const speakWithElevenLabs = useCallback(async (text: string) => {
    if (!config.apiKey) {
      // Fallback to Web Speech API
      speakWithWebAPI(text);
      return;
    }

    try {
      setIsPlaying(true);
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + (config.voiceId || 'Aria'), {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
        // Fallback to Web Speech API
        speakWithWebAPI(text);
      };

      await audio.play();
      
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      setIsPlaying(false);
      // Fallback to Web Speech API
      speakWithWebAPI(text);
    }
  }, [config.apiKey, config.voiceId, currentAudio, speakWithWebAPI]);

  const speak = useCallback((text: string) => {
    // Clean the text for better pronunciation
    const cleanedText = text.replace(/[।]/g, '.').trim();
    
    console.info('Playing pronunciation for:', cleanedText);
    
    toast({
      title: "🔊 Playing pronunciation",
      description: "Listen carefully and repeat!"
    });

    if (config.apiKey) {
      speakWithElevenLabs(cleanedText);
    } else {
      speakWithWebAPI(cleanedText);
    }
  }, [config.apiKey, speakWithElevenLabs, speakWithWebAPI]);

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
  }, [currentAudio]);

  return {
    speak,
    stop,
    isPlaying
  };
};