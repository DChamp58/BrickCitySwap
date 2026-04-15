import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, DollarSign, Calendar, User, MessageCircle, Eye } from 'lucide-react';

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  position: number;
}

export interface Listing {
  id: string;
  type: 'housing' | 'marketplace';
  title: string;
  description: string;
  price: number;
  user_id: string;
  school_id?: string | null;
  created_at: string;
  updated_at?: string;
  status: 'available' | 'pending' | 'sold';
  listing_images?: ListingImage[];
  profiles?: { full_name: string; avatar_url: string | null };

  // Housing specific
  location?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  available_from?: string | null;
  available_to?: string | null;
  gender_pref?: string | null;
  housing_type?: string | null;
  distance_from_campus?: number | null;

  // Marketplace specific
  category?: string | null;
  condition?: string | null;

  // Analytics
  view_count?: number;
}

interface ListingCardProps {
  listing: Listing;
  onContact?: (listing: Listing) => void;
  onView?: (listing: Listing) => void;
  showActions?: boolean;
  showStatus?: boolean;
}

export function ListingCard({ listing, onContact, onView, showActions = true, showStatus = false }: ListingCardProps) {
  const isHousing = listing.type === 'housing';
  const isSold = listing.status === 'sold';
  const thumbUrl = listing.listing_images?.[0]?.url;

  const getStatusBadge = () => {
    switch (listing.status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'sold':
        return <Badge className="bg-red-500 hover:bg-red-600">Sold</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden ${
        isSold ? 'opacity-50' : ''
      }`}
      onClick={() => onView?.(listing)}
    >
      {/* Thumbnail */}
      {thumbUrl && (
        <div className="h-40 overflow-hidden">
          <img src={thumbUrl} alt={listing.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Sold Watermark */}
      {isSold && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="transform rotate-[-45deg] bg-red-500 text-white text-4xl font-bold px-12 py-2 opacity-80">
            SOLD
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
          <div className="flex flex-col gap-1">
            {showStatus && getStatusBadge()}
            <Badge variant={isHousing ? 'default' : 'secondary'}>
              {isHousing ? 'Housing' : listing.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>

        <div className="flex items-center gap-2 text-lg font-bold text-[#F76902]">
          <DollarSign className="w-5 h-5" />
          {listing.price}{isHousing ? '/month' : ''}
        </div>

        {isHousing && (
          <div className="space-y-2">
            {listing.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </div>
            )}
            {listing.bedrooms != null && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                {listing.bedrooms} bed, {listing.bathrooms} bath
              </div>
            )}
            {listing.available_from && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(listing.available_from).toLocaleDateString()} - {listing.available_to ? new Date(listing.available_to).toLocaleDateString() : 'Ongoing'}
              </div>
            )}
            {listing.gender_pref && listing.gender_pref !== 'any' && (
              <Badge variant="outline" className="capitalize">{listing.gender_pref} preferred</Badge>
            )}
          </div>
        )}

        {!isHousing && listing.condition && (
          <Badge variant="outline" className="capitalize">{listing.condition}</Badge>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
          {listing.view_count != null && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {listing.view_count}
            </span>
          )}
        </div>
      </CardContent>

      {showActions && onContact && (
        <CardFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onContact(listing);
            }}
            className="w-full bg-[#F76902] hover:bg-[#D85802]"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
