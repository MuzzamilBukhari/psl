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

  // Load signs from backend on mount
  useEffect(() => {
    api.getSigns().then(setSigns).catch(console.error);
  }, [setSigns]);

  // Copy avatar.glb from basic/ into public/ — handled by the user once
  // Avatar is served from /avatar.glb

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: '100vh',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(18, 18, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🤟
          </div>
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--accent2), var(--accent3))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              V2PSL
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: -2 }}>
              Text → Pakistan Sign Language
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link
            href="/dictionary"
            style={{
              fontSize: 12,
              color: 'var(--text2)',
              textDecoration: 'none',
              padding: '6px 14px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            📚 Dictionary
          </Link>
          <div style={{ fontSize: 11, color: 'var(--text2)' }}>Prototype v1.0</div>
        </div>
      </header>

      {/* Main layout: panel + 3D viewport */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Left panel */}
        <div
          style={{
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <InputPanel />
          <GlossStrip />
          <TranslationMeta />
          <SpeedControl />
          <DictGrid />
        </div>

        {/* 3D Avatar viewport */}
        <AvatarCanvas />
      </div>

      <style>{`
        .panel-section {
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        .panel-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text2);
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; grid-template-rows: auto 1fr; }
          .panel { max-height: 45vh; border-right: none !important; border-bottom: 1px solid var(--border) !important; }
        }
      `}</style>
    </div>
  );
}
