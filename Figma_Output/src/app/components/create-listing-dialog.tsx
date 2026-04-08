import React, { useState, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { useAuth } from './auth-context';
import { createListing, uploadListingImage } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { ImagePlus, X } from 'lucide-react';

interface CreateListingDialogProps {
  open: boolean;
  onClose: () => void;
  accessToken: string | null;
  onListingCreated: () => void;
}

export function CreateListingDialog({ open, onClose, onListingCreated }: CreateListingDialogProps) {
  const { user } = useAuth();
  const [type, setType] = useState<'housing' | 'marketplace'>('housing');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setLocation('');
    setBedrooms(''); setBathrooms(''); setAvailableFrom(''); setAvailableTo('');
    setGender('any'); setCategory(''); setCondition('');
    setImages([]); setImagePreviews([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const listing = await createListing({
        user_id: user.id,
        school_id: user.schoolId,
        type,
        title,
        description,
        price: parseFloat(price),
        ...(type === 'housing' ? {
          location,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseFloat(bathrooms),
          available_from: availableFrom || null,
          available_to: availableTo || null,
          gender_pref: gender,
        } : {
          category,
          condition,
        }),
      });

      // Upload images
      for (let i = 0; i < images.length; i++) {
        await uploadListingImage(images[i], listing.id, i);
      }

      trackEvent('listing_created', { listing_type: type, listing_title: title });
      toast.success('Listing created successfully!');
      resetForm();
      onClose();
      onListingCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>Post a housing sublease or marketplace item</DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as 'housing' | 'marketplace')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="housing">Housing</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="housing" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g., 1BR Apartment near RIT" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Describe the housing..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent ($) *</Label>
                  <Input id="price" type="number" placeholder="800" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input id="location" placeholder="e.g., Park Point" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input id="bedrooms" type="number" placeholder="1" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input id="bathrooms" type="number" placeholder="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required min="0" step="0.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender Preference</Label>
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
                  <Label htmlFor="availableFrom">Available From *</Label>
                  <Input id="availableFrom" type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableTo">Available To (Optional)</Label>
                  <Input id="availableTo" type="date" value={availableTo} onChange={(e) => setAvailableTo(e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-market">Title *</Label>
                <Input id="title-market" placeholder="e.g., MacBook Pro 2021" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-market">Description *</Label>
                <Textarea id="description-market" placeholder="Describe the item..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-market">Price ($) *</Label>
                  <Input id="price-market" type="number" placeholder="100" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
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
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={condition} onValueChange={setCondition}>
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
            </TabsContent>

            {/* Image Upload */}
            <div className="space-y-2 mt-4">
              <Label>Photos (up to 5)</Label>
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded border overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-black/60 text-white rounded-bl p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-[#F76902] transition-colors"
                  >
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" className="bg-[#F76902] hover:bg-[#D85802]" disabled={loading}>
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
