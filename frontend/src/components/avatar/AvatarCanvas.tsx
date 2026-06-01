'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useTranslatorStore } from '@/store/translatorStore';
import { AvatarModel } from './AvatarModel';

export function AvatarCanvas() {
  const { status, tokens, activeTokenIndex } = useTranslatorStore();
  const isSigning = status === 'signing';
  const currentToken = activeTokenIndex >= 0 ? tokens[activeTokenIndex] : null;

  return (
    <div
      id="viewport"
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at center bottom, #1a1a3e 0%, #0a0a0f 70%)',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      {/* Current sign overlay */}
      {currentToken && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 28,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 3,
            color: 'var(--accent2)',
            textShadow: '0 0 30px var(--glow)',
            zIndex: 5,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeIn .3s ease',
          }}
        >
          {currentToken.replace(/_/g, ' ')}
        </div>
      )}

      {/* Status bar */}
      <div
        id="statusBar"
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '8px 20px',
          borderRadius: 100,
          border: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--text2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isSigning ? 'var(--accent)' : 'var(--accent3)',
            animation: `pulse ${isSigning ? '0.8s' : '2s'} infinite`,
          }}
        />
        <span id="statusText">
          {isSigning
            ? 'Signing...'
            : status === 'translating'
            ? 'Translating...'
            : status === 'error'
            ? '⚠ Error — check backend connection'
            : 'Ready — type a sentence to begin'}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 1.3, 3.2], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.toneMapping = 4; // ACESFilmicToneMapping
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <hemisphereLight args={[0xffffff, 0x444466, 1.0]} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-3, 3, -1]} intensity={0.6} color={0xaaccff} />
        <directionalLight position={[0, 2, -4]} intensity={0.4} color={0xffeedd} />

        {/* Floor disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.5, 64]} />
          <meshStandardMaterial color={0x1a1a2e} transparent opacity={0.5} />
        </mesh>

        {/* Avatar */}
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>

        <OrbitControls
          target={[0, 1.1, 0]}
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
          maxPolarAngle={Math.PI * 0.85}
        />
      </Canvas>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
