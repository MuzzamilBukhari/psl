"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslatorStore } from "@/store/translatorStore";
import { api } from "@/lib/api";
import { InputPanel } from "@/components/translator/InputPanel";
import { GlossStrip } from "@/components/translator/GlossStrip";
import { TranslationMeta } from "@/components/translator/TranslationMeta";
import { SpeedControl } from "@/components/translator/SpeedControl";
import { DictGrid } from "@/components/translator/DictGrid";

// Dynamically import the canvas (no SSR — uses WebGL)
const AvatarCanvas = dynamic(
  () => import("@/components/avatar/AvatarCanvas").then((m) => m.AvatarCanvas),
  { ssr: false },
);

export default function TranslatePage() {
  const { setSigns } = useTranslatorStore();

  useEffect(() => {
    api.getSigns().then(setSigns).catch(console.error);
  }, [setSigns]);

  return (
    <div className="main-layout min-h-screen bg-[linear-gradient(135deg,var(--bg)_0%,var(--bg-secondary)_100%)] overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(10,14,39,0.96)] backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.24)] py-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 md:px-10 py-8 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-4 no-underline hover:opacity-90 transition-opacity duration-300"
          >
            <div className="w-14 h-14 rounded-[var(--radius-xl)] flex items-center justify-center text-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-[var(--shadow-lg)]">
              🤟
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight">
                V2PSL
              </div>
              <div className="text-sm md:text-base text-[var(--text-secondary)] uppercase tracking-[0.24em]">
                Text → PSL
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dictionary"
              className="btn-secondary text-sm md:text-base w-full sm:w-auto justify-center py-4"
            >
              📚 Dictionary
            </Link>
            <div className="text-xs md:text-sm text-[var(--text-muted)] uppercase tracking-[0.2em]">
              v1.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[400px_1fr] grid-cols-1 flex-1 h-full overflow-hidden gap-6 px-6 md:px-8 py-8">
        {/* Sidebar */}
        <aside className="flex flex-col overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
          <InputPanel />
          <GlossStrip />
          <TranslationMeta />
          <SpeedControl />
          <DictGrid />
        </aside>

        {/* Avatar Canvas */}
        <div className="hidden lg:flex rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
          <AvatarCanvas />
        </div>
      </div>
    </div>
  );
}
