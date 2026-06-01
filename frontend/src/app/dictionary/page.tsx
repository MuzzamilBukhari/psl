import { api, Sign } from '@/lib/api';
import Link from 'next/link';

const CATEGORY_COLORS: Record<string, string> = {
  greeting: '#6c5ce7',
  social: '#00cec9',
  emotion: '#fd79a8',
  question: '#fdcb6e',
  pronoun: '#a29bfe',
  affirmation: '#55efc4',
  negation: '#e17055',
  action: '#74b9ff',
  basic_needs: '#81ecec',
  places: '#fab1a0',
  education: '#dfe6e9',
};

export const dynamic = 'force-dynamic';

export default async function DictionaryPage() {
  let signs = await api.getSigns().catch(() => []);

  // Group by category
  const grouped = signs.reduce<Record<string, Sign[]>>((acc, sign) => {
    const cat = sign.category ?? 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sign);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 60px' }}>
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(18,18,26,0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent2)' }}>🤟 V2PSL</div>
        </Link>
        <Link
          href="/translate"
          style={{
            padding: '8px 20px',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: '#fff',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Open Translator →
        </Link>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          PSL Sign Dictionary
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: 40, fontSize: 15 }}>
          {signs.length} signs available — click a sign in the translator to animate it.
        </p>

        {Object.entries(grouped).map(([category, catSigns]) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: CATEGORY_COLORS[category] ?? 'var(--accent)',
                }}
              />
              <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text2)' }}>
                {category.replace(/_/g, ' ')} ({catSigns.length})
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {catSigns.map((sign) => (
                <div
                  key={sign.key}
                  style={{
                    padding: '16px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      CATEGORY_COLORS[category] ?? 'var(--accent)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      {sign.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--accent2)',
                        background: 'rgba(108,92,231,0.1)',
                        padding: '2px 7px',
                        borderRadius: 6,
                      }}
                    >
                      {sign.key}
                    </span>
                  </div>
                  {sign.description && (
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                      {sign.description}
                    </p>
                  )}
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text2)' }}>
                    {sign.keyframes.length} keyframe{sign.keyframes.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
