interface FinalCTAProps {
  onNavigate: (view: 'profile') => void;
}

export function FinalCTA({ onNavigate }: FinalCTAProps) {
  return (
    <section
      className="w-full flex items-center justify-center"
      style={{ padding: '64px 48px', backgroundColor: '#FFF6EE' }}
    >
      <div className="flex flex-col items-center text-center" style={{ gap: '24px' }}>
        <h2 className="font-semibold" style={{ fontSize: '32px', color: '#402E32' }}>
          Ready to start swapping?
        </h2>
        <button
          onClick={() => onNavigate('profile')}
          className="font-semibold transition-all"
          style={{
            backgroundColor: '#F76902', color: '#FFFFFF',
            padding: '14px 32px', borderRadius: '8px', fontSize: '16px',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D85802';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F76902';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
