import { useState, useEffect, useRef } from 'react';
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
import { updateListing, uploadListingImage, deleteListingImage, updateImagePositions } from '@/lib/api';
import { Listing, ListingImage } from './listing-card';
import { X, ImagePlus } from 'lucide-react';

interface EditListingDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onListingUpdated: (updated: Listing) => void;
}

// A unified slot — either an already-saved image or a brand-new file
type ImageSlot =
  | { kind: 'existing'; image: ListingImage }
  | { kind: 'new'; file: File; preview: string };

export function EditListingDialog({ open, onClose, listing, onListingUpdated }: EditListingDialogProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [gender, setGender] = useState('any');
  const [housingType, setHousingType] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [availableRooms, setAvailableRooms] = useState('');
  const [distanceFromCampus, setDistanceFromCampus] = useState('');
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [electricNotIncluded, setElectricNotIncluded] = useState(false);
  const [electricCost, setElectricCost] = useState('');
  const [waterNotIncluded, setWaterNotIncluded] = useState(false);
  const [waterCost, setWaterCost] = useState('');
  const [gasNotIncluded, setGasNotIncluded] = useState(false);
  const [gasCost, setGasCost] = useState('');
  const [petFee, setPetFee] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');

  // Image state
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedIndex = useRef<number | null>(null);

  // Populate fields & images when the listing changes
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
    setHousingType(listing.housing_type ?? '');
    setTotalRooms(listing.total_rooms != null ? String(listing.total_rooms) : '');
    setAvailableRooms(listing.available_rooms != null ? String(listing.available_rooms) : '');
    setDistanceFromCampus(listing.distance_from_campus != null ? String(listing.distance_from_campus) : '');
    setPetsAllowed(listing.pets_allowed ?? false);
    setElectricNotIncluded(!(listing.electric_included ?? true));
    setElectricCost(listing.electric_cost != null ? String(listing.electric_cost) : '');
    setWaterNotIncluded(!(listing.water_included ?? true));
    setWaterCost(listing.water_cost != null ? String(listing.water_cost) : '');
    setGasNotIncluded(!(listing.gas_included ?? true));
    setGasCost(listing.gas_cost != null ? String(listing.gas_cost) : '');
    setPetFee(listing.pet_fee != null ? String(listing.pet_fee) : '');
    setCategory(listing.category ?? '');
    setCondition(listing.condition ?? '');

    const sorted = [...(listing.listing_images ?? [])].sort((a, b) => a.position - b.position);
    setSlots(sorted.map(img => ({ kind: 'existing', image: img })));
    setDeletedIds([]);
  }, [listing]);

  // Clean up blob URLs when dialog closes
  useEffect(() => {
    if (!open) {
      slots.forEach(s => { if (s.kind === 'new') URL.revokeObjectURL(s.preview); });
    }
  }, [open]);

  // ── Drag-and-drop helpers ──────────────────────────────────────────────────

  const handleDragStart = (i: number) => {
    draggedIndex.current = i;
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIndex(i);
  };

  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const from = draggedIndex.current;
    if (from === null || from === i) { setDragOverIndex(null); return; }
    setSlots(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
    draggedIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    draggedIndex.current = null;
    setDragOverIndex(null);
  };

  const removeSlot = (i: number) => {
    const slot = slots[i];
    if (slot.kind === 'existing') {
      setDeletedIds(prev => [...prev, slot.image.id]);
    } else {
      URL.revokeObjectURL(slot.preview);
    }
    setSlots(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 10 - slots.length;
    if (remaining <= 0) { toast.error('Maximum 10 images allowed'); return; }
    const accepted = files.slice(0, remaining);
    const newSlots: ImageSlot[] = accepted.map(file => ({
      kind: 'new',
      file,
      preview: URL.createObjectURL(file),
    }));
    setSlots(prev => [...prev, ...newSlots]);
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setLoading(true);
    try {
      // 1. Save text fields
      const fieldUpdates =
        listing.type === 'housing'
          ? {
              title, description,
              price: parseFloat(price),
              location,
              bedrooms: bedrooms !== '' ? parseInt(bedrooms) : null,
              bathrooms: bathrooms !== '' ? parseFloat(bathrooms) : null,
              housing_type: housingType || null,
              total_rooms: totalRooms !== '' ? parseInt(totalRooms) : null,
              available_rooms: availableRooms !== '' ? parseInt(availableRooms) : null,
              distance_from_campus: distanceFromCampus !== '' ? parseFloat(distanceFromCampus) : null,
              available_from: availableFrom || null,
              available_to: availableTo || null,
              gender_pref: gender,
              pets_allowed: petsAllowed,
              electric_included: !electricNotIncluded,
              electric_cost: electricNotIncluded && electricCost ? parseFloat(electricCost) : null,
              water_included: !waterNotIncluded,
              water_cost: waterNotIncluded && waterCost ? parseFloat(waterCost) : null,
              gas_included: !gasNotIncluded,
              gas_cost: gasNotIncluded && gasCost ? parseFloat(gasCost) : null,
              pet_fee: petFee ? parseFloat(petFee) : null,
            }
          : { title, description, price: parseFloat(price), category, condition };

      const updated = await updateListing(listing.id, fieldUpdates);

      // 2. Delete removed images
      for (const id of deletedIds) {
        await deleteListingImage(id);
      }

      // 3. Upload new images
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (slot.kind === 'new') {
          await uploadListingImage(slot.file, listing.id, i);
        }
      }

      // 4. Update positions for existing images that were reordered
      const positionUpdates = slots
        .filter((s): s is Extract<ImageSlot, { kind: 'existing' }> => s.kind === 'existing')
        .map((s, idx) => ({ id: s.image.id, position: idx }));
      if (positionUpdates.length > 0) {
        await updateImagePositions(positionUpdates);
      }

      // Build updated listing_images for optimistic UI
      const updatedImages: ListingImage[] = slots
        .filter((s): s is Extract<ImageSlot, { kind: 'existing' }> => s.kind === 'existing')
        .map((s, idx) => ({ ...s.image, position: idx }));

      toast.success('Listing updated!');
      onListingUpdated({ ...listing, ...updated, listing_images: updatedImages } as Listing);
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
          {/* ── Photos ───────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label>
              Photos{' '}
              <span style={{ color: '#B5866E', fontWeight: 400 }}>
                (up to 10 — drag to reorder)
              </span>
            </Label>
            <div className="flex flex-wrap gap-3">
              {slots.map((slot, i) => {
                const src = slot.kind === 'existing' ? slot.image.url : slot.preview;
                const isDragTarget = dragOverIndex === i;
                return (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={e => handleDragOver(e, i)}
                    onDrop={e => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    className="relative group"
                    style={{
                      width: '128px',
                      height: '128px',
                      flexShrink: 0,
                      cursor: 'grab',
                      opacity: draggedIndex.current === i ? 0.4 : 1,
                      outline: isDragTarget ? '2px solid #F76902' : 'none',
                      outlineOffset: '2px',
                      borderRadius: '10px',
                      transition: 'opacity 150ms, outline 100ms',
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      draggable={false}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        borderRadius: '10px', border: '1px solid #E8D5C4',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="absolute top-1.5 right-1.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer',
                      }}
                    >
                      <X size={13} style={{ color: '#fff' }} />
                    </button>

                    {/* Cover badge */}
                    {i === 0 && (
                      <span
                        className="absolute bottom-1.5 left-1/2"
                        style={{
                          transform: 'translateX(-50%)',
                          fontSize: '10px', fontWeight: 600,
                          backgroundColor: '#F76902', color: '#fff',
                          padding: '2px 8px', borderRadius: '4px',
                          pointerEvents: 'none', whiteSpace: 'nowrap',
                        }}
                      >
                        Cover
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Add button */}
              {slots.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center hover:border-[#F76902] transition-colors"
                  style={{
                    width: '128px', height: '128px', borderRadius: '10px',
                    border: '2px dashed #E8D5C4', backgroundColor: '#FFF6EE',
                    cursor: 'pointer', gap: '6px',
                  }}
                >
                  <ImagePlus size={24} style={{ color: '#B5866E' }} />
                  <span style={{ fontSize: '12px', color: '#B5866E' }}>Add photo</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* ── Common fields ─────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">{isHousing ? 'Monthly Rent ($)' : 'Price ($)'} *</Label>
            <Input id="edit-price" type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" />
          </div>

          {/* ── Housing fields ────────────────────────────────────────────── */}
          {isHousing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input id="edit-location" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                  <Input id="edit-bedrooms" type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} min="0" placeholder="e.g. 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                  <Input id="edit-bathrooms" type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} min="0" step="0.5" placeholder="e.g. 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-total-rooms">Total Rooms</Label>
                  <Input id="edit-total-rooms" type="number" value={totalRooms} onChange={e => setTotalRooms(e.target.value)} min="0" placeholder="e.g. 5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-avail-rooms">Available Rooms</Label>
                  <Input id="edit-avail-rooms" type="number" value={availableRooms} onChange={e => setAvailableRooms(e.target.value)} min="0" placeholder="e.g. 2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={housingType} onValueChange={setHousingType}>
                    <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Input id="edit-from" type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-to">Available To (Optional)</Label>
                  <Input id="edit-to" type="date" value={availableTo} onChange={e => setAvailableTo(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-distance">Distance from Campus (miles)</Label>
                <Input id="edit-distance" type="number" value={distanceFromCampus} onChange={e => setDistanceFromCampus(e.target.value)} min="0" step="0.1" placeholder="e.g. 0.5" />
              </div>

              {/* Utilities & Pets */}
              <div className="space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium">Utilities & Extras</p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Check utilities NOT included in rent — add approximate monthly cost if known:</p>
                  <div className="space-y-2 pt-1">
                    {([
                      ['electricNotIncluded', electricNotIncluded, setElectricNotIncluded, electricCost, setElectricCost, 'Electric'] as const,
                      ['waterNotIncluded', waterNotIncluded, setWaterNotIncluded, waterCost, setWaterCost, 'Water'] as const,
                      ['gasNotIncluded', gasNotIncluded, setGasNotIncluded, gasCost, setGasCost, 'Gas'] as const,
                    ]).map(([key, checked, setChecked, cost, setCost, label]) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-sm w-28">
                          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                          {label}
                        </label>
                        {checked && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">~$</span>
                            <Input type="number" placeholder="80" value={cost} onChange={e => setCost(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                            <span className="text-xs text-muted-foreground">/mo</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-1 border-t">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} className="w-4 h-4 accent-[#F76902]" />
                    Pets Allowed
                  </label>
                  {petsAllowed && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Pet Fee ~$</Label>
                      <Input type="number" placeholder="50" value={petFee} onChange={e => setPetFee(e.target.value)} min="0" className="w-24 h-8 text-sm" />
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Marketplace fields ────────────────────────────────────────── */}
          {!isHousing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
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
                <Label>Condition *</Label>
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
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#F76902] hover:bg-[#D85802]" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
