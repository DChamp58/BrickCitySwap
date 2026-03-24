import { useState, useEffect } from 'react';
import { Trash2, Eye, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Listing } from './listing-card';
import { useAuth } from './auth-context';
import { fetchMyListings as fetchMyListingsApi, updateListing, deleteListing } from '@/lib/api';
import { toast } from 'sonner';

interface MyListingsViewProps {
  accessToken: string | null;
  onView: (listing: Listing) => void;
}

export function MyListingsView({ accessToken, onView }: MyListingsViewProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllListings, setShowAllListings] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyListings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchMyListingsApi(user.id);
      setListings(data as Listing[]);
    } catch (error) {
      console.error('Failed to fetch my listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      await deleteListing(listingId);
      toast.success('Listing deleted successfully');
      setListings(listings.filter(l => l.id !== listingId));
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  const handleUpdateStatus = async (listing: Listing, newStatus: 'available' | 'pending' | 'sold') => {
    try {
      await updateListing(listing.id, { status: newStatus });
      setListings(listings.map(l => l.id === listing.id ? { ...l, status: newStatus } : l));
      toast.success(newStatus === 'sold' ? 'Listing marked as sold' : newStatus === 'available' ? 'Listing relisted successfully' : 'Status updated');
    } catch {
      toast.error('Failed to update listing');
    }
  };

  const filteredListings = showAllListings ? listings : listings.filter(l => l.status !== 'sold');
  const activeCount = listings.filter(l => l.status === 'available').length;
  const totalViews = listings.reduce((sum, l) => sum + (l.view_count ?? 0), 0);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F9FAFB', padding: '48px 24px' }}>
      <div className="mx-auto" style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold" style={{ fontSize: '56px', color: '#0F172A', marginBottom: '8px', lineHeight: '1.1' }}>
              My Listings
            </h1>
            <p className="font-normal" style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6' }}>
              Manage your posted items
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-[24px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Active Listings</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#111827' }}>{activeCount}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Total Listings</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#111827' }}>{listings.length}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Sold</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#111827' }}>{listings.filter(l => l.status === 'sold').length}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '6px', marginBottom: '8px' }}>
              <Eye size={16} style={{ color: '#6B7280' }} />
              <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280' }}>Total Views</p>
            </div>
            <p className="font-bold" style={{ fontSize: '32px', color: '#111827' }}>{totalViews}</p>
          </div>
        </div>

        {/* Show All Toggle */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          <input
            type="checkbox"
            id="show-all"
            checked={showAllListings}
            onChange={(e) => setShowAllListings(e.target.checked)}
            style={{ accentColor: '#F76902', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="show-all" style={{ fontSize: '14px', color: '#6B7280', cursor: 'pointer' }}>
            Show all listings (including sold)
          </label>
        </div>

        {/* Listings Table */}
        {loading ? (
          <div className="text-center" style={{ padding: '48px' }}>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading your listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white text-center" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '48px' }}>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '16px' }}>
              {showAllListings ? "You haven't created any listings yet" : "No active listings"}
            </p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              Click "Post" in the navigation to create your first listing
            </p>
          </div>
        ) : (
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr auto',
                padding: '16px 24px', borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB', gap: '16px'
              }}
            >
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Listing</span>
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Category</span>
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Price</span>
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Views</span>
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Status</span>
              <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>Actions</span>
            </div>

            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
                style={{
                  gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr auto',
                  padding: '16px 24px', borderBottom: '1px solid #E5E7EB', gap: '16px'
                }}
                onClick={() => onView(listing)}
              >
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px', backgroundColor: '#F3F4F6' }}>
                    <ImageWithFallback
                      src={listing.listing_images?.[0]?.url || ''}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <p className="font-medium" style={{ fontSize: '15px', color: '#111827', marginBottom: '4px' }}>
                      {listing.title}
                    </p>
                    <p className="font-normal" style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      Posted {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-normal" style={{ fontSize: '14px', color: '#6B7280' }}>
                  {listing.type === 'housing' ? 'Housing' : 'Marketplace'}
                </span>
                <span className="font-semibold" style={{ fontSize: '15px', color: '#111827' }}>
                  ${listing.price}{listing.type === 'housing' ? '/mo' : ''}
                </span>
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <Eye size={14} style={{ color: '#6B7280' }} />
                  <span className="font-medium" style={{ fontSize: '14px', color: '#374151' }}>
                    {listing.view_count ?? 0}
                  </span>
                </div>
                <span
                  className="font-medium inline-block"
                  style={{
                    fontSize: '13px',
                    color: listing.status === 'available' ? '#059669' : listing.status === 'sold' ? '#6B7280' : '#D97706',
                    backgroundColor: listing.status === 'available' ? '#D1FAE5' : listing.status === 'sold' ? '#F3F4F6' : '#FEF3C7',
                    padding: '4px 12px', borderRadius: '12px',
                    textTransform: 'capitalize', width: 'fit-content'
                  }}
                >
                  {listing.status}
                </span>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  {listing.status === 'available' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'sold'); }}
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                      style={{
                        padding: '6px 12px', borderRadius: '6px',
                        border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
                        cursor: 'pointer', fontSize: '13px', color: '#059669'
                      }}
                      title="Mark as Sold"
                    >
                      Sold
                    </button>
                  )}
                  {listing.status === 'sold' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'available'); }}
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                      style={{
                        padding: '6px 12px', borderRadius: '6px',
                        border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
                        cursor: 'pointer', fontSize: '13px', color: '#3B82F6'
                      }}
                      title="Relist"
                    >
                      <RotateCcw size={14} style={{ marginRight: '4px' }} />
                      Relist
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(listing.id); }}
                    className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', cursor: 'pointer'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
