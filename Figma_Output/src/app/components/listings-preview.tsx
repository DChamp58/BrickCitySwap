import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { fetchListings } from '@/lib/api';
import { Listing } from './listing-card';

interface ListingsPreviewProps {
  onNavigate: (view: 'housing' | 'marketplace') => void;
  onView: (listing: Listing) => void;
}

export function ListingsPreview({ onNavigate, onView }: ListingsPreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const [housing, marketplace] = await Promise.all([
          fetchListings('housing'),
          fetchListings('marketplace'),
        ]);

        const byRecency = (a: Listing, b: Listing) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

        const sortedMarket = (marketplace as Listing[]).sort(byRecency);
        const sortedHousing = (housing as Listing[]).sort(byRecency);

        // Interleave: marketplace, housing, marketplace, housing...
        const interleaved: Listing[] = [];
        const maxLen = Math.max(sortedMarket.length, sortedHousing.length);
        for (let i = 0; i < maxLen && interleaved.length < 8; i++) {
          if (i < sortedMarket.length) interleaved.push(sortedMarket[i]);
          if (interleaved.length < 8 && i < sortedHousing.length) interleaved.push(sortedHousing[i]);
        }

        setListings(interleaved);
      } catch {
        // Listings will remain empty
      }
    };
    loadListings();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (direction === 'right') {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + 360, behavior: 'smooth' });
    } else {
      const atStart = el.scrollLeft <= 10;
      el.scrollTo({ left: atStart ? el.scrollWidth : el.scrollLeft - 360, behavior: 'smooth' });
    }
  };

  if (listings.length === 0) return null;

  return (
    <section
      className="w-full flex items-center justify-center"
      style={{ padding: '64px 0', backgroundColor: '#FFFFFF' }}
    >
      <div className="w-full flex flex-col" style={{ gap: '32px' }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: '0 48px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}
        >
          <h2 className="font-semibold" style={{ fontSize: '32px', color: '#402E32' }}>
            Latest Listings
          </h2>
          <button
            onClick={() => onNavigate('marketplace')}
            className="font-medium transition-colors"
            style={{ fontSize: '15px', color: '#F76902', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all &rarr;
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: '48px', height: '48px', backgroundColor: '#FFFFFF',
              border: '1px solid #E8D5C4', borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(64, 46, 50, 0.1)', cursor: 'pointer'
            }}
          >
            <ChevronLeft size={24} style={{ color: '#402E32' }} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: '48px', height: '48px', backgroundColor: '#FFFFFF',
              border: '1px solid #E8D5C4', borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(64, 46, 50, 0.1)', cursor: 'pointer'
            }}
          >
            <ChevronRight size={24} style={{ color: '#402E32' }} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{ gap: '24px', padding: '16px 24px 8px 24px', scrollbarWidth: 'none' }}
          >
            {listings.map((listing) => {
              const isHovered = hoveredId === listing.id;
              return (
                <div
                  key={listing.id}
                  onClick={() => onView(listing)}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex-shrink-0 flex flex-col overflow-hidden cursor-pointer"
                  style={{
                    width: '320px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: isHovered ? '2px solid #F76902' : '2px solid transparent',
                    boxShadow: isHovered
                      ? '0 20px 48px rgba(247, 105, 2, 0.18), 0 4px 12px rgba(64, 46, 50, 0.1)'
                      : '0 1px 3px rgba(64, 46, 50, 0.1)',
                    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                    outline: 'none',
                  }}
                >
                  {/* Image with zoom */}
                  <div className="w-full overflow-hidden" style={{ height: '240px', borderRadius: '10px 10px 0 0' }}>
                    <ImageWithFallback
                      src={listing.listing_images?.[0]?.url || ''}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      style={{
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 320ms ease',
                      }}
                    />
                  </div>

                  <div className="flex flex-col" style={{ padding: '24px', gap: '8px' }}>
                    <h3
                      className="font-medium"
                      style={{
                        fontSize: '20px',
                        color: isHovered ? '#F76902' : '#402E32',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        transition: 'color 200ms ease',
                      }}
                    >
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold" style={{ fontSize: '20px', color: '#F76902' }}>
                        ${listing.price}{listing.type === 'housing' ? '/mo' : ''}
                      </p>
                      <span className="font-normal" style={{ fontSize: '14px', color: '#B5866E' }}>
                        {listing.type === 'housing' ? 'Housing' : listing.category || 'Marketplace'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
