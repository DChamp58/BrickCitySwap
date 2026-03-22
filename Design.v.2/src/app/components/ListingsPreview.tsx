import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';

export function ListingsPreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const listings = [
    {
      image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc3NDE5NTU3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: '1BR Apartment near RIT',
      price: '$650/mo',
      type: 'Housing',
      link: '/housing',
    },
    {
      image: 'https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGlvJTIwYXBhcnRtZW50fGVufDF8fHx8MTc3NDA4NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Studio Sublet - Spring Semester',
      price: '$500/mo',
      type: 'Housing',
      link: '/housing',
    },
    {
      image: 'https://images.unsplash.com/photo-1646596549459-9ccf652c5d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzQxOTU1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Desk & Chair Set',
      price: '$80',
      type: 'Furniture',
      link: '/marketplace',
    },
    {
      image: 'https://images.unsplash.com/photo-1698422454410-e8ecf526f1a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGVzayUyMHNldHVwfGVufDF8fHx8MTc3NDE5NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Complete Desk Setup',
      price: '$150',
      type: 'Electronics',
      link: '/marketplace',
    },
    {
      image: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NDE5NTU4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Shared Apartment - Co-op Term',
      price: '$450/mo',
      type: 'Housing',
      link: '/housing',
    },
    {
      image: 'https://images.unsplash.com/photo-1763730727796-3b1ba3a61ade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwY2FtcHVzJTIwc3R1ZGVudHxlbnwxfHx8fDE3NzQxOTU1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Mountain Bike',
      price: '$200',
      type: 'Transportation',
      link: '/marketplace',
    },
  ];

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -360 : 360,
        behavior: 'smooth',
      });
    }
  };

  const typeColors: Record<string, string> = {
    Housing: '#EEF2FF',
    Furniture: '#F0FDF4',
    Electronics: '#FFF7ED',
    Transportation: '#F0F9FF',
  };
  const typeTextColors: Record<string, string> = {
    Housing: '#4F46E5',
    Furniture: '#16A34A',
    Electronics: '#EA580C',
    Transportation: '#0284C7',
  };

  return (
    <section
      className="w-full"
      style={{ padding: '72px 0', backgroundColor: '#FFFFFF' }}
    >
      <div className="w-full flex flex-col" style={{ gap: '32px' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '0 24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}
        >
          <div>
            <h2 className="font-bold" style={{ fontSize: '28px', color: '#0F172A', marginBottom: '4px' }}>
              Latest Listings
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Fresh from the RIT community</p>
          </div>
          <Link
            to="/housing"
            className="font-medium transition-colors no-underline flex items-center gap-1"
            style={{ fontSize: '14px', color: '#F76902' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D55A02')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#F76902')}
          >
            View all →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              opacity: canScrollLeft ? 1 : 0.3,
              cursor: canScrollLeft ? 'pointer' : 'default',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} style={{ color: '#111827' }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              opacity: canScrollRight ? 1 : 0.3,
              cursor: canScrollRight ? 'pointer' : 'default',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} style={{ color: '#111827' }} />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto"
            style={{
              gap: '20px',
              padding: '8px 60px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {listings.map((listing, index) => (
              <Link
                key={index}
                to={listing.link}
                className="no-underline flex-shrink-0 flex flex-col overflow-hidden transition-all"
                style={{
                  width: '300px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                }}
              >
                {/* Image */}
                <div className="w-full overflow-hidden relative" style={{ height: '200px' }}>
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  {/* Type badge over image */}
                  <span
                    className="absolute top-3 left-3 font-semibold"
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: typeColors[listing.type] ?? '#F3F4F6',
                      color: typeTextColors[listing.type] ?? '#374151',
                    }}
                  >
                    {listing.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col" style={{ padding: '18px 20px', gap: '6px' }}>
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: '16px',
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {listing.title}
                  </h3>
                  <p className="font-bold" style={{ fontSize: '18px', color: '#F76902' }}>
                    {listing.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
