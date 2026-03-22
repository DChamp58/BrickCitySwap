import { Home } from 'lucide-react';

export function SubletSection() {
  return (
    <section 
      className="w-full flex items-center justify-center"
      style={{ 
        padding: '64px 48px',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div 
        className="flex flex-col items-center text-center"
        style={{ 
          maxWidth: '700px',
          gap: '32px'
        }}
      >
        {/* Icon */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '80px',
            height: '80px',
            backgroundColor: '#F76902',
            borderRadius: '16px'
          }}
        >
          <Home 
            size={40}
            style={{ color: '#FFFFFF' }}
            strokeWidth={2}
          />
        </div>

        {/* Title */}
        <h2 
          className="font-semibold"
          style={{ 
            fontSize: '32px',
            color: '#0F172A',
            lineHeight: '1.3'
          }}
        >
          Find Housing for Your Co-op
        </h2>

        {/* Description */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Short-term leases built for RIT schedules.
          </p>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Move in when you need, move out when you don't.
          </p>
        </div>

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
          Post Your Housing
        </button>
      </div>
    </section>
  );
}