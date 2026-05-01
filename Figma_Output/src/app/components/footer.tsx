interface FooterProps {
  onNavigate?: (view: 'privacy' | 'terms') => void;
}

export function Footer({ onNavigate }: FooterProps = {}) {
  const linkButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontSize: '14px',
    color: '#E8D5C4',
    textAlign: 'left',
    fontFamily: 'inherit'
  };

  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: '#402E32',
        color: '#FFFFFF',
        padding: '48px'
      }}
    >
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '48px'
        }}
      >
        {/* Logo & Tagline */}
        <div style={{ maxWidth: '300px' }}>
          <h2 className="font-bold" style={{ fontSize: '24px', marginBottom: '12px' }}>
            <span style={{ color: '#FFFFFF' }}>BrickCity</span>
            <span style={{ color: '#F76902' }}>Swap</span>
          </h2>
          <p className="font-normal" style={{ fontSize: '14px', color: '#C4A88E', lineHeight: '1.6' }}>
            The safe, student-exclusive marketplace for RIT students. Find housing, sell items, and connect.
          </p>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold" style={{ fontSize: '14px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
            About
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Built for RIT Students</p>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Verified Email Access</p>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Campus-Focused Community</p>
          </div>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold" style={{ fontSize: '14px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
            Community
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Housing & Subletting</p>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Student Marketplace</p>
            <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Safe Transactions</p>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold" style={{ fontSize: '14px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
            Legal
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {onNavigate ? (
              <>
                <button onClick={() => onNavigate('privacy')} className="font-normal" style={linkButtonStyle}>
                  Privacy Policy
                </button>
                <button onClick={() => onNavigate('terms')} className="font-normal" style={linkButtonStyle}>
                  Terms of Service
                </button>
              </>
            ) : (
              <>
                <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Privacy Policy</p>
                <p className="font-normal" style={{ fontSize: '14px', color: '#E8D5C4' }}>Terms of Service</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #5A4A44',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E' }}>
          &copy; {new Date().getFullYear()} BrickCitySwap. For RIT Students Only.
        </p>
        <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E' }}>
          Made with care by RIT students.
        </p>
      </div>
    </footer>
  );
}
