'use client';
import { useTranslatorStore } from '@/store/translatorStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useVoiceInput } from '@/hooks/useVoiceInput';

export function InputPanel() {
  const { inputText, setInputText, status, avatarReady, tokens } = useTranslatorStore();
  const { translate } = useTranslation();
  const { voiceState, toggle: toggleVoice } = useVoiceInput();

  const isPlaying = status === 'signing';
  const isTranslating = status === 'translating';
  const canSubmit = !!inputText.trim() && !isPlaying && !isTranslating && avatarReady;

  const handleSubmit = () => {
    if (!canSubmit) return;
    translate(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="px-5 py-5 border-b border-[var(--border)]">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">
        Input Text
      </div>

      <textarea
        id="inputText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Type a sentence in English...\ne.g. "Hello my name is Ahmed"`}
        disabled={isPlaying}
        className="w-full h-28 rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(108,92,231,0.15)] disabled:cursor-not-allowed disabled:opacity-60 resize-none"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          id="voiceBtn"
          onClick={toggleVoice}
          disabled={voiceState === 'unsupported' || isPlaying}
          className={
            `rounded-[12px] border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              voiceState === 'listening'
                ? 'border-[var(--accent3)] bg-[linear-gradient(135deg,#0984e3,var(--accent3))] text-white shadow-[0_8px_24px_rgba(0,206,201,0.2)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)]'
            } ${voiceState === 'unsupported' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`
          }
        >
          {voiceState === 'listening'
            ? '🎙️ Listening...'
            : voiceState === 'unsupported'
            ? 'Mic Unsupported'
            : '🎙️ Use Mic'}
        </button>

        <button
          id="translateBtn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`rounded-[12px] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ${
            canSubmit
              ? 'bg-[linear-gradient(135deg,var(--accent),#8b5cf6)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--glow)] cursor-pointer'
              : 'bg-[rgba(108,92,231,0.3)] cursor-not-allowed'
          }`}
        >
          {isTranslating ? '⏳ Translating...' : isPlaying ? '🤟 Signing...' : '🤟 Translate to PSL'}
        </button>
      </div>

      {!avatarReady && (
        <div className="mt-3 rounded-[12px] border border-[rgba(108,92,231,0.2)] bg-[rgba(108,92,231,0.08)] px-4 py-3 text-xs leading-5 text-[var(--text2)]">
          ⏳ Loading 3D avatar...
        </div>
      )}

      <div className="mt-3 rounded-[12px] border border-[rgba(0,206,201,0.18)] bg-[rgba(0,206,201,0.08)] px-4 py-3 text-xs leading-5 text-[var(--text2)]">
        Prototype mode: common phrases are normalized into a PSL-style gloss set. Unknown words are fingerspelled.
      </div>
    </section>
  );
}
