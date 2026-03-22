import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Mock marketplace data
const marketplaceListings = [
  {
    id: 1,
    title: 'Mini Fridge',
    price: 80,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwZnJpZGdlfGVufDB8fHx8MTcxMzM2NzUwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Good',
    category: 'Furniture'
  },
  {
    id: 2,
    title: 'MacBook Air M1',
    price: 650,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwYWlyfGVufDB8fHx8MTcxMzM2NzUwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Excellent',
    category: 'Electronics'
  },
  {
    id: 3,
    title: 'Calculus Textbook',
    price: 45,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0Ym9va3xlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Good',
    category: 'Books'
  },
  {
    id: 4,
    title: 'Desk Chair',
    price: 60,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpcnxlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Good',
    category: 'Furniture'
  },
  {
    id: 5,
    title: 'AirPods Pro',
    price: 120,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb2RzJTIwcHJvfGVufDB8fHx8MTcxMzM2NzUwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'New',
    category: 'Electronics'
  },
  {
    id: 6,
    title: 'Coffee Table',
    price: 90,
    image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB0YWJsZXxlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Excellent',
    category: 'Furniture'
  },
  {
    id: 7,
    title: 'Python Programming Book',
    price: 30,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGJvb2t8ZW58MHx8fHwxNzEzMzY3NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Good',
    category: 'Books'
  },
  {
    id: 8,
    title: 'Monitor 27" 4K',
    price: 280,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25pdG9yJTIwNGt8ZW58MHx8fHwxNzEzMzY3NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'Used - Excellent',
    category: 'Electronics'
  },
  {
    id: 9,
    title: 'Desk Lamp',
    price: 25,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcHxlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    condition: 'New',
    category: 'Furniture'
  }
];

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [categories, setCategories] = useState({
    furniture: false,
    electronics: false,
    books: false
  });
  const [conditions, setConditions] = useState({
    new: false,
    used: false
  });

  const handleCategoryChange = (category: keyof typeof categories) => {
    setCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleConditionChange = (condition: keyof typeof conditions) => {
    setConditions(prev => ({
      ...prev,
      [condition]: !prev[condition]
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
          >Marketplace</h1>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Furniture, electronics, and student deals at RIT
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
                placeholder="Search items..."
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
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
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
            style={{ width: '240px' }}
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
                    ${maxPrice >= 1000 ? '1000+' : maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: '#F76902',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  className="font-bold"
                  style={{ 
                    fontSize: '14px',
                    color: '#111827',
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  Category
                </label>
                <div className="flex flex-col" style={{ gap: '10px' }}>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={categories.furniture}
                      onChange={() => handleCategoryChange('furniture')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    Furniture
                  </label>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={categories.electronics}
                      onChange={() => handleCategoryChange('electronics')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    Electronics
                  </label>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={categories.books}
                      onChange={() => handleCategoryChange('books')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    Books
                  </label>
                </div>
              </div>

              {/* Condition Filter */}
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
                  Condition
                </label>
                <div className="flex flex-col" style={{ gap: '10px' }}>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={conditions.new}
                      onChange={() => handleConditionChange('new')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    New
                  </label>
                  <label 
                    className="flex items-center cursor-pointer"
                    style={{ fontSize: '15px', color: '#374151' }}
                  >
                    <input
                      type="checkbox"
                      checked={conditions.used}
                      onChange={() => handleConditionChange('used')}
                      className="cursor-pointer"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '10px',
                        accentColor: '#F76902'
                      }}
                    />
                    Used
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Listings Grid */}
          <div className="flex-1">
            <div 
              className="grid"
              style={{ 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}
            >
              {marketplaceListings.map((listing) => (
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
                      height: '240px',
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
                        marginBottom: '8px',
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
                        marginBottom: '8px',
                        lineHeight: '1.2'
                      }}
                    >
                      ${listing.price}
                    </div>

                    {/* Condition */}
                    <p 
                      className="font-normal"
                      style={{ 
                        fontSize: '14px',
                        color: '#9CA3AF'
                      }}
                    >
                      {listing.condition}
                    </p>
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