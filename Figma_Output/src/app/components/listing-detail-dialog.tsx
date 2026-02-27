import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Listing } from './listing-card';
import { MapPin, DollarSign, Calendar, User, MessageCircle, Package } from 'lucide-react';

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
  if (!listing) return null;

  const isHousing = listing.type === 'housing';

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
          {/* Price */}
          <div className="flex items-center gap-2 text-3xl font-bold text-[#F76902]">
            <DollarSign className="w-8 h-8" />
            {listing.price}{isHousing ? '/month' : ''}
          </div>

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

              {listing.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}, {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}

              {listing.availableFrom && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>
                    Available: {new Date(listing.availableFrom).toLocaleDateString()} 
                    {listing.availableTo && ` - ${new Date(listing.availableTo).toLocaleDateString()}`}
                  </span>
                </div>
              )}

              {listing.gender && listing.gender !== 'any' && (
                <div>
                  <Badge variant="outline" className="capitalize">
                    {listing.gender} preferred
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
            Posted on {new Date(listing.createdAt).toLocaleDateString()}
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
