import { Link } from 'react-router';
import { Home, Calendar, MapPin, ArrowRight } from 'lucide-react';

export function SubletSection() {
  const features = [
    { icon: <Calendar size={18} />, text: 'Short-term leases for co-op schedules' },
    { icon: <MapPin size={18} />, text: 'Listings near RIT campus in Henrietta' },
    { icon: <Home size={18} />, text: 'Studios, 1BR, shared rooms & more' },
  ];

  return (
    <section
      className="w-full"
      style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}
    >
      <div
        className="mx-auto flex flex-col md:flex-row items-center"
        style={{ maxWidth: '1100px', gap: '64px' }}
      >
        {/* Left — Visual card */}
        <div
          className="relative flex-shrink-0"
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div
            className="w-full overflow-hidden"
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FEF3EC 0%, #FFF7ED 100%)',
              padding: '40px 36px',
              border: '1px solid rgba(247,105,2,0.12)',
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: '#F76902',
                borderRadius: '16px',
                marginBottom: '28px',
                boxShadow: '0 8px 20px rgba(247,105,2,0.3)',
              }}
            >
              <Home size={36} style={{ color: '#FFFFFF' }} strokeWidth={2} />
            </div>

            {/* Mock listing card preview */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: '8px' }}>
                <div>
                  <p className="font-semibold" style={{ fontSize: '15px', color: '#111827' }}>
                    Studio near RIT Campus
                  </p>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Henrietta, NY</p>
                </div>
                <span
                  className="font-bold"
                  style={{ fontSize: '16px', color: '#F76902', flexShrink: 0, marginLeft: '12px' }}
                >
                  $500/mo
                </span>
              </div>
              <div className="flex items-center gap-3" style={{ marginTop: '12px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontWeight: 500,
                  }}
                >
                  Available Jun 1
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#F0FDF4',
                    color: '#16A34A',
                    fontWeight: 500,
                  }}
                >
                  RIT Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Content */}
        <div className="flex flex-col" style={{ gap: '24px', flex: 1 }}>
          <div
            className="inline-flex items-center font-semibold"
            style={{
              fontSize: '13px',
              color: '#F76902',
              backgroundColor: '#FEF3EC',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(247,105,2,0.2)',
              width: 'fit-content',
            }}
          >
            Housing
          </div>

          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#0F172A', lineHeight: '1.2', letterSpacing: '-0.02em' }}
          >
            Find Housing for Your Co-op Term
          </h2>

          <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.7' }}>
            Move in when you need, move out when you don't. BrickCitySwap connects you with fellow RIT students offering flexible short-term leases that fit your schedule.
          </p>

          <div className="flex flex-col" style={{ gap: '12px' }}>
            {features.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '34px',
                    height: '34px',
                    backgroundColor: '#FEF3EC',
                    borderRadius: '8px',
                    color: '#F76902',
                  }}
                >
                  {icon}
                </div>
                <span style={{ fontSize: '15px', color: '#374151', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <Link
            to="/housing"
            className="no-underline inline-flex items-center gap-2 font-semibold transition-all"
            style={{
              backgroundColor: '#F76902',
              color: '#FFFFFF',
              padding: '13px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              width: 'fit-content',
              boxShadow: '0 4px 14px rgba(247,105,2,0.35)',
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
            Browse Housing
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
