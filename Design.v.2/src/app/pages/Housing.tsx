import { useState } from 'react';
import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Mock housing data
const housingListings = [
  {
    id: 1,
    title: 'Modern 1BR near RIT Campus',
    price: 850,
    image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc3NDE5NTU3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 1,
    bathrooms: 1,
    type: 'Apartment',
    moveInDate: 'Jun 1, 2026',
    location: 'Henrietta, NY'
  },
  {
    id: 2,
    title: 'Spacious Studio with Natural Light',
    price: 750,
    image: 'https://images.unsplash.com/photo-1728023881214-1d71a7a30a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzQxOTkxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 0,
    bathrooms: 1,
    type: 'Studio',
    moveInDate: 'May 15, 2026',
    location: 'Rochester, NY'
  },
  {
    id: 3,
    title: 'Shared Housing - 1 Room Available',
    price: 650,
    image: 'https://images.unsplash.com/photo-1598147265504-899fbf4b5500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBzdHVkZW50JTIwaG91c2luZyUyMGJlZHJvb218ZW58MXx8fHwxNzc0MTk5MTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 1,
    bathrooms: 1,
    type: 'Shared',
    moveInDate: 'Jul 1, 2026',
    location: 'Henrietta, NY'
  },
  {
    id: 4,
    title: 'Updated 2BR with Modern Kitchen',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc3NDEyOTA5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    moveInDate: 'Aug 1, 2026',
    location: 'Brighton, NY'
  },
  {
    id: 5,
    title: 'Luxury Apartment Close to Campus',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1742108351840-8164e19f8ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFwYXJ0bWVudCUyMGV4dGVyaW9yfGVufDF8fHx8MTc3NDE5OTE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    moveInDate: 'Jun 15, 2026',
    location: 'Henrietta, NY'
  },
  {
    id: 6,
    title: 'Cozy Room in Student House',
    price: 550,
    image: 'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGVudCUyMGRvcm0lMjByb29tfGVufDF8fHx8MTc3NDE5OTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    bedrooms: 1,
    bathrooms: 1,
    type: 'Shared',
    moveInDate: 'May 1, 2026',
    location: 'Rochester, NY'
  }
];

export function Housing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [housingTypes, setHousingTypes] = useState({
    house: false,
    apartment: false
  });

  const handleHousingTypeChange = (type: keyof typeof housingTypes) => {
    setHousingTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Page Header */}
      <div 
        className="w-full"
        style={{ 
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB'
        }}
      >
        <div 
          className="max-w-[1400px] mx-auto"
          style={{ padding: '48px 48px 32px 48px' }}
        >
          <h1 
            className="font-bold"
            style={{ 
              fontSize: '56px',
              color: '#0F172A',
              marginBottom: '16px',
              lineHeight: '1.1'
            }}
          >
            Housing
          </h1>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Find verified housing from RIT students. No scams, no strangers.
          </p>

          {/* Search and Sort */}
          <div 
            className="flex items-center"
            style={{ gap: '16px', marginTop: '32px' }}
          >
            {/* Search Bar */}
            <div 
              className="flex-1 flex items-center bg-white"
              style={{ 
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                gap: '8px'
              }}
            >
              <Search size={20} style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Search by location, type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ 
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center" style={{ gap: '8px' }}>
              <SlidersHorizontal size={20} style={{ color: '#6B7280' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="outline-none"
                style={{
                  fontSize: '16px',
                  color: '#111827',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="move-in">Move-in Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px' }}>
        <div className="flex" style={{ gap: '32px' }}>
          {/* Left Sidebar - Filters */}
          <div 
            className="flex-shrink-0"
            style={{ width: '280px' }}
          >
            <div 
              className="bg-white sticky"
              style={{ 
                top: '24px',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB'
              }}
            >
              <h3 
                className="font-semibold"
                style={{ 
                  fontSize: '20px',
                  color: '#111827',
                  marginBottom: '24px'
                }}
              >
                Filters
              </h3>

              {/* Max Price Filter */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <label 
                    className="font-bold"
                    style={{ 
                      fontSize: '14px',
                      color: '#111827'
                    }}
                  >
                    Max Price
                  </label>
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontSize: '16px',
                      color: '#F76902'
                    }}
                  >
                    ${maxPrice >= 2500 ? '2500+' : maxPrice}/month
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: '#F76902',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Move-in Date Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  className="font-bold"
                  style={{ 
                    fontSize: '14px',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Move-in Date
                </label>
                <div className="relative">
                  <Calendar 
                    size={18} 
                    style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9CA3AF',
                      pointerEvents: 'none'
                    }} 
                  />
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full outline-none"
                    style={{
                      fontSize: '15px',
                      color: '#111827',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB'
                    }}
                  />
                </div>
              </div>

              {/* Move-out Date Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  className="font-bold"
                  style={{ 
                    fontSize: '14px',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Move-out Date
                </label>
                <div className="relative">
                  <Calendar 
                    size={18} 
                    style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9CA3AF',
                      pointerEvents: 'none'
                    }} 
                  />
                  <input
                    type="date"
                    value={moveOutDate}
                    onChange={(e) => setMoveOutDate(e.target.value)}
                    className="w-full outline-none"
                    style={{
                      fontSize: '15px',
                      color: '#111827',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB'
                    }}
                  />
                </div>
              </div>

              {/* Housing Type Filter */}
              <div>
                <label 
                  className="font-bold"
                  style={{ 
                    fontSize: '14px',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  Housing Type
                </label>
                <div className="flex flex-col" style={{ gap: '10px' }}>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={housingTypes.house}
                      onChange={() => handleHousingTypeChange('house')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    House
                  </label>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={housingTypes.apartment}
                      onChange={() => handleHousingTypeChange('apartment')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    Apartment
                  </label>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                className="w-full font-medium hover:opacity-70 transition-opacity"
                style={{
                  marginTop: '24px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#6B7280',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
                onClick={() => {
                  setMaxPrice(2000);
                  setMoveInDate('');
                  setMoveOutDate('');
                  setHousingTypes({
                    house: false,
                    apartment: false
                  });
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Right Content - Listings Grid */}
          <div className="flex-1">
            <div 
              className="grid"
              style={{ 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {housingListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white cursor-pointer group"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  <div 
                    style={{ 
                      width: '100%',
                      height: '260px',
                      overflow: 'hidden',
                      backgroundColor: '#F3F4F6'
                    }}
                  >
                    <ImageWithFallback
                      src={listing.image}
                      alt={listing.title}
                      className="group-hover:scale-105"
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.15s ease-out'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    {/* Title */}
                    <h3 
                      className="font-semibold"
                      style={{ 
                        fontSize: '18px',
                        color: '#111827',
                        marginBottom: '12px',
                        lineHeight: '1.3'
                      }}
                    >
                      {listing.title}
                    </h3>

                    {/* Price */}
                    <div 
                      className="font-bold"
                      style={{ 
                        fontSize: '28px',
                        color: '#F76902',
                        marginBottom: '4px',
                        lineHeight: '1.2'
                      }}
                    >
                      ${listing.price}
                      <span 
                        className="font-normal" 
                        style={{ fontSize: '16px', color: '#9CA3AF' }}
                      >
                        /mo
                      </span>
                    </div>

                    {/* Location */}
                    <p 
                      className="font-normal"
                      style={{ 
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '16px'
                      }}
                    >
                      {listing.location}
                    </p>

                    {/* Details - Compact */}
                    <div 
                      className="flex flex-col"
                      style={{ gap: '6px', marginBottom: '20px' }}
                    >
                      <p 
                        className="font-normal"
                        style={{ 
                          fontSize: '14px',
                          color: '#9CA3AF'
                        }}
                      >
                        {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bed`} · {listing.bathrooms} bath · {listing.type}
                      </p>
                      <p 
                        className="font-normal"
                        style={{ 
                          fontSize: '14px',
                          color: '#9CA3AF'
                        }}
                      >
                        Available {listing.moveInDate}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full font-semibold transition-all"
                      style={{
                        backgroundColor: '#F76902',
                        color: '#FFFFFF',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        border: 'none',
                        cursor: 'pointer',
                        transitionDuration: '150ms'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E65F00';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F76902';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      View Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}