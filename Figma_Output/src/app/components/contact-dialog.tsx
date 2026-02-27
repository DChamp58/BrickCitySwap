import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Listing } from './listing-card';
import { MapPin } from 'lucide-react';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  accessToken: string | null;
}

const campusLocations = [
  { value: 'global-village', label: 'Global Village Plaza', walkingTime: '2 min' },
  { value: 'sau', label: 'Student Alumni Union (SAU)', walkingTime: '3 min' },
  { value: 'wallace-library', label: 'Wallace Library', walkingTime: '4 min' },
  { value: 'campus-center', label: 'Campus Center', walkingTime: '5 min' },
  { value: 'magic-spell', label: 'MAGIC Spell Studios', walkingTime: '7 min' },
  { value: 'other', label: 'Other (specify)', walkingTime: '' },
];

export function ContactDialog({ open, onClose, listing, accessToken }: ContactDialogProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetupLocation, setMeetupLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const handleSendMessage = async () => {
    if (!listing || !accessToken) return;

    const finalMessage = meetupLocation
      ? `${message}\n\n📍 Suggested meetup location: ${
          meetupLocation === 'other' ? customLocation : campusLocations.find(l => l.value === meetupLocation)?.label
        }`
      : message;

    setLoading(true);
    try {
      // TODO: implement real messaging
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Message sent! The seller will be in touch.');
      setMessage('');
      setMeetupLocation('');
      setCustomLocation('');
      onClose();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message about: {listing.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="font-medium mb-1">{listing.title}</div>
            <div className="text-sm text-muted-foreground">
              ${listing.price}{listing.type === 'housing' ? '/month' : ''}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in this listing..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          {/* Meetup Location Selector */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-muted">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F76902]" />
              <Label className="text-base font-semibold">Suggest a meetup location</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Suggest a safe, public campus location for easy meetups
            </p>
            
            <Select value={meetupLocation} onValueChange={setMeetupLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a location (optional)" />
              </SelectTrigger>
              <SelectContent>
                {campusLocations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{location.label}</span>
                      {location.walkingTime && (
                        <span className="text-xs text-muted-foreground ml-4">
                          {location.walkingTime} walk
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {meetupLocation === 'other' && (
              <Input
                placeholder="Enter custom location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading || (meetupLocation === 'other' && !customLocation.trim())}
              className="bg-[#F76902] hover:bg-[#D85802]"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
