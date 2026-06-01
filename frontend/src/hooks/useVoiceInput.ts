'use client';
import { useCallback, useRef, useState } from 'react';
import { useTranslatorStore } from '@/store/translatorStore';

export type VoiceState = 'idle' | 'listening' | 'unsupported';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSR(): (new () => any) | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceInput() {
  const { setInputText } = useTranslatorStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>(() =>
    getSR() ? 'idle' : 'unsupported'
  );

  const startListening = useCallback(() => {
    const SR = getSR();
    if (!SR) { setVoiceState('unsupported'); return; }

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setVoiceState('listening');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(event.results as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript as string)
        .join(' ')
        .trim();
      setInputText(transcript);
    };

    recognition.onerror = () => setVoiceState('idle');
    recognition.onend = () => setVoiceState('idle');
    recognition.start();
  }, [setInputText]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState('idle');
  }, []);

  const toggle = useCallback(() => {
    if (voiceState === 'listening') stopListening();
    else startListening();
  }, [voiceState, startListening, stopListening]);

  return { voiceState, toggle };
}
