import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent,
} from './ui/dialog';
import { Listing } from './listing-card';
import {
  MapPin, Calendar, Bath, BedDouble, Home, MessageCircle,
  ChevronLeft, ChevronRight, X, Share2, Heart, User,
  Package, Tag,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { trackEvent } from '@/lib/analytics';

interface ListingDetailDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onContact: (listing: Listing) => void;
  showContactButton?: boolean;
}

export function ListingDetailDialog({
  open, onClose, listing, onContact, showContactButton = true,
}: ListingDetailDialogProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open && listing) {
      setImgIdx(0);
      trackEvent('listing_viewed', { listing_id: listing.id, listing_type: listing.type });
    }
  }, [open, listing?.id]);

  if (!listing) return null;

  const isHousing = listing.type === 'housing';
  const images = listing.listing_images ?? [];

  // ── Marketplace: simple dialog ──────────────────────────────────────────
  if (!isHousing) {
    return (
      <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0" style={{ borderRadius: '16px' }}>
          {/* Image */}
          {images.length > 0 && (
            <div className="relative" style={{ height: '280px', overflow: 'hidden', borderRadius: '16px 16px 0 0', backgroundColor: '#F3F4F6' }}>
              <ImageWithFallback src={images[imgIdx]?.url || ''} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={20} style={{ color: '#402E32' }} />
                  </button>
                  <button onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={20} style={{ color: '#402E32' }} />
                  </button>
                </>
              )}
            </div>
          )}
          <div style={{ padding: '24px' }}>
            <div className="flex items-start justify-between" style={{ gap: '12px', marginBottom: '8px' }}>
              <h2 className="font-bold" style={{ fontSize: '22px', color: '#402E32', lineHeight: '1.3' }}>{listing.title}</h2>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#F76902', flexShrink: 0 }}>${listing.price}</span>
            </div>
            <div className="flex items-center" style={{ gap: '16px', marginBottom: '16px' }}>
              {listing.category && <span style={{ fontSize: '13px', color: '#B5866E', display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={13} />{listing.category}</span>}
              {listing.condition && <span style={{ fontSize: '13px', color: '#B5866E', display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={13} />{listing.condition}</span>}
            </div>
            <p style={{ fontSize: '15px', color: '#5A4A44', lineHeight: '1.65', marginBottom: '20px' }}>{listing.description}</p>
            {listing.profiles?.full_name && (
              <div className="flex items-center" style={{ gap: '10px', marginBottom: '20px', padding: '14px 16px', borderRadius: '10px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{listing.profiles.full_name.charAt(0)}</span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#402E32' }}>{listing.profiles.full_name}</p>
                  <p style={{ fontSize: '12px', color: '#B5866E' }}>Seller · Posted {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            )}
            {showContactButton && (
              <button
                onClick={() => { onContact(listing); onClose(); }}
                className="w-full flex items-center justify-center font-semibold"
                style={{ padding: '14px', borderRadius: '10px', fontSize: '16px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(247,105,2,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F76902'; }}
              >
                <MessageCircle size={18} /> Contact Seller
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Housing: full redesign ───────────────────────────────────────────────
  const main = images[0];
  const thumbs = images.slice(1, 5);
  const hasImages = images.length > 0;

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Full-screen gallery overlay */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setGalleryOpen(false)}
        >
          <button onClick={() => setGalleryOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} style={{ color: '#FFFFFF' }} />
          </button>
          <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
            style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={28} style={{ color: '#FFFFFF' }} />
          </button>
          <img src={images[imgIdx]?.url} alt={listing.title} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
            style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={28} style={{ color: '#FFFFFF' }} />
          </button>
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', color: '#FFFFFF', fontSize: '14px', opacity: 0.7 }}>
            {imgIdx + 1} / {images.length}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={o => { if (!o) { setGalleryOpen(false); onClose(); } }}>
        <DialogContent
          className="p-0 overflow-hidden"
          style={{ maxWidth: '900px', width: '95vw', maxHeight: '92vh', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
        >
          {/* ── Photo Grid ─────────────────────────────────────────────── */}
          {hasImages && (
            <div className="relative flex-shrink-0" style={{ height: '360px', backgroundColor: '#1a1a1a' }}>
              {images.length === 1 ? (
                <img src={main.url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', gap: '3px' }}>
                  {/* Main large photo */}
                  <div
                    style={{ gridRow: '1 / 3', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => { setImgIdx(0); setGalleryOpen(true); }}
                  >
                    <img src={main.url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  </div>
                  {/* Up to 4 thumbnails */}
                  {[0, 1, 2, 3].map(i => {
                    const img = thumbs[i];
                    if (!img) return (
                      <div key={i} style={{ backgroundColor: '#2a2a2a' }} />
                    );
                    return (
                      <div key={i} style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                        onClick={() => { setImgIdx(i + 1); setGalleryOpen(true); }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* See all photos button */}
              {images.length > 1 && (
                <button
                  onClick={() => { setImgIdx(0); setGalleryOpen(true); }}
                  style={{
                    position: 'absolute', bottom: '16px', right: '16px',
                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    backgroundColor: 'rgba(255,255,255,0.92)', color: '#402E32',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)'; }}
                >
                  ⊞ See all {images.length} photos
                </button>
              )}
            </div>
          )}

          {/* ── Scrollable body ─────────────────────────────────────────── */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '0', minHeight: '100%' }}>

              {/* Left: details */}
              <div style={{ padding: '32px 36px', borderRight: '1px solid #E8D5C4' }}>

                {/* Title row */}
                <div className="flex items-start justify-between" style={{ gap: '16px', marginBottom: '20px' }}>
                  <h2 className="font-bold" style={{ fontSize: '26px', color: '#402E32', lineHeight: '1.25', flex: 1 }}>
                    {listing.title}
                  </h2>
                  <div className="flex items-center flex-shrink-0" style={{ gap: '8px' }}>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={15} style={{ color: '#B5866E' }} />
                    </button>
                    <button
                      onClick={() => setSaved(s => !s)}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={15} style={{ color: saved ? '#F76902' : '#B5866E', fill: saved ? '#F76902' : 'none' }} />
                    </button>
                  </div>
                </div>

                {/* Key facts strip */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E8D5C4' }}>
                  {listing.available_from && (
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Calendar size={16} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#402E32' }}>
                        {fmt(listing.available_from)}{listing.available_to ? ` – ${fmt(listing.available_to)}` : ''}
                      </span>
                    </div>
                  )}
                  {listing.bedrooms != null && (
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <BedDouble size={16} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#402E32' }}>
                        {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bed`}
                      </span>
                    </div>
                  )}
                  {listing.bathrooms != null && (
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Bath size={16} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#402E32' }}>{listing.bathrooms} bath</span>
                    </div>
                  )}
                  {listing.housing_type && (
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Home size={16} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#402E32', textTransform: 'capitalize' }}>{listing.housing_type}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 className="font-semibold" style={{ fontSize: '17px', color: '#402E32', marginBottom: '10px' }}>About this place</h3>
                  <p style={{ fontSize: '15px', color: '#5A4A44', lineHeight: '1.7' }}>{listing.description}</p>
                </div>

                {/* Gender pref */}
                {listing.gender_pref && listing.gender_pref !== 'any' && (
                  <div style={{ marginBottom: '28px', padding: '14px 16px', borderRadius: '10px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4' }}>
                    <p style={{ fontSize: '14px', color: '#B5866E' }}>
                      <span style={{ color: '#F76902', fontWeight: 600 }}>Preference:</span> {listing.gender_pref.charAt(0).toUpperCase() + listing.gender_pref.slice(1)} preferred
                    </p>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="font-semibold" style={{ fontSize: '17px', color: '#402E32', marginBottom: '12px' }}>Location</h3>
                  {listing.location && (
                    <div className="flex items-center" style={{ gap: '6px', marginBottom: '14px' }}>
                      <MapPin size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#5A4A44' }}>
                        {listing.location}
                        {listing.distance_from_campus != null && (
                          <span style={{ color: '#B5866E' }}> · {listing.distance_from_campus} min from RIT</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Map embed */}
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8D5C4', height: '220px', backgroundColor: '#F3F4F6', position: 'relative' }}>
                    <iframe
                      title="location map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent((listing.location || 'RIT Rochester NY'))}&output=embed&z=14`}
                      style={{ border: 0, display: 'block' }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#B5866E', marginTop: '8px', textAlign: 'center' }}>
                    Exact address shared after you message the host
                  </p>
                </div>
              </div>

              {/* Right: sticky price sidebar */}
              <div style={{ padding: '32px 28px' }}>
                <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Price card */}
                  <div style={{ padding: '24px', borderRadius: '14px', border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(64,46,50,0.07)' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '32px', fontWeight: 800, color: '#F76902' }}>${listing.price}</span>
                      <span style={{ fontSize: '16px', color: '#B5866E' }}> / month</span>
                    </div>

                    {/* Host info */}
                    {listing.profiles?.full_name && (
                      <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E8D5C4' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFF6EE', border: '2px solid #F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {listing.profiles.avatar_url
                            ? <img src={listing.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '16px', fontWeight: 700, color: '#F76902' }}>{listing.profiles.full_name.charAt(0)}</span>
                          }
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#402E32' }}>{listing.profiles.full_name}</p>
                          <p style={{ fontSize: '12px', color: '#B5866E' }}>Host</p>
                        </div>
                      </div>
                    )}

                    {/* Contact button */}
                    {showContactButton && (
                      <button
                        onClick={() => { onContact(listing); onClose(); }}
                        className="w-full flex items-center justify-center font-semibold"
                        style={{ padding: '14px', borderRadius: '10px', fontSize: '15px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(247,105,2,0.35)', transition: 'background 180ms ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F76902'; }}
                      >
                        <MessageCircle size={17} /> Message Host
                      </button>
                    )}
                  </div>

                  {/* Posted date */}
                  <p style={{ fontSize: '12px', color: '#B5866E', textAlign: 'center' }}>
                    Listed {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
