export function FinalCTA() {
  return (
    <section 
      className="w-full flex items-center justify-center"
      style={{ 
        padding: '64px 48px',
        backgroundColor: '#F9FAFB'
      }}
    >
      <div 
        className="flex flex-col items-center text-center"
        style={{ gap: '24px' }}
      >
        {/* Headline */}
        <h2 
          className="font-semibold"
          style={{ 
            fontSize: '32px',
            color: '#0F172A'
          }}
        >
          Ready to start swapping?
        </h2>

        {/* CTA Button */}
        <button
          className="font-semibold transition-all"
          style={{
            backgroundColor: '#F76902',
            color: '#FFFFFF',
            padding: '14px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            transitionDuration: '200ms',
            boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D55A02';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(247, 105, 2, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F76902';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(247, 105, 2, 0.4)';
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}