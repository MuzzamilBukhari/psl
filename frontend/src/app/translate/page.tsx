'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslatorStore } from '@/store/translatorStore';
import { api } from '@/lib/api';
import { InputPanel } from '@/components/translator/InputPanel';
import { GlossStrip } from '@/components/translator/GlossStrip';
import { TranslationMeta } from '@/components/translator/TranslationMeta';
import { SpeedControl } from '@/components/translator/SpeedControl';
import { DictGrid } from '@/components/translator/DictGrid';

// Dynamically import the canvas (no SSR — uses WebGL)
const AvatarCanvas = dynamic(
  () => import('@/components/avatar/AvatarCanvas').then((m) => m.AvatarCanvas),
  { ssr: false }
);

export default function TranslatePage() {
  const { setSigns } = useTranslatorStore();

  useEffect(() => {
    api.getSigns().then(setSigns).catch(console.error);
  }, [setSigns]);

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen bg-[var(--bg)] overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[rgba(18,18,26,0.8)] backdrop-blur-xl z-10">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xl bg-[linear-gradient(135deg,var(--accent),var(--accent3))]">
            🤟
          </div>
          <div>
            <div className="text-lg font-bold bg-[linear-gradient(135deg,var(--accent2),var(--accent3))] bg-clip-text text-transparent">
              V2PSL
            </div>
            <div className="text-[11px] text-[var(--text2)] -mt-0.5">Text → Pakistan Sign Language</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dictionary"
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--text2)] transition hover:border-[var(--accent)]"
          >
            📚 Dictionary
          </Link>
          <div className="text-[11px] text-[var(--text2)]">Prototype v1.0</div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[380px_1fr] grid-cols-1 h-full overflow-hidden">
        <aside className="flex flex-col overflow-y-auto bg-[var(--surface)] border-r border-[var(--border)] lg:border-r lg:border-[var(--border)] lg:max-h-full">
          <InputPanel />
          <GlossStrip />
          <TranslationMeta />
          <SpeedControl />
          <DictGrid />
        </aside>

        <AvatarCanvas />
      </div>
    </div>
  );
}
