import { Link } from 'react-router';
import { ShieldCheck, Users, Home } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="w-full flex items-center justify-center relative overflow-hidden"
      style={{
        padding: '88px 24px 80px',
        background: 'linear-gradient(160deg, #FEF3EC 0%, #FFFBF7 45%, #F9FAFB 100%)',
        minHeight: '520px',
      }}
    >
      {/* Decorative background blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(247, 105, 2, 0.07)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(247, 105, 2, 0.05)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="flex flex-col items-center text-center relative z-10" style={{ gap: '32px', maxWidth: '820px', width: '100%' }}>
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 font-semibold"
          style={{
            fontSize: '13px',
            color: '#F76902',
            backgroundColor: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(247, 105, 2, 0.2)',
            boxShadow: '0 2px 8px rgba(247,105,2,0.1)',
          }}
        >
          🎓 RIT Students Only
        </div>

        {/* Headline */}
        <div className="flex flex-col" style={{ gap: '4px' }}>
          <h1
            className="font-bold leading-tight"
            style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            Housing + Marketplace
          </h1>
          <h1
            className="font-bold leading-tight"
            style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            in{' '}
            <span style={{ color: '#F76902' }}>One Place.</span>
          </h1>
        </div>

        {/* Subtext */}
        <p
          className="font-normal"
          style={{ fontSize: '18px', color: '#64748B', lineHeight: '1.7', maxWidth: '560px' }}
        >
          Find sublets, swap items, and connect with verified RIT students.{' '}
          <strong style={{ color: '#0F172A', fontWeight: 600 }}>No scams. No strangers.</strong>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center" style={{ gap: '12px' }}>
          <Link
            to="/signin"
            className="no-underline font-semibold transition-all"
            style={{
              backgroundColor: '#F76902',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#D55A02';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(247, 105, 2, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F76902';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(247, 105, 2, 0.4)';
            }}
          >
            Get Started — It's Free
          </Link>

          <Link
            to="/marketplace"
            className="no-underline font-medium transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#374151',
              padding: '14px 32px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '16px',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F9FAFB';
              (e.currentTarget as HTMLElement).style.borderColor = '#9CA3AF';
              (e.currentTarget as HTMLElement).style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
              (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
              (e.currentTarget as HTMLElement).style.color = '#374151';
            }}
          >
            Browse Marketplace
          </Link>
        </div>

        {/* Trust stats row */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: '32px', marginTop: '8px' }}
        >
          {[
            { icon: <Users size={18} />, label: 'RIT-verified students' },
            { icon: <Home size={18} />, label: 'Housing & Marketplace' },
            { icon: <ShieldCheck size={18} />, label: 'Safe & trusted community' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2"
              style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}
            >
              <span style={{ color: '#F76902' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
