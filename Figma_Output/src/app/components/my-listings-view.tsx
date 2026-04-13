import { useState, useEffect } from 'react';
import { Trash2, Eye, RotateCcw, Pencil } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Listing } from './listing-card';
import { useAuth } from './auth-context';
import { fetchMyListings as fetchMyListingsApi, updateListing, deleteListing } from '@/lib/api';
import { toast } from 'sonner';
import { EditListingDialog } from './edit-listing-dialog';

interface MyListingsViewProps {
  accessToken: string | null;
  onView: (listing: Listing) => void;
}

export function MyListingsView({ accessToken, onView }: MyListingsViewProps) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllListings, setShowAllListings] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

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
    <div className="w-full min-h-screen px-4 md:px-6 py-8 md:py-12" style={{ backgroundColor: '#FFF6EE' }}>
      <div className="mx-auto" style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl md:text-6xl" style={{ color: '#402E32', marginBottom: '8px', lineHeight: '1.1' }}>
              My Listings
            </h1>
            <p className="font-normal text-sm md:text-base" style={{ color: '#B5866E', lineHeight: '1.6' }}>
              Manage your posted items
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))' }}>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '8px' }}>Active Listings</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#402E32' }}>{activeCount}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '8px' }}>Total Listings</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#402E32' }}>{listings.length}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '8px' }}>Sold</p>
            <p className="font-bold" style={{ fontSize: '32px', color: '#402E32' }}>{listings.filter(l => l.status === 'sold').length}</p>
          </div>
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '6px', marginBottom: '8px' }}>
              <Eye size={16} style={{ color: '#B5866E' }} />
              <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E' }}>Total Views</p>
            </div>
            <p className="font-bold" style={{ fontSize: '32px', color: '#402E32' }}>{totalViews}</p>
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
          <label htmlFor="show-all" style={{ fontSize: '14px', color: '#B5866E', cursor: 'pointer' }}>
            Show all listings (including sold)
          </label>
        </div>

        {/* Listings Table */}
        {loading ? (
          <div className="text-center" style={{ padding: '48px' }}>
            <p style={{ fontSize: '16px', color: '#B5866E' }}>Loading your listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white text-center" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '48px' }}>
            <p style={{ fontSize: '16px', color: '#B5866E', marginBottom: '16px' }}>
              {showAllListings ? "You haven't created any listings yet" : "No active listings"}
            </p>
            <p style={{ fontSize: '14px', color: '#C4A88E' }}>
              Click "Post" in the navigation to create your first listing
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table — hidden on mobile */}
            <div className="hidden md:block bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', overflow: 'hidden' }}>
              {/* Table Header */}
              <div
                className="grid items-center"
                style={{
                  gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr auto',
                  padding: '12px 24px', borderBottom: '1px solid #E8D5C4',
                  backgroundColor: '#FFF6EE', gap: '16px'
                }}
              >
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Listing</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Views</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
                <span className="font-semibold" style={{ fontSize: '12px', color: '#B5866E', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Actions</span>
              </div>

              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{
                    gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr auto',
                    padding: '16px 24px', borderBottom: '1px solid #E8D5C4', gap: '16px'
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
                      <p className="font-medium" style={{ fontSize: '15px', color: '#402E32', marginBottom: '4px' }}>
                        {listing.title}
                      </p>
                      <p className="font-normal" style={{ fontSize: '13px', color: '#C4A88E' }}>
                        Posted {new Date(listing.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-normal" style={{ fontSize: '14px', color: '#B5866E' }}>
                    {listing.type === 'housing' ? 'Housing' : 'Marketplace'}
                  </span>
                  <span className="font-semibold" style={{ fontSize: '15px', color: '#402E32' }}>
                    ${listing.price}{listing.type === 'housing' ? '/mo' : ''}
                  </span>
                  <div className="flex items-center justify-center" style={{ gap: '4px' }}>
                    <Eye size={13} style={{ color: '#B5866E' }} />
                    <span className="font-medium" style={{ fontSize: '14px', color: '#5A4A44' }}>
                      {listing.view_count ?? 0}
                    </span>
                  </div>
                  <span
                    className="font-medium inline-block"
                    style={{
                      fontSize: '13px',
                      color: listing.status === 'available' ? '#059669' : listing.status === 'sold' ? '#B5866E' : '#D97706',
                      backgroundColor: listing.status === 'available' ? '#D1FAE5' : listing.status === 'sold' ? '#F3F4F6' : '#FEF3C7',
                      padding: '4px 12px', borderRadius: '12px',
                      textTransform: 'capitalize', width: 'fit-content'
                    }}
                  >
                    {listing.status}
                  </span>
                  <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                    {listing.status === 'available' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'sold'); }}
                        className="flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '13px', color: '#059669' }}
                        title="Mark as Sold"
                      >Sold</button>
                    )}
                    {listing.status === 'sold' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'available'); }}
                        className="flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '13px', color: '#3B82F6' }}
                        title="Relist"
                      >
                        <RotateCcw size={14} style={{ marginRight: '4px' }} />Relist
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setEditingListing(listing); }} className="flex items-center justify-center hover:opacity-70 transition-opacity" style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer' }} title="Edit">
                      <Pencil size={14} style={{ color: '#F76902' }} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(listing.id); }} className="flex items-center justify-center hover:opacity-70 transition-opacity" style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={14} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile card list — hidden on desktop */}
            <div className="flex flex-col md:hidden" style={{ gap: '12px' }}>
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white cursor-pointer"
                  style={{ borderRadius: '12px', border: '1px solid #E8D5C4', overflow: 'hidden' }}
                  onClick={() => onView(listing)}
                >
                  <div className="flex" style={{ gap: '0' }}>
                    {/* Thumbnail */}
                    <div style={{ width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                      <ImageWithFallback
                        src={listing.listing_images?.[0]?.url || ''}
                        alt={listing.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between" style={{ padding: '12px 14px' }}>
                      <div>
                        <p className="font-semibold" style={{ fontSize: '15px', color: '#402E32', marginBottom: '2px', lineHeight: '1.3' }}>
                          {listing.title}
                        </p>
                        <p className="font-medium" style={{ fontSize: '14px', color: '#F76902' }}>
                          ${listing.price}{listing.type === 'housing' ? '/mo' : ''}
                        </p>
                      </div>
                      <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <span
                            className="font-medium"
                            style={{
                              fontSize: '12px',
                              color: listing.status === 'available' ? '#059669' : listing.status === 'sold' ? '#B5866E' : '#D97706',
                              backgroundColor: listing.status === 'available' ? '#D1FAE5' : listing.status === 'sold' ? '#F3F4F6' : '#FEF3C7',
                              padding: '3px 10px', borderRadius: '10px', textTransform: 'capitalize'
                            }}
                          >{listing.status}</span>
                          <div className="flex items-center" style={{ gap: '3px' }}>
                            <Eye size={12} style={{ color: '#B5866E' }} />
                            <span style={{ fontSize: '12px', color: '#B5866E' }}>{listing.view_count ?? 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: '6px' }}>
                          {listing.status === 'available' && (
                            <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'sold'); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '12px', color: '#059669' }}>Sold</button>
                          )}
                          {listing.status === 'sold' && (
                            <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(listing, 'available'); }} className="flex items-center" style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '12px', color: '#3B82F6', gap: '4px' }}>
                              <RotateCcw size={12} />Relist
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setEditingListing(listing); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pencil size={12} style={{ color: '#F76902' }} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(listing.id); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <EditListingDialog
        open={editingListing !== null}
        onClose={() => setEditingListing(null)}
        listing={editingListing}
        onListingUpdated={(updated) => {
          setListings(listings.map(l => l.id === updated.id ? updated : l));
          setEditingListing(null);
        }}
      />
    </div>
  );
}
