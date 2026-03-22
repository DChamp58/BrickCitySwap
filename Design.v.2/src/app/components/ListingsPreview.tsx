import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export function ListingsPreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const listings = [
    {
      image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc3NDE5NTU3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: '1BR Apartment near RIT',
      price: '$650/mo',
      type: 'Housing'
    },
    {
      image: 'https://images.unsplash.com/photo-1507138451611-3001135909fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGlvJTIwYXBhcnRtZW50fGVufDF8fHx8MTc3NDEwODcwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Studio Sublet - Spring Semester',
      price: '$500/mo',
      type: 'Housing'
    },
    {
      image: 'https://images.unsplash.com/photo-1646596549459-9ccf652c5d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzQxOTU1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Desk & Chair Set',
      price: '$80',
      type: 'Furniture'
    },
    {
      image: 'https://images.unsplash.com/photo-1698422454410-e8ecf526f1a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGVzayUyMHNldHVwfGVufDF8fHx8MTc3NDE5NTU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Complete Desk Setup',
      price: '$150',
      type: 'Electronics'
    },
    {
      image: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NDE5NTU4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Shared Apartment - Co-op Term',
      price: '$450/mo',
      type: 'Housing'
    },
    {
      image: 'https://images.unsplash.com/photo-1763730727796-3b1ba3a61ade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwY2FtcHVzJTIwc3R1ZGVudHxlbnwxfHx8fDE3NzQxOTU1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Mountain Bike',
      price: '$200',
      type: 'Transportation'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      className="w-full flex items-center justify-center"
      style={{ 
        padding: '64px 0',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div className="w-full flex flex-col" style={{ gap: '32px' }}>
        {/* Header: Title + View All */}
        <div 
          className="flex items-center justify-between"
          style={{ 
            padding: '0 48px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          <h2 
            className="font-semibold"
            style={{ 
              fontSize: '32px',
              color: '#0F172A'
            }}
          >
            Latest Listings
          </h2>
          <a
            href="#"
            className="font-medium transition-colors"
            style={{
              fontSize: '15px',
              color: '#F76902',
              textDecoration: 'none',
              transitionDuration: '200ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#D55A02';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#F76902';
            }}
          >
            View all →
          </a>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <ChevronLeft size={24} style={{ color: '#111827' }} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <ChevronRight size={24} style={{ color: '#111827' }} />
          </button>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{
              gap: '24px',
              padding: '0 24px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {listings.map((listing, index) => (
              <div 
                key={index}
                className="flex-shrink-0 flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                style={{ 
                  width: '320px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {/* Large Image */}
                <div 
                  className="w-full overflow-hidden"
                  style={{ height: '240px' }}
                >
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col" style={{ padding: '24px', gap: '8px' }}>
                  <h3 
                    className="font-medium"
                    style={{ 
                      fontSize: '20px',
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {listing.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p 
                      className="font-semibold"
                      style={{ 
                        fontSize: '20px',
                        color: '#F76902'
                      }}
                    >
                      {listing.price}
                    </p>
                    <span 
                      className="font-normal"
                      style={{ 
                        fontSize: '14px',
                        color: '#6B7280'
                      }}
                    >
                      {listing.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}