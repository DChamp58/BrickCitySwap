import { useState, useEffect } from 'react';
import { Heart, Eye, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useSaved } from './saved-context';
import { useAuth } from './auth-context';
import { fetchSavedListings } from '@/lib/api';
import { Listing } from './listing-card';

interface SavedViewProps {
  onView: (listing: Listing) => void;
  onContact: (listing: Listing) => void;
}

type Tab = 'all' | 'housing' | 'marketplace';

export function SavedView({ onView, onContact }: SavedViewProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchSavedListings(user.id)
      .then((rows) => {
        // Each row has shape { listing_id, listings: { ...listing data } }
        const mapped = rows
          .map((row: { listing_id: string; listings: unknown }) => row.listings)
          .filter(Boolean) as Listing[];
        setListings(mapped);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [user]);

  // When a listing gets unsaved, remove it from the local list
  const handleUnsave = async (listing: Listing) => {
    await toggleSave(listing.id);
    setListings(prev => prev.filter(l => l.id !== listing.id));
  };

  const filtered = listings.filter(l => {
    if (activeTab === 'all') return true;
    return l.type === activeTab;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'housing', label: 'Housing' },
    { key: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFF6EE' }}>
      {/* Page Header */}
      <div className="w-full" style={{ backgroundColor: '#FFF6EE', borderBottom: '1px solid #E8D5C4' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12" style={{ paddingTop: '32px', paddingBottom: '24px' }}>
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
            <Heart size={28} style={{ color: '#F76902', fill: '#F76902' }} />
            <h1 className="font-bold text-4xl md:text-5xl" style={{ color: '#402E32', lineHeight: '1.1' }}>
              Saved Items
            </h1>
          </div>
          <p className="font-normal text-sm md:text-base" style={{ color: '#B5866E', lineHeight: '1.6' }}>
            {loading ? 'Loading…' : `${listings.length} saved listing${listings.length !== 1 ? 's' : ''}`}
          </p>

          {/* Tabs */}
          <div className="flex" style={{ gap: '4px', marginTop: '20px' }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="font-medium transition-all"
                style={{
                  padding: '8px 20px', borderRadius: '100px', fontSize: '14px',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: activeTab === key ? '#F76902' : '#FFFFFF',
                  color: activeTab === key ? '#FFFFFF' : '#B5866E',
                  boxShadow: activeTab === key ? '0 2px 8px rgba(247,105,2,0.25)' : '0 1px 3px rgba(64,46,50,0.06)',
                }}
              >
                {label}
                {key !== 'all' && (
                  <span style={{ marginLeft: '6px', fontSize: '12px', opacity: 0.8 }}>
                    ({listings.filter(l => l.type === key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        {loading ? (
          <div className="text-center" style={{ padding: '64px 0' }}>
            <p style={{ fontSize: '16px', color: '#B5866E' }}>Loading saved items…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '80px 0', gap: '20px' }}>
            <div
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: '#FFFFFF', border: '2px solid #E8D5C4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Heart size={32} style={{ color: '#E8D5C4' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ fontSize: '22px', color: '#402E32', marginBottom: '8px' }}>
                {activeTab === 'all' ? 'No saved listings yet' : `No saved ${activeTab} listings`}
              </h2>
              <p style={{ fontSize: '15px', color: '#B5866E', maxWidth: '340px' }}>
                Browse listings and tap the{' '}
                <Heart size={13} style={{ display: 'inline', color: '#F76902', fill: '#F76902', verticalAlign: 'middle' }} />{' '}
                heart icon to save items here.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '20px',
            }}
          >
            {filtered.map((listing) => {
              const isHovered = hoveredId === listing.id;
              const saved = isSaved(listing.id);
              return (
                <div
                  key={listing.id}
                  className="bg-white cursor-pointer"
                  style={{
                    borderRadius: '12px',
                    border: isHovered ? '1.5px solid rgba(247,105,2,0.4)' : '1px solid #E8D5C4',
                    overflow: 'hidden',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '0 12px 28px rgba(247,105,2,0.12), 0 4px 10px rgba(64,46,50,0.06)'
                      : '0 1px 3px rgba(64,46,50,0.06)',
                    transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                  }}
                  onClick={() => onView(listing)}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#F3F4F6', position: 'relative' }}>
                    {listing.listing_images?.[0]?.url ? (
                      <ImageWithFallback
                        src={listing.listing_images[0].url}
                        alt={listing.title}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                          transition: 'transform 280ms ease',
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                        <Package size={40} style={{ color: '#E8D5C4' }} />
                      </div>
                    )}
                    {/* Type badge */}
                    <div
                      style={{
                        position: 'absolute', top: '10px', left: '10px',
                        backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '6px',
                        padding: '3px 10px', fontSize: '12px', fontWeight: 600,
                        color: '#402E32',
                      }}
                    >
                      {listing.type === 'housing' ? 'Housing' : listing.category || 'Marketplace'}
                    </div>
                    {/* Heart button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUnsave(listing); }}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '34px', height: '34px', borderRadius: '50%',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                        transition: 'transform 150ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      title="Remove from saved"
                    >
                      <Heart size={16} style={{ color: '#F76902', fill: saved ? '#F76902' : 'none' }} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 20px' }}>
                    <h3
                      className="font-semibold"
                      style={{
                        fontSize: '16px', marginBottom: '6px', lineHeight: '1.3',
                        color: isHovered ? '#F76902' : '#402E32',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        transition: 'color 180ms ease',
                      }}
                    >
                      {listing.title}
                    </h3>
                    <div className="font-bold" style={{ fontSize: '22px', color: '#F76902', marginBottom: '8px' }}>
                      ${listing.price}
                      {listing.type === 'housing' && (
                        <span className="font-normal" style={{ fontSize: '14px', color: '#C4A88E' }}>/mo</span>
                      )}
                    </div>

                    {listing.type === 'housing' && listing.location && (
                      <p style={{ fontSize: '13px', color: '#B5866E', marginBottom: '4px' }}>
                        {listing.location}
                      </p>
                    )}

                    <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                      <div className="flex items-center" style={{ gap: '4px' }}>
                        <Eye size={13} style={{ color: '#B5866E' }} />
                        <span style={{ fontSize: '12px', color: '#B5866E' }}>{listing.view_count ?? 0} views</span>
                      </div>
                      {listing.type === 'marketplace' && listing.condition && (
                        <span style={{ fontSize: '12px', color: '#B5866E' }}>{listing.condition}</span>
                      )}
                    </div>

                    <button
                      className="w-full font-semibold transition-all"
                      style={{
                        marginTop: '14px',
                        backgroundColor: '#F76902', color: '#FFFFFF',
                        padding: '10px 16px', borderRadius: '8px', fontSize: '14px',
                        border: 'none', cursor: 'pointer',
                      }}
                      onClick={(e) => { e.stopPropagation(); onContact(listing); }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; }}
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
