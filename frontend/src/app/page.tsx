import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          🤟
        </div>
        <div style={{ textAlign: 'left' }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent2), var(--accent3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            V2PSL
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 2 }}>
            Voice to Pakistani Sign Language
          </p>
        </div>
      </div>

      {/* Headline */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.2,
          maxWidth: 640,
          marginBottom: 20,
          color: 'var(--text)',
        }}
      >
        Breaking the{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, var(--accent2), var(--accent3))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          communication barrier
        </span>{' '}
        in Pakistan
      </h2>

      <p
        style={{
          fontSize: 18,
          color: 'var(--text2)',
          maxWidth: 560,
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        Speak or type in English and watch a real-time 3D avatar translate your words into
        Pakistani Sign Language using inverse kinematics.
      </p>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/translate"
          style={{
            padding: '16px 36px',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: '#fff',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 8px 32px var(--glow)',
            transition: 'all .2s',
          }}
        >
          🤟 Open Translator
        </Link>
        <Link
          href="/dictionary"
          style={{
            padding: '16px 36px',
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all .2s',
          }}
        >
          📚 Browse Signs
        </Link>
      </div>

      {/* Feature pills */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 60,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { icon: '🎙️', label: 'Voice Input' },
          { icon: '🧠', label: 'NLP Pipeline' },
          { icon: '🦾', label: 'IK Animation' },
          { icon: '🧍', label: '3D Avatar' },
          { icon: '🐍', label: 'FastAPI Backend' },
          { icon: '🗄️', label: 'PostgreSQL DB' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            style={{
              padding: '8px 16px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              fontSize: 13,
              color: 'var(--text2)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
