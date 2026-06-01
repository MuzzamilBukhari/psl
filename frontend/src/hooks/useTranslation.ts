'use client';
import { useCallback, useRef } from 'react';
import { useTranslatorStore } from '@/store/translatorStore';
import { api } from '@/lib/api';

export function useTranslation() {
  const { setTranslation, setStatus, signs, inputText } = useTranslatorStore();
  const abortRef = useRef<AbortController | null>(null);

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setStatus('translating');
      try {
        const result = await api.translate(text);
        setTranslation(result.tokens, result.mode, result.notes, result.fingerspelled_count);
        setStatus('idle');
        return result;
      } catch (err) {
        setStatus('error');
        console.error('[useTranslation]', err);
      }
    },
    [setTranslation, setStatus]
  );

  return { translate };
}
