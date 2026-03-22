import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section
      className="w-full flex items-center justify-center relative overflow-hidden"
      style={{ padding: '80px 24px', backgroundColor: '#0F172A' }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(247, 105, 2, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="flex flex-col items-center text-center relative z-10" style={{ gap: '24px', maxWidth: '640px' }}>
        <div
          className="inline-flex items-center font-semibold"
          style={{
            fontSize: '13px',
            color: '#F76902',
            backgroundColor: 'rgba(247,105,2,0.12)',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(247,105,2,0.25)',
          }}
        >
          Join the community
        </div>

        <h2
          className="font-bold"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#FFFFFF', lineHeight: '1.2', letterSpacing: '-0.02em' }}
        >
          Ready to start swapping?
        </h2>

        <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: '1.7' }}>
          Sign up with your RIT email and get instant access to housing listings and the student marketplace.
        </p>

        <div className="flex flex-wrap items-center justify-center" style={{ gap: '12px' }}>
          <Link
            to="/signin"
            className="no-underline flex items-center gap-2 font-semibold transition-all"
            style={{
              backgroundColor: '#F76902',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '16px',
              boxShadow: '0 4px 20px rgba(247, 105, 2, 0.45)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#D55A02';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F76902';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/housing"
            className="no-underline font-medium transition-all"
            style={{
              backgroundColor: 'transparent',
              color: '#94A3B8',
              padding: '14px 28px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '16px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#94A3B8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
