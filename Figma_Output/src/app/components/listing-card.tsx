import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, DollarSign, Calendar, User, MessageCircle } from 'lucide-react';

export interface Listing {
  id: string;
  type: 'housing' | 'marketplace';
  title: string;
  description: string;
  price: number;
  userId: string;
  createdAt: string;
  status: 'available' | 'pending' | 'sold';
  soldDate?: string;
  
  // Housing specific
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  availableFrom?: string;
  availableTo?: string;
  gender?: 'any' | 'male' | 'female';
  moveInDate?: string;
  moveOutDate?: string;
  distanceFromCampus?: number;
  roommateGender?: string;
  housingType?: string;
  
  // Marketplace specific
  category?: string;
  condition?: string;
  imageUrl?: string;
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
      className={`hover:shadow-lg transition-shadow cursor-pointer relative ${
        isSold ? 'opacity-50' : ''
      }`}
      onClick={() => onView?.(listing)}
    >
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
            {listing.bedrooms !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                {listing.bedrooms} bed, {listing.bathrooms} bath
              </div>
            )}
            {listing.availableFrom && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(listing.availableFrom).toLocaleDateString()} - {listing.availableTo ? new Date(listing.availableTo).toLocaleDateString() : 'Ongoing'}
              </div>
            )}
            {listing.gender && listing.gender !== 'any' && (
              <Badge variant="outline" className="capitalize">{listing.gender} preferred</Badge>
            )}
          </div>
        )}
        
        {!isHousing && listing.condition && (
          <Badge variant="outline" className="capitalize">{listing.condition}</Badge>
        )}
        
        <div className="text-xs text-muted-foreground">
          Posted {new Date(listing.createdAt).toLocaleDateString()}
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