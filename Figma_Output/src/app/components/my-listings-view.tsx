import React, { useState, useEffect } from 'react';
import { ListingCard, Listing } from './listing-card';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface MyListingsViewProps {
  accessToken: string | null;
  onView: (listing: Listing) => void;
}

export function MyListingsView({ accessToken, onView }: MyListingsViewProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllListings, setShowAllListings] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchMyListings();
    }
  }, [accessToken]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // No listings - empty state
      setListings([]);
    } catch (error) {
      console.error('Failed to fetch my listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      toast.success('Listing deleted successfully');
      setListings(listings.filter(l => l.id !== listingId));
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleUpdateStatus = async (listing: Listing, newStatus: 'available' | 'pending' | 'sold') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      const updatedListings = listings.map(l => 
        l.id === listing.id 
          ? { 
              ...l, 
              status: newStatus,
              soldDate: newStatus === 'sold' ? new Date().toISOString() : undefined
            }
          : l
      );
      
      setListings(updatedListings);
      
      const message = newStatus === 'sold' 
        ? 'Listing marked as sold' 
        : newStatus === 'available'
        ? 'Listing relisted successfully'
        : 'Listing status updated';
      toast.success(message);
    } catch (error) {
      toast.error('Failed to update listing');
    }
  };

  const filteredListings = showAllListings 
    ? listings 
    : listings.filter(l => l.status !== 'sold');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📋 My Listings</h1>
        <p className="text-muted-foreground mb-4">
          Manage your housing and marketplace listings
        </p>

        {/* Toggle for showing sold listings */}
        <div className="flex items-center gap-2">
          <Switch
            id="show-all"
            checked={showAllListings}
            onCheckedChange={setShowAllListings}
          />
          <Label htmlFor="show-all" className="cursor-pointer">
            Show all listings (including sold)
          </Label>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {showAllListings 
                ? "You haven't created any listings yet"
                : "No active listings. Toggle 'Show all listings' to see sold items."}
            </p>
            {!showAllListings && listings.length > 0 ? (
              <Button
                variant="outline"
                onClick={() => setShowAllListings(true)}
              >
                Show All Listings
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the "Post" button in the header to create your first listing
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="relative group">
              <ListingCard
                listing={listing}
                onView={onView}
                showActions={false}
                showStatus={true}
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {listing.status === 'available' && (
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(listing, 'sold');
                    }}
                  >
                    Mark as Sold
                  </Button>
                )}
                {listing.status === 'sold' && (
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(listing, 'available');
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Relist
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(listing.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {listing.soldDate && (
                <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  Sold on {new Date(listing.soldDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}