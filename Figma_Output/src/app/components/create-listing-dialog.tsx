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

  // Shared fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Housing fields
  const [location, setLocation] = useState('');
  const [housingType, setHousingType] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [availableRooms, setAvailableRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [roommates, setRoommates] = useState('');
  const [femaleRoommates, setFemaleRoommates] = useState('');
  const [maleRoommates, setMaleRoommates] = useState('');
  const [otherRoommates, setOtherRoommates] = useState('');
  const [otherRoommatesSpec, setOtherRoommatesSpec] = useState('');
  const [preferNotToSayRoommates, setPreferNotToSayRoommates] = useState('');
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [electricNotIncluded, setElectricNotIncluded] = useState(false);
  const [electricCost, setElectricCost] = useState('');
  const [waterNotIncluded, setWaterNotIncluded] = useState(false);
  const [waterCost, setWaterCost] = useState('');
  const [gasNotIncluded, setGasNotIncluded] = useState(false);
  const [gasCost, setGasCost] = useState('');
  const [petFee, setPetFee] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');

  // Marketplace fields
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [openToOffers, setOpenToOffers] = useState(false);

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice('');
    setLocation(''); setHousingType(''); setTotalRooms(''); setAvailableRooms('');
    setBathrooms(''); setRoommates(''); setFemaleRoommates(''); setMaleRoommates('');
    setOtherRoommates(''); setOtherRoommatesSpec(''); setPreferNotToSayRoommates('');
    setAvailableFrom(''); setAvailableTo('');
    setPetsAllowed(false);
    setElectricNotIncluded(false); setElectricCost('');
    setWaterNotIncluded(false); setWaterCost('');
    setGasNotIncluded(false); setGasCost('');
    setPetFee('');
    setCategory(''); setCondition(''); setOpenToOffers(false);
    setImages([]); setImagePreviews([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
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

    if (type === 'housing' && otherRoommates && parseInt(otherRoommates) > 0 && !otherRoommatesSpec.trim()) {
      toast.error('Please provide a specification for "Other" roommates');
      return;
    }

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
          housing_type: housingType || null,
          total_rooms: totalRooms ? parseInt(totalRooms) : null,
          available_rooms: availableRooms ? parseInt(availableRooms) : null,
          bathrooms: parseFloat(bathrooms),
          roommates: roommates ? parseInt(roommates) : null,
          female_roommates: femaleRoommates ? parseInt(femaleRoommates) : null,
          male_roommates: maleRoommates ? parseInt(maleRoommates) : null,
          other_roommates: otherRoommates ? parseInt(otherRoommates) : null,
          other_roommates_spec: otherRoommatesSpec.trim() || null,
          prefer_not_to_say_roommates: preferNotToSayRoommates ? parseInt(preferNotToSayRoommates) : null,
          available_from: availableFrom || null,
          available_to: availableTo || null,
          pets_allowed: petsAllowed,
          electric_included: !electricNotIncluded,
          electric_cost: electricNotIncluded && electricCost ? parseFloat(electricCost) : null,
          water_included: !waterNotIncluded,
          water_cost: waterNotIncluded && waterCost ? parseFloat(waterCost) : null,
          gas_included: !gasNotIncluded,
          gas_cost: gasNotIncluded && gasCost ? parseFloat(gasCost) : null,
          pet_fee: petFee ? parseFloat(petFee) : null,
        } : {
          category,
          condition,
          open_to_offers: openToOffers,
        }),
      });

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
      <DialogContent className="max-w-4xl max-h-[78vh] overflow-y-auto">
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
                <Input id="title" placeholder="e.g., Apartment near RIT — 2 rooms available" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="grid grid-cols-3 gap-4 items-end">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="location">Address *</Label>
                  <Input id="location" placeholder="e.g., 100 Park Point Dr, Rochester, NY" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent ($) *</Label>
                  <Input id="price" type="number" placeholder="800" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 items-end">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="housingType">Property Type *</Label>
                  <Select value={housingType} onValueChange={setHousingType} required>
                    <SelectTrigger id="housingType"><SelectValue placeholder="Select type..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms *</Label>
                  <Input id="totalRooms" type="number" placeholder="4" value={totalRooms} onChange={(e) => setTotalRooms(e.target.value)} required min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableRooms">Available Rooms *</Label>
                  <Input id="availableRooms" type="number" placeholder="1" value={availableRooms} onChange={(e) => setAvailableRooms(e.target.value)} required min="1" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <p className="text-xs text-muted-foreground">0.5 = half bath (no shower)</p>
                  <Input id="bathrooms" type="number" placeholder="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required min="0" step="0.5" />
                </div>
              </div>

              {/* Roommates */}
              <div className="space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium">Roommates</p>
                <div className="grid grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="roommates">Total</Label>
                    <Input id="roommates" type="number" placeholder="3" value={roommates} onChange={(e) => setRoommates(e.target.value)} min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="femaleRoommates">Female</Label>
                    <Input id="femaleRoommates" type="number" placeholder="0" value={femaleRoommates} onChange={(e) => setFemaleRoommates(e.target.value)} min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maleRoommates">Male</Label>
                    <Input id="maleRoommates" type="number" placeholder="0" value={maleRoommates} onChange={(e) => setMaleRoommates(e.target.value)} min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherRoommates">Other</Label>
                    <Input id="otherRoommates" type="number" placeholder="0" value={otherRoommates} onChange={(e) => setOtherRoommates(e.target.value)} min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferNotToSayRoommates">Prefer Not to Say</Label>
                    <Input id="preferNotToSayRoommates" type="number" placeholder="0" value={preferNotToSayRoommates} onChange={(e) => setPreferNotToSayRoommates(e.target.value)} min="0" />
                  </div>
                </div>
                {otherRoommates && parseInt(otherRoommates) > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="otherRoommatesSpec">
                      Other — Specification <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="otherRoommatesSpec"
                      placeholder="e.g., Non-binary"
                      value={otherRoommatesSpec}
                      onChange={(e) => setOtherRoommatesSpec(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Utilities & Pets */}
              <div className="space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium">Utilities & Extras</p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Check utilities NOT included in rent — add approximate monthly cost if known:</p>
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm w-28">
                        <input type="checkbox" checked={electricNotIncluded} onChange={e => setElectricNotIncluded(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                        Electric
                      </label>
                      {electricNotIncluded && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">~$</span>
                          <Input type="number" placeholder="80" value={electricCost} onChange={e => setElectricCost(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm w-28">
                        <input type="checkbox" checked={waterNotIncluded} onChange={e => setWaterNotIncluded(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                        Water
                      </label>
                      {waterNotIncluded && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">~$</span>
                          <Input type="number" placeholder="30" value={waterCost} onChange={e => setWaterCost(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm w-28">
                        <input type="checkbox" checked={gasNotIncluded} onChange={e => setGasNotIncluded(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                        Gas
                      </label>
                      {gasNotIncluded && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">~$</span>
                          <Input type="number" placeholder="40" value={gasCost} onChange={e => setGasCost(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-1 border-t">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                    Pets Allowed
                  </label>
                  {petsAllowed && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="petFee" className="text-sm whitespace-nowrap">Pet Fee ~$</Label>
                      <Input id="petFee" type="number" placeholder="50" value={petFee} onChange={e => setPetFee(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium">Availability</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Start Date *</Label>
                    <Input id="availableFrom" type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableTo">End Date (Optional)</Label>
                    <Input id="availableTo" type="date" value={availableTo} onChange={(e) => setAvailableTo(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Describe the housing..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
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

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpenToOffers(o => !o)}
                  aria-label="Toggle open to offers"
                  style={{
                    position: 'relative', width: '44px', height: '24px', borderRadius: '12px',
                    backgroundColor: openToOffers ? '#F76902' : '#D1D5DB',
                    border: 'none', cursor: 'pointer', transition: 'background-color 200ms ease', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: '3px',
                    left: openToOffers ? '23px' : '3px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 200ms ease',
                  }} />
                </button>
                <span className="text-sm font-medium" style={{ color: openToOffers ? '#F76902' : '#6B7280' }}>
                  Open to Offers
                </span>
                <span className="text-xs" style={{ color: '#B5866E' }}>
                  Buyers can propose their own price
                </span>
              </div>
            </TabsContent>

            {/* Image Upload */}
            <div className="space-y-2 mt-4">
              <Label>Photos (up to 10)</Label>
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
                {images.length < 10 && (
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
