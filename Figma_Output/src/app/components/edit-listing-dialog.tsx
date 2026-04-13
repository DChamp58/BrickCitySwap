import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { updateListing } from '@/lib/api';
import { Listing } from './listing-card';

interface EditListingDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onListingUpdated: (updated: Listing) => void;
}

export function EditListingDialog({ open, onClose, listing, onListingUpdated }: EditListingDialogProps) {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [gender, setGender] = useState('any');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');

  // Populate fields whenever the listing changes
  useEffect(() => {
    if (!listing) return;
    setTitle(listing.title ?? '');
    setDescription(listing.description ?? '');
    setPrice(String(listing.price ?? ''));
    setLocation(listing.location ?? '');
    setBedrooms(listing.bedrooms != null ? String(listing.bedrooms) : '');
    setBathrooms(listing.bathrooms != null ? String(listing.bathrooms) : '');
    setAvailableFrom(listing.available_from?.slice(0, 10) ?? '');
    setAvailableTo(listing.available_to?.slice(0, 10) ?? '');
    setGender(listing.gender_pref ?? 'any');
    setCategory(listing.category ?? '');
    setCondition(listing.condition ?? '');
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setLoading(true);
    try {
      const updates =
        listing.type === 'housing'
          ? {
              title,
              description,
              price: parseFloat(price),
              location,
              bedrooms: parseInt(bedrooms),
              bathrooms: parseFloat(bathrooms),
              available_from: availableFrom || null,
              available_to: availableTo || null,
              gender_pref: gender,
            }
          : {
              title,
              description,
              price: parseFloat(price),
              category,
              condition,
            };

      const updated = await updateListing(listing.id, updates);
      toast.success('Listing updated!');
      onListingUpdated({ ...listing, ...updated } as Listing);
      onClose();
    } catch {
      toast.error('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  const isHousing = listing.type === 'housing';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>
            Update your {isHousing ? 'housing' : 'marketplace'} listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Common fields */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">{isHousing ? 'Monthly Rent ($)' : 'Price ($)'} *</Label>
            <Input
              id="edit-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Housing-specific fields */}
          {isHousing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bedrooms">Bedrooms *</Label>
                  <Input
                    id="edit-bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bathrooms">Bathrooms *</Label>
                  <Input
                    id="edit-bathrooms"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    required
                    min="0"
                    step="0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender Preference</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-from">Available From</Label>
                  <Input
                    id="edit-from"
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-to">Available To (Optional)</Label>
                  <Input
                    id="edit-to"
                    type="date"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Marketplace-specific fields */}
          {!isHousing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="textbooks">Textbooks</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#F76902] hover:bg-[#D85802]"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
