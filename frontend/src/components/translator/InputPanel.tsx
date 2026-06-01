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
    <div className="panel-section">
      <div className="panel-label">Input Text</div>

      <textarea
        id="inputText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Type a sentence in English...\ne.g. "Hello my name is Ahmed"`}
        disabled={isPlaying}
        style={{
          width: '100%',
          height: 120,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 14,
          color: 'var(--text)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          resize: 'none',
          outline: 'none',
          transition: 'border .2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        {/* Voice Button */}
        <button
          id="voiceBtn"
          onClick={toggleVoice}
          disabled={voiceState === 'unsupported' || isPlaying}
          style={{
            padding: 14,
            borderRadius: 12,
            border: '1px solid',
            borderColor: voiceState === 'listening' ? 'var(--accent3)' : 'var(--border)',
            background:
              voiceState === 'listening'
                ? 'linear-gradient(135deg, #0984e3, var(--accent3))'
                : 'var(--card)',
            color: voiceState === 'listening' ? '#fff' : 'var(--text)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            cursor: voiceState === 'unsupported' ? 'not-allowed' : 'pointer',
            opacity: voiceState === 'unsupported' ? 0.5 : 1,
            boxShadow:
              voiceState === 'listening' ? '0 8px 24px rgba(0, 206, 201, 0.2)' : 'none',
            transition: 'all .2s',
          }}
        >
          {voiceState === 'listening'
            ? '🎙️ Listening...'
            : voiceState === 'unsupported'
            ? 'Mic Unsupported'
            : '🎙️ Use Mic'}
        </button>

        {/* Translate Button */}
        <button
          id="translateBtn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background:
              canSubmit
                ? 'linear-gradient(135deg, var(--accent), #8b5cf6)'
                : 'rgba(108,92,231,0.3)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => {
            if (canSubmit) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px var(--glow)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          {isTranslating ? '⏳ Translating...' : isPlaying ? '🤟 Signing...' : '🤟 Translate to PSL'}
        </button>
      </div>

      {!avatarReady && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 14px',
            background: 'rgba(108,92,231,0.08)',
            border: '1px solid rgba(108,92,231,0.2)',
            borderRadius: 12,
            fontSize: 12,
            color: 'var(--text2)',
          }}
        >
          ⏳ Loading 3D avatar...
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          padding: '12px 14px',
          background: 'rgba(0, 206, 201, 0.08)',
          border: '1px solid rgba(0, 206, 201, 0.18)',
          borderRadius: 12,
          fontSize: 12,
          color: 'var(--text2)',
          lineHeight: 1.5,
        }}
      >
        Prototype mode: common phrases are normalized into a PSL-style gloss set. Unknown
        words are fingerspelled.
      </div>
    </div>
  );
}
