"use client";
import { useTranslatorStore } from "@/store/translatorStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export function InputPanel() {
  const { inputText, setInputText, status, avatarReady, tokens } =
    useTranslatorStore();
  const { translate } = useTranslation();
  const { voiceState, toggle: toggleVoice } = useVoiceInput();

  const isPlaying = status === "signing";
  const isTranslating = status === "translating";
  const canSubmit =
    !!inputText.trim() && !isPlaying && !isTranslating && avatarReady;

  const handleSubmit = () => {
    if (!canSubmit) return;
    translate(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
      {/* Label */}
      <div className="flex flex-col gap-1">
        <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Input Text
        </label>
      </div>

      {/* Textarea */}
      <textarea
        id="inputText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Type a sentence in English...\ne.g. "Hello my name is Ahmed"`}
        disabled={isPlaying}
        className="input-field h-32 resize-none"
      />

      {/* Buttons */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          id="voiceBtn"
          onClick={toggleVoice}
          disabled={voiceState === "unsupported" || isPlaying}
          className={`rounded-[var(--radius-lg)] px-4 py-3 text-sm font-semibold border transition-all duration-300 ${
            voiceState === "listening"
              ? "border-[var(--accent)] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--shadow-lg)]"
              : "border-[var(--border-light)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--card-hover)]"
          } ${voiceState === "unsupported" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-0.5"}`}
        >
          {voiceState === "listening"
            ? "🎙️ Listening..."
            : voiceState === "unsupported"
              ? "🎙️ Unsupported"
              : "🎙️ Use Mic"}
        </button>

        <button
          id="translateBtn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`rounded-[var(--radius-lg)] px-4 py-3 text-sm font-semibold text-white border transition-all duration-300 ${
            canSubmit
              ? "border-[var(--primary)] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] cursor-pointer"
              : "border-[var(--border)] bg-[rgba(99,102,241,0.2)] cursor-not-allowed"
          }`}
        >
          {isTranslating
            ? "⏳ Translating..."
            : isPlaying
              ? "🤟 Signing..."
              : "🤟 Translate"}
        </button>
      </div>

      {/* Info Messages */}
      {!avatarReady && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[rgba(99,102,241,0.1)] px-4 py-3 text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
          ⏳ Loading 3D avatar model...
        </div>
      )}

      <div className="rounded-[var(--radius-lg)] border border-[var(--accent)] bg-[rgba(6,182,212,0.1)] px-4 py-3 text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
        💡 Common phrases are normalized into PSL gloss. Unknown words are
        fingerspelled.
      </div>
    </section>
  );
}
