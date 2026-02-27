import React, { useState } from 'react';
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

interface CreateListingDialogProps {
  open: boolean;
  onClose: () => void;
  accessToken: string | null;
  onListingCreated: () => void;
}

export function CreateListingDialog({ open, onClose, onListingCreated }: CreateListingDialogProps) {
  const [type, setType] = useState<'housing' | 'marketplace'>('housing');
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

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setLocation('');
    setBedrooms(''); setBathrooms(''); setAvailableFrom(''); setAvailableTo('');
    setGender('any'); setCategory(''); setCondition('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: implement real listing creation
      await new Promise(resolve => setTimeout(resolve, 500));
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
