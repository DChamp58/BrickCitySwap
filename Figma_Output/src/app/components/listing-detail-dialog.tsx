import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Listing } from './listing-card';
import { MapPin, DollarSign, Calendar, User, MessageCircle, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ListingDetailDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onContact: (listing: Listing) => void;
  showContactButton?: boolean;
}

export function ListingDetailDialog({
  open,
  onClose,
  listing,
  onContact,
  showContactButton = true
}: ListingDetailDialogProps) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (open && listing) {
      trackEvent('listing_viewed', { listing_id: listing.id, listing_type: listing.type, listing_title: listing.title });
    }
  }, [open, listing?.id]);

  if (!listing) return null;

  const isHousing = listing.type === 'housing';
  const images = listing.listing_images ?? [];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setImgIdx(0); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{listing.title}</DialogTitle>
            <Badge variant={isHousing ? 'default' : 'secondary'}>
              {isHousing ? 'Housing' : listing.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={images[imgIdx]?.url}
                alt={listing.title}
                className="w-full h-64 object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 text-3xl font-bold text-[#F76902]" >
            <DollarSign className="w-8 h-8" />
            {listing.price}{isHousing ? '/month' : ''}
          </div>

          {/* Seller */}
          {listing.profiles?.full_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              Posted by {listing.profiles.full_name}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Housing Details */}
          {isHousing && (
            <div className="space-y-4">
              <h3 className="font-semibold">Housing Details</h3>

              {listing.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>{listing.location}</span>
                </div>
              )}

              {listing.bedrooms != null && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}, {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}

              {listing.available_from && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>
                    Available: {new Date(listing.available_from).toLocaleDateString()}
                    {listing.available_to && ` - ${new Date(listing.available_to).toLocaleDateString()}`}
                  </span>
                </div>
              )}

              {listing.gender_pref && listing.gender_pref !== 'any' && (
                <div>
                  <Badge variant="outline" className="capitalize">
                    {listing.gender_pref} preferred
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Marketplace Details */}
          {!isHousing && (
            <div className="space-y-4">
              <h3 className="font-semibold">Item Details</h3>

              {listing.category && (
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="capitalize">{listing.category}</span>
                </div>
              )}

              {listing.condition && (
                <div>
                  <span className="text-muted-foreground">Condition: </span>
                  <Badge variant="outline" className="capitalize">
                    {listing.condition}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-sm text-muted-foreground">
            Posted on {new Date(listing.created_at).toLocaleDateString()}
          </div>

          {/* Contact Button */}
          {showContactButton && (
            <Button
              onClick={() => {
                onContact(listing);
                onClose();
              }}
              className="w-full bg-[#F76902] hover:bg-[#D85802]"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Seller
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
