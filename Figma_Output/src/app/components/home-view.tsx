import { ListingsPreview } from './listings-preview';

import { FinalCTA } from './final-cta';
import { Listing } from './listing-card';

interface HomeViewProps {
  onNavigate: (view: 'housing' | 'marketplace' | 'profile') => void;
  onView?: (listing: Listing) => void;
}

export function HomeView({ onNavigate, onView }: HomeViewProps) {
  const handleView = onView || (() => {});

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section
        className="w-full flex items-center justify-center"
        style={{ padding: '40px 48px', backgroundColor: '#FFF6EE' }}
      >
        <div className="flex flex-col items-center text-center" style={{ gap: '20px', maxWidth: '800px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <p
              className="font-semibold tracking-wide uppercase"
              style={{ fontSize: '18px', color: '#B5866E' }}
            >
              RIT Students Only
            </p>
            <h1
              className="font-bold leading-tight"
              style={{ fontSize: '56px', color: '#402E32' }}
            >
              Housing + Marketplace in One Place.
            </h1>
          </div>

          <div className="flex flex-col" style={{ gap: '4px' }}>
            <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6' }}>
              Find sublets, swap items, and connect with verified RIT students.
            </p>
            <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6' }}>
              No scams. No strangers. Only Tigers!
            </p>
          </div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <button
              onClick={() => onNavigate('housing')}
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
              Browse Housing
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="font-medium transition-all"
              style={{
                backgroundColor: '#FFFFFF', color: '#B5866E',
                padding: '14px 32px', borderRadius: '8px',
                border: '1px solid #E8D5C4', fontSize: '16px', cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF6EE';
                e.currentTarget.style.borderColor = '#B5866E';
                e.currentTarget.style.color = '#402E32';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E8D5C4';
                e.currentTarget.style.color = '#B5866E';
              }}
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Latest Listings Carousel */}
      <ListingsPreview onNavigate={onNavigate} onView={handleView} />

      {/* Final CTA */}
      <FinalCTA onNavigate={onNavigate} />
    </div>
  );
}
