export function Hero() {
  return (
    <section 
      className="w-full flex items-center justify-center"
      style={{ 
        padding: '64px 48px',
        backgroundColor: '#F9FAFB'
      }}
    >
      <div className="flex flex-col items-center text-center" style={{ gap: '32px', maxWidth: '800px' }}>
        {/* Headline */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 
            className="font-bold leading-tight"
            style={{ 
              fontSize: '56px',
              color: '#0F172A'
            }}
          >
            RIT Students Only.
          </h1>
          <h1 
            className="font-bold leading-tight"
            style={{ 
              fontSize: '56px',
              color: '#0F172A'
            }}
          >
            Housing + Marketplace in One Place.
          </h1>
        </div>

        {/* Subtext */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Find sublets, swap items, and connect with verified RIT students.
          </p>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            No scams. No strangers.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center" style={{ gap: '16px' }}>
          {/* Primary Button */}
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

          {/* Secondary Button */}
          <button
            className="font-medium transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              padding: '14px 32px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '16px',
              cursor: 'pointer',
              transitionDuration: '200ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = '#94A3B8';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    </section>
  );
}