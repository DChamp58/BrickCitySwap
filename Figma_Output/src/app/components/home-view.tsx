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
        className="w-full flex items-center justify-center px-6 md:px-12 py-10 md:py-12"
        style={{ backgroundColor: '#FFF6EE' }}
      >
        <div className="flex flex-col items-center text-center w-full" style={{ gap: '20px', maxWidth: '800px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <p
              className="font-semibold tracking-wide uppercase text-sm md:text-lg"
              style={{ color: '#B5866E' }}
            >
              RIT Students Only
            </p>
            <h1
              className="font-bold leading-tight text-4xl md:text-6xl"
              style={{ color: '#402E32' }}
            >
              Housing + Marketplace in One Place.
            </h1>
          </div>

          <div className="flex flex-col" style={{ gap: '4px' }}>
            <p className="font-normal text-sm md:text-base" style={{ color: '#B5866E', lineHeight: '1.6' }}>
              Find sublets, swap items, and connect with verified RIT students.
            </p>
            <p className="font-normal text-sm md:text-base" style={{ color: '#B5866E', lineHeight: '1.6' }}>
              No scams. No strangers. Only Tigers!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto" style={{ gap: '16px' }}>
            <button
              onClick={() => onNavigate('housing')}
              className="font-semibold transition-all w-full sm:w-auto"
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
              className="font-medium transition-all w-full sm:w-auto"
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
