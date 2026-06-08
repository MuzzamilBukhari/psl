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
    <div className="grid grid-rows-[auto_1fr] h-screen bg-[linear-gradient(135deg,var(--bg)_0%,var(--bg-secondary)_100%)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[var(--border)] bg-[rgba(10,14,39,0.85)] backdrop-blur-xl z-10">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
            🤟
          </div>
          <div className="flex flex-col">
            <div className="text-sm md:text-base font-bold text-[var(--text)]">
              V2PSL
            </div>
            <div className="text-xs text-[var(--text-muted)]">Text → PSL</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dictionary" className="btn-secondary text-xs md:text-sm">
            📚 Dictionary
          </Link>
          <div className="text-xs text-[var(--text-muted)] hidden sm:block">
            v1.0
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[380px_1fr] grid-cols-1 h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="flex flex-col overflow-y-auto bg-[var(--surface)] border-r border-[var(--border)] lg:border-r lg:border-[var(--border)] lg:max-h-full">
          <InputPanel />
          <GlossStrip />
          <TranslationMeta />
          <SpeedControl />
          <DictGrid />
        </aside>

        {/* Avatar Canvas */}
        <div className="hidden lg:flex">
          <AvatarCanvas />
        </div>
      </div>
    </div>
  );
}
