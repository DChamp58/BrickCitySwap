import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Listing } from './listing-card';
import { fetchListings as fetchListingsApi } from '@/lib/api';

interface ListingsViewProps {
  type: 'housing' | 'marketplace';
  onContact: (listing: Listing) => void;
  onView: (listing: Listing) => void;
}

export function ListingsView({ type, onContact, onView }: ListingsViewProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(type === 'housing' ? 2000 : 1000);
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [housingTypes, setHousingTypes] = useState({ house: false, apartment: false });
  const [categories, setCategories] = useState({ furniture: false, electronics: false, books: false });
  const [conditions, setConditions] = useState({ new: false, used: false });

  useEffect(() => {
    fetchListings();
  }, [type]);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, sortBy, maxPrice, moveInDate, moveOutDate, housingTypes, categories, conditions]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await fetchListingsApi(type);
      setListings(data as Listing[]);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings].filter(l => l.status !== 'sold');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.location && l.location.toLowerCase().includes(q))
      );
    }

    const maxPriceLimit = type === 'housing' ? 2500 : 1000;
    if (maxPrice < maxPriceLimit) {
      filtered = filtered.filter(l => l.price <= maxPrice);
    }

    if (moveInDate && type === 'housing') {
      filtered = filtered.filter(l => l.available_from && new Date(l.available_from) >= new Date(moveInDate));
    }
    if (moveOutDate && type === 'housing') {
      filtered = filtered.filter(l => l.available_to && new Date(l.available_to) <= new Date(moveOutDate));
    }

    if (type === 'housing') {
      const activeTypes = Object.entries(housingTypes).filter(([, v]) => v).map(([k]) => k);
      if (activeTypes.length > 0) {
        filtered = filtered.filter(l => l.housing_type && activeTypes.includes(l.housing_type.toLowerCase()));
      }
    }

    if (type === 'marketplace') {
      const activeCats = Object.entries(categories).filter(([, v]) => v).map(([k]) => k);
      if (activeCats.length > 0) {
        filtered = filtered.filter(l => l.category && activeCats.includes(l.category.toLowerCase()));
      }
      const activeConds = Object.entries(conditions).filter(([, v]) => v).map(([k]) => k);
      if (activeConds.length > 0) {
        filtered = filtered.filter(l => {
          if (!l.condition) return false;
          const cond = l.condition.toLowerCase();
          if (activeConds.includes('new') && cond === 'new') return true;
          if (activeConds.includes('used') && cond.startsWith('used')) return true;
          return false;
        });
      }
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'move-in':
        if (type === 'housing') {
          filtered.sort((a, b) => {
            if (!a.available_from) return 1;
            if (!b.available_from) return -1;
            return new Date(a.available_from).getTime() - new Date(b.available_from).getTime();
          });
        }
        break;
    }

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setMaxPrice(type === 'housing' ? 2000 : 1000);
    setMoveInDate('');
    setMoveOutDate('');
    setHousingTypes({ house: false, apartment: false });
    setCategories({ furniture: false, electronics: false, books: false });
    setConditions({ new: false, used: false });
    setSearchQuery('');
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Page Header */}
      <div className="w-full" style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px 32px 48px' }}>
          <h1 className="font-bold" style={{ fontSize: '56px', color: '#0F172A', marginBottom: '16px', lineHeight: '1.1' }}>
            {type === 'housing' ? 'Housing' : 'Marketplace'}
          </h1>
          <p className="font-normal" style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6' }}>
            {type === 'housing'
              ? 'Find verified housing from RIT students. No scams, no strangers.'
              : 'Furniture, electronics, and student deals at RIT'}
          </p>

          {/* Search and Sort */}
          <div className="flex items-center" style={{ gap: '16px', marginTop: '32px' }}>
            <div
              className="flex-1 flex items-center bg-white"
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', gap: '8px' }}
            >
              <Search size={20} style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder={type === 'housing' ? 'Search by location, type, or keywords...' : 'Search items...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: '16px', color: '#111827', backgroundColor: 'transparent', border: 'none' }}
              />
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <SlidersHorizontal size={20} style={{ color: '#6B7280' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="outline-none"
                style={{
                  fontSize: '16px', color: '#111827', padding: '12px 16px',
                  borderRadius: '8px', border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF', cursor: 'pointer'
                }}
              >
                <option value="newest">{type === 'housing' ? 'Newest First' : 'Newest'}</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                {type === 'housing' && <option value="move-in">Move-in Date</option>}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px' }}>
        <div className="flex" style={{ gap: '32px' }}>
          {/* Sidebar Filters */}
          <div className="flex-shrink-0 hidden md:block" style={{ width: type === 'housing' ? '280px' : '240px' }}>
            <div
              className="bg-white sticky"
              style={{ top: '96px', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}
            >
              <h3 className="font-semibold" style={{ fontSize: '20px', color: '#111827', marginBottom: '24px' }}>
                Filters
              </h3>

              {/* Max Price */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <label className="font-bold" style={{ fontSize: '14px', color: '#111827' }}>Max Price</label>
                  <span className="font-semibold" style={{ fontSize: '16px', color: '#F76902' }}>
                    ${maxPrice >= (type === 'housing' ? 2500 : 1000) ? `${type === 'housing' ? '2500' : '1000'}+` : maxPrice}
                    {type === 'housing' ? '/month' : ''}
                  </span>
                </div>
                <input
                  type="range" min="0" max={type === 'housing' ? '2500' : '1000'}
                  step={type === 'housing' ? '50' : '25'}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full" style={{ accentColor: '#F76902', cursor: 'pointer' }}
                />
              </div>

              {type === 'housing' && (
                <>
                  {/* Move-in Date */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="font-bold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '8px' }}>
                      Move-in Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                      <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full outline-none"
                        style={{ fontSize: '15px', color: '#111827', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
                      />
                    </div>
                  </div>
                  {/* Move-out Date */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="font-bold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '8px' }}>
                      Move-out Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                      <input type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)}
                        className="w-full outline-none"
                        style={{ fontSize: '15px', color: '#111827', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
                      />
                    </div>
                  </div>
                  {/* Housing Type */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="font-bold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '10px' }}>Housing Type</label>
                    <div className="flex flex-col" style={{ gap: '10px' }}>
                      {Object.entries(housingTypes).map(([key, checked]) => (
                        <label key={key} className="flex items-center cursor-pointer" style={{ fontSize: '15px', color: '#374151' }}>
                          <input type="checkbox" checked={checked}
                            onChange={() => setHousingTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className="cursor-pointer"
                            style={{ width: '16px', height: '16px', marginRight: '10px', accentColor: '#F76902' }}
                          />
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {type === 'marketplace' && (
                <>
                  {/* Category */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="font-bold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '10px' }}>Category</label>
                    <div className="flex flex-col" style={{ gap: '10px' }}>
                      {Object.entries(categories).map(([key, checked]) => (
                        <label key={key} className="flex items-center cursor-pointer" style={{ fontSize: '15px', color: '#374151' }}>
                          <input type="checkbox" checked={checked}
                            onChange={() => setCategories(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className="cursor-pointer"
                            style={{ width: '16px', height: '16px', marginRight: '10px', accentColor: '#F76902' }}
                          />
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Condition */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="font-bold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '10px' }}>Condition</label>
                    <div className="flex flex-col" style={{ gap: '10px' }}>
                      {Object.entries(conditions).map(([key, checked]) => (
                        <label key={key} className="flex items-center cursor-pointer" style={{ fontSize: '15px', color: '#374151' }}>
                          <input type="checkbox" checked={checked}
                            onChange={() => setConditions(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className="cursor-pointer"
                            style={{ width: '16px', height: '16px', marginRight: '10px', accentColor: '#F76902' }}
                          />
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                className="w-full font-medium hover:opacity-70 transition-opacity"
                style={{
                  padding: '10px 12px', fontSize: '14px', color: '#6B7280',
                  backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer'
                }}
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center" style={{ padding: '48px' }}>
                <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center" style={{ padding: '48px' }}>
                <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '16px' }}>No listings found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '10px 20px', fontSize: '14px', color: '#F76902',
                    backgroundColor: '#FEF3EC', border: '1px solid #F76902',
                    borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${type === 'housing' ? '320px' : '280px'}, 1fr))`, gap: '24px' }}
              >
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white cursor-pointer group"
                    style={{
                      borderRadius: '12px', border: '1px solid #E5E7EB',
                      overflow: 'hidden', transition: 'all 0.15s ease-out'
                    }}
                    onClick={() => onView(listing)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ width: '100%', height: type === 'housing' ? '260px' : '240px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                      <ImageWithFallback
                        src={listing.listing_images?.[0]?.url || ''}
                        alt={listing.title}
                        className="group-hover:scale-105"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.15s ease-out' }}
                      />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 className="font-semibold" style={{ fontSize: '18px', color: '#111827', marginBottom: type === 'housing' ? '12px' : '8px', lineHeight: '1.3' }}>
                        {listing.title}
                      </h3>
                      <div className="font-bold" style={{ fontSize: '28px', color: '#F76902', marginBottom: type === 'housing' ? '4px' : '8px', lineHeight: '1.2' }}>
                        ${listing.price}
                        {type === 'housing' && (
                          <span className="font-normal" style={{ fontSize: '16px', color: '#9CA3AF' }}>/mo</span>
                        )}
                      </div>

                      {type === 'housing' && (
                        <>
                          <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                            {listing.location || 'Near RIT'}
                          </p>
                          <div className="flex flex-col" style={{ gap: '6px', marginBottom: '20px' }}>
                            <p className="font-normal" style={{ fontSize: '14px', color: '#9CA3AF' }}>
                              {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bed`} · {listing.bathrooms} bath
                              {listing.housing_type ? ` · ${listing.housing_type}` : ''}
                            </p>
                            {listing.available_from && (
                              <p className="font-normal" style={{ fontSize: '14px', color: '#9CA3AF' }}>
                                Available {new Date(listing.available_from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {type === 'marketplace' && listing.condition && (
                        <p className="font-normal" style={{ fontSize: '14px', color: '#9CA3AF' }}>
                          {listing.condition}
                        </p>
                      )}

                      <button
                        className="w-full font-semibold transition-all"
                        style={{
                          backgroundColor: '#F76902', color: '#FFFFFF',
                          padding: '12px 20px', borderRadius: '8px', fontSize: '15px',
                          border: 'none', cursor: 'pointer', marginTop: type === 'marketplace' ? '16px' : '0'
                        }}
                        onClick={(e) => { e.stopPropagation(); onContact(listing); }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E65F00'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; }}
                      >
                        Contact Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
