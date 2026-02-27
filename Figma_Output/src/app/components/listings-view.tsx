import React, { useState, useEffect } from 'react';
import { ListingCard, Listing } from './listing-card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { FilterSidebar, Filters } from './filter-sidebar';

interface ListingsViewProps {
  type: 'housing' | 'marketplace';
  onContact: (listing: Listing) => void;
  onView: (listing: Listing) => void;
}

export function ListingsView({ type, onContact, onView }: ListingsViewProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [showSoldListings, setShowSoldListings] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceMin: '',
    priceMax: '',
    moveInDate: '',
    moveOutDate: '',
    distanceFromCampus: '',
    roommateGender: '',
    housingTypes: [],
    bedrooms: '',
  });

  useEffect(() => {
    fetchListings();
  }, [type]);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchTerm, sortBy, filters, showSoldListings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // No listings - empty state
      setListings([]);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Filter out sold listings by default (unless showSoldListings is true)
    if (!showSoldListings) {
      filtered = filtered.filter(listing => listing.status !== 'sold');
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (listing.location && listing.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Price range filter
    if (filters.priceMin) {
      filtered = filtered.filter(listing => listing.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(listing => listing.price <= parseFloat(filters.priceMax));
    }

    // Move-in date filter
    if (filters.moveInDate && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.moveInDate) return false;
        return new Date(listing.moveInDate) >= new Date(filters.moveInDate);
      });
    }

    // Move-out date filter
    if (filters.moveOutDate && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.moveOutDate) return false;
        return new Date(listing.moveOutDate) <= new Date(filters.moveOutDate);
      });
    }

    // Distance from campus filter
    if (filters.distanceFromCampus && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.distanceFromCampus) return true;
        const distance = listing.distanceFromCampus;
        
        switch (filters.distanceFromCampus) {
          case 'walking':
            return distance <= 0.5;
          case '<1':
            return distance < 1;
          case '1-3':
            return distance >= 1 && distance <= 3;
          case '3+':
            return distance > 3;
          default:
            return true;
        }
      });
    }

    // Roommate gender filter
    if (filters.roommateGender && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.roommateGender) return true;
        return listing.roommateGender === filters.roommateGender;
      });
    }

    // Housing type filter
    if (filters.housingTypes.length > 0 && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.housingType) return false;
        return filters.housingTypes.includes(listing.housingType);
      });
    }

    // Bedrooms filter
    if (filters.bedrooms && type === 'housing') {
      filtered = filtered.filter(listing => {
        if (!listing.bedrooms) return false;
        if (filters.bedrooms === 'studio') return listing.bedrooms === 0;
        if (filters.bedrooms === '3+') return listing.bedrooms >= 3;
        return listing.bedrooms === parseInt(filters.bedrooms);
      });
    }

    // Sort listings
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'move-in':
        if (type === 'housing') {
          filtered.sort((a, b) => {
            if (!a.moveInDate) return 1;
            if (!b.moveInDate) return -1;
            return new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime();
          });
        }
        break;
    }

    setFilteredListings(filtered);
  };

  const activeFilterCount = 
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.moveInDate ? 1 : 0) +
    (filters.moveOutDate ? 1 : 0) +
    (filters.distanceFromCampus ? 1 : 0) +
    (filters.roommateGender ? 1 : 0) +
    filters.housingTypes.length +
    (filters.bedrooms ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {type === 'housing' ? '🏠 Housing Listings' : '🛍️ Marketplace'}
        </h1>
        <p className="text-muted-foreground">
          {type === 'housing' 
            ? 'Find your perfect sublease for co-op or semester housing'
            : 'Buy and sell items within the RIT community'}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - Desktop */}
        {type === 'housing' && (
          <aside className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search and Sort Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mobile Filter Button */}
              {type === 'housing' && (
                <Button
                  variant="outline"
                  onClick={() => setFilterSidebarOpen(true)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 bg-[#F76902] text-white rounded-full px-2 py-0.5 text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  {type === 'housing' && (
                    <SelectItem value="move-in">Move-in Date: Soonest</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredListings.length} of {listings.length} listings
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    priceMin: '',
                    priceMax: '',
                    moveInDate: '',
                    moveOutDate: '',
                    distanceFromCampus: '',
                    roommateGender: '',
                    housingTypes: [],
                    bedrooms: '',
                  })}
                  className="text-[#F76902] hover:text-[#D85802]"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No listings found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    priceMin: '',
                    priceMax: '',
                    moveInDate: '',
                    moveOutDate: '',
                    distanceFromCampus: '',
                    roommateGender: '',
                    housingTypes: [],
                    bedrooms: '',
                  });
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onContact={onContact}
                  onView={onView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {type === 'housing' && filterSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-xl">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setFilterSidebarOpen(false)}
              isOpen={filterSidebarOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}