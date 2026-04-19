import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Dialog, DialogContent, DialogClose,
} from './ui/dialog';
import { Listing } from './listing-card';
import {
  MapPin, Calendar, Bath, BedDouble, Home, MessageCircle,
  ChevronLeft, ChevronRight, X, Share2, Heart,
  Tag, ShieldCheck,
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

// Condition badge colours
const conditionStyle: Record<string, { bg: string; color: string; label: string }> = {
  'new':       { bg: '#DCFCE7', color: '#16A34A', label: 'New' },
  'like-new':  { bg: '#D1FAE5', color: '#059669', label: 'Like New' },
  'good':      { bg: '#FEF9C3', color: '#CA8A04', label: 'Good' },
  'fair':      { bg: '#FEE2E2', color: '#DC2626', label: 'Fair' },
  'poor':      { bg: '#F3F4F6', color: '#6B7280', label: 'Poor' },
};

export function ListingDetailDialog({
  open, onClose, listing, onContact, showContactButton = true,
}: ListingDetailDialogProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // sheetRef is used for direct DOM transforms (60fps drag, no React re-renders)
  const sheetRef = React.useRef<HTMLDivElement>(null);
  // Use a ref to track drag state inside the non-passive listener (avoids stale closure)
  const drag = React.useRef({ startY: 0, active: false, y: 0 });
  const imgSwipe = React.useRef({ startX: 0, startY: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Non-passive touch listeners on the scrollable content — enables drag-to-close
  // from anywhere in the sheet when content is scrolled to the top.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isMobile) return;

    const onStart = (e: TouchEvent) => {
      drag.current.startY = e.touches[0].clientY;
      drag.current.active = el.scrollTop === 0;
      drag.current.y = 0;
      if (sheetRef.current) sheetRef.current.style.transition = 'none';
    };
    const onMove = (e: TouchEvent) => {
      if (!drag.current.active) return;
      const delta = e.touches[0].clientY - drag.current.startY;
      if (delta > 5) {
        e.preventDefault(); // stop scroll — requires non-passive
        drag.current.y = delta - 5;
        if (sheetRef.current) sheetRef.current.style.transform = `translateY(${drag.current.y}px)`;
      }
    };
    const onEnd = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      if (drag.current.y > 80) {
        drag.current.y = 0;
        setGalleryOpen(false);
        onClose();
      } else {
        drag.current.y = 0;
        if (sheetRef.current) {
          sheetRef.current.style.transition = 'transform 300ms cubic-bezier(0.25,1,0.5,1)';
          sheetRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [isMobile, open]); // re-attach when dialog opens or screen size changes

  // Handle-bar drag (still used for the top handle pill)
  const handleDragStart = (e: React.TouchEvent) => {
    drag.current.startY = e.touches[0].clientY;
    drag.current.active = true;
    drag.current.y = 0;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };
  const handleDragMove = (e: React.TouchEvent) => {
    if (!drag.current.active) return;
    const delta = e.touches[0].clientY - drag.current.startY;
    if (delta > 0) {
      drag.current.y = delta;
      if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };
  const handleDragEnd = () => {
    drag.current.active = false;
    if (drag.current.y > 80) {
      drag.current.y = 0;
      setGalleryOpen(false);
      onClose();
    } else {
      drag.current.y = 0;
      if (sheetRef.current) {
        sheetRef.current.style.transition = 'transform 300ms cubic-bezier(0.25,1,0.5,1)';
        sheetRef.current.style.transform = 'translateY(0)';
      }
    }
  };

  useEffect(() => {
    if (open && listing) {
      setImgIdx(0);
      trackEvent('listing_viewed', { listing_id: listing.id, listing_type: listing.type });
    }
  }, [open, listing?.id]);

  if (!listing) return null;

  const isHousing = listing.type === 'housing';
  const images = listing.listing_images ?? [];

  // Horizontal swipe to navigate images
  const onImgTouchStart = (e: React.TouchEvent) => {
    if (!e.touches.length) return;
    imgSwipe.current.startX = e.touches[0].clientX;
    imgSwipe.current.startY = e.touches[0].clientY;
  };
  const onImgTouchEnd = (e: React.TouchEvent) => {
    if (!e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - imgSwipe.current.startX;
    const dy = e.changedTouches[0].clientY - imgSwipe.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && images.length > 1) {
      // Horizontal swipe → navigate images
      setImgIdx(prev => dx < 0
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
      );
    } else if (dy > 80 && Math.abs(dy) > Math.abs(dx) && galleryOpen) {
      // Swipe down → close gallery
      setGalleryOpen(false);
    }
  };

  // ── Marketplace ────────────────────────────────────────────────────────────
  if (!isHousing) {
    const cond = listing.condition ? conditionStyle[listing.condition.toLowerCase()] ?? null : null;

    return (
      <>
        {/* Fullscreen gallery — portalled to document.body so it sits above the Radix dialog in the root stacking context */}
        {galleryOpen && images.length > 0 && createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.78)', zIndex: 9999, backdropFilter: 'blur(8px)' }}
            onClick={() => setGalleryOpen(false)}
          >
            {/* Close button — white, top-right, always visible */}
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryOpen(false); }}
              aria-label="Close"
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: '#FFFFFF', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <X size={20} style={{ color: '#402E32' }} />
            </button>

            {/* Counter */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
                  fontSize: '13px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px',
                  pointerEvents: 'none',
                }}
              >
                {imgIdx + 1} / {images.length}
              </div>
            )}

            {/* Image + side arrows */}
            <div
              className="relative flex items-center justify-center"
              style={{ maxWidth: '88vw', maxHeight: '82vh' }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onImgTouchStart}
              onTouchEnd={onImgTouchEnd}
            >
              {images.length > 1 && !isMobile && (
                <button
                  onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                  style={{
                    position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)',
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#FFFFFF', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  <ChevronLeft size={22} style={{ color: '#402E32' }} />
                </button>
              )}

              <img
                src={images[imgIdx]?.url}
                alt={listing.title}
                style={{
                  maxWidth: '88vw', maxHeight: '82vh',
                  objectFit: 'contain', borderRadius: '12px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                  userSelect: 'none', display: 'block',
                }}
                draggable={false}
              />

              {images.length > 1 && !isMobile && (
                <button
                  onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                  style={{
                    position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)',
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#FFFFFF', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  <ChevronRight size={22} style={{ color: '#402E32' }} />
                </button>
              )}
            </div>

            {/* Dot navigation */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: '8px', alignItems: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{
                      width: i === imgIdx ? '24px' : '8px', height: '8px', borderRadius: '4px',
                      backgroundColor: i === imgIdx ? '#F76902' : 'rgba(255,255,255,0.45)',
                      border: 'none', cursor: 'pointer', padding: 0, transition: 'all 200ms ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body
        )}

        <Dialog open={open} onOpenChange={o => { if (!o) { setGalleryOpen(false); onClose(); } }}>
          <DialogContent
            showCloseButton={!isMobile}
            onInteractOutside={e => { if (galleryOpen) e.preventDefault(); }}
            className={isMobile
              ? 'p-0 overflow-hidden !top-auto !bottom-0 !left-0 !right-0 !translate-x-0 !translate-y-0 !max-w-full !w-full !rounded-none !bg-transparent !border-0 !shadow-none'
              : 'p-0 overflow-hidden'}
            style={isMobile
              ? { maxHeight: '88vh', display: 'flex', flexDirection: 'column' }
              : { maxWidth: '820px', width: '95vw', maxHeight: '92vh', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Outer transform wrapper — whole sheet slides together (DOM-driven for 60fps) */}
            <div ref={isMobile ? sheetRef : undefined} style={{
              display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
              ...(isMobile ? {
                backgroundColor: '#FFFFFF',
                borderRadius: '16px 16px 0 0',
                boxShadow: '0 -4px 24px rgba(64,46,50,0.12)',
                willChange: 'transform',
              } : {}),
            }}>

            {/* Mobile: drag handle bar */}
            {isMobile && (
              <div
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 10px', flexShrink: 0, cursor: 'grab', touchAction: 'none' }}
              >
                <div style={{ flex: 1 }} />
                <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#D1C4BC' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <DialogClose asChild>
                    <button
                      style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3EDEA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Close"
                    >
                      <X size={15} style={{ color: '#402E32' }} />
                    </button>
                  </DialogClose>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>

              {/* ── Mobile: image at top (fixed, not scrollable) like housing ─── */}
              {isMobile && (
                <div
                  onTouchStart={onImgTouchStart}
                  onTouchEnd={onImgTouchEnd}
                  style={{ position: 'relative', height: '220px', backgroundColor: '#F3F4F6', flexShrink: 0, cursor: images.length > 0 ? 'pointer' : 'default', touchAction: 'pan-y' }}
                  onClick={() => images.length > 0 && setGalleryOpen(true)}
                >
                  {images.length > 0
                    ? <ImageWithFallback src={images[imgIdx]?.url || ''} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div className="flex items-center justify-center h-full" style={{ color: '#B5866E', fontSize: '14px' }}>No photos</div>
                  }
                  {images.length > 1 && <>
                    <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <ChevronLeft size={18} style={{ color: '#402E32' }} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <ChevronRight size={18} style={{ color: '#402E32' }} />
                    </button>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                      {imgIdx + 1} / {images.length}
                    </div>
                  </>}
                </div>
              )}

              {/* ── Left: photo (desktop) + scrollable details ───────────────── */}
              <div ref={isMobile ? scrollRef : undefined} style={{ overflowY: 'auto', flex: 1, borderRight: isMobile ? 'none' : '1px solid #E8D5C4' }}>

                {/* Desktop: main photo */}
                {!isMobile && (
                  <div style={{ position: 'relative', height: '360px', backgroundColor: '#F3F4F6', flexShrink: 0, cursor: images.length > 0 ? 'pointer' : 'default' }}
                    onClick={() => images.length > 0 && setGalleryOpen(true)}>
                    {images.length > 0
                      ? <ImageWithFallback src={images[imgIdx]?.url || ''} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="flex items-center justify-center h-full" style={{ color: '#B5866E', fontSize: '14px' }}>No photos</div>
                    }
                    {images.length > 1 && <>
                      <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <ChevronLeft size={18} style={{ color: '#402E32' }} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <ChevronRight size={18} style={{ color: '#402E32' }} />
                      </button>
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                        {imgIdx + 1} / {images.length}
                      </div>
                    </>}
                  </div>
                )}

                {/* Desktop: thumbnail strip */}
                {!isMobile && images.length > 1 && (
                  <div className="flex" style={{ gap: '8px', padding: '12px 16px', backgroundColor: '#FAFAFA', borderBottom: '1px solid #E8D5C4', overflowX: 'auto' }}>
                    {images.map((img, i) => (
                      <button key={img.id} onClick={() => setImgIdx(i)}
                        style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: i === imgIdx ? '2px solid #F76902' : '2px solid transparent', cursor: 'pointer', padding: 0, transition: 'border-color 150ms ease' }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile: price card (below image, matching housing style) */}
                {isMobile && (
                  <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
                    <div style={{ padding: '18px', borderRadius: '14px', border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(64,46,50,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#F76902' }}>${listing.price}</span>
                        {listing.profiles?.full_name && (
                          <div className="flex items-center" style={{ gap: '8px', flex: 1 }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#FFF6EE', border: '2px solid #F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                              {listing.profiles.avatar_url
                                ? <img src={listing.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: '13px', fontWeight: 700, color: '#F76902' }}>{listing.profiles.full_name.charAt(0)}</span>
                              }
                            </div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#402E32' }}>{listing.profiles.full_name}</p>
                              <p style={{ fontSize: '11px', color: '#B5866E' }}>Seller</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {showContactButton && (
                        <button onClick={() => { onContact(listing); onClose(); }} className="flex items-center justify-center font-semibold w-full"
                          style={{ padding: '12px', borderRadius: '10px', fontSize: '15px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(247,105,2,0.3)' }}>
                          <MessageCircle size={16} /> Contact Seller
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div style={{ padding: isMobile ? '20px' : '28px' }}>
                  <div className="flex items-start justify-between" style={{ gap: '12px', marginBottom: '14px' }}>
                    <h2 className="font-bold" style={{ fontSize: isMobile ? '20px' : '24px', color: '#402E32', lineHeight: '1.25', flex: 1 }}>{listing.title}</h2>
                    <div className="flex" style={{ gap: '8px', flexShrink: 0 }}>
                      <button style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Share2 size={14} style={{ color: '#B5866E' }} />
                      </button>
                      <button onClick={() => setSaved(s => !s)}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={14} style={{ color: saved ? '#F76902' : '#B5866E', fill: saved ? '#F76902' : 'none' }} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap" style={{ gap: '8px', marginBottom: '20px' }}>
                    {listing.category && (
                      <span className="flex items-center" style={{ gap: '5px', padding: '5px 12px', borderRadius: '20px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4', fontSize: '13px', color: '#B5866E', fontWeight: 500 }}>
                        <Tag size={12} style={{ color: '#F76902' }} />
                        {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                      </span>
                    )}
                    {cond && (
                      <span style={{ padding: '5px 12px', borderRadius: '20px', backgroundColor: cond.bg, fontSize: '13px', color: cond.color, fontWeight: 600 }}>
                        {cond.label}
                      </span>
                    )}
                  </div>

                  <div style={{ paddingTop: '20px', borderTop: '1px solid #E8D5C4' }}>
                    <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32', marginBottom: '10px' }}>Description</h3>
                    <p style={{ fontSize: '15px', color: '#5A4A44', lineHeight: '1.7' }}>{listing.description}</p>
                  </div>

                  {isMobile && (
                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4', marginTop: '20px' }}>
                      <div className="flex items-center" style={{ gap: '8px', marginBottom: '6px' }}>
                        <ShieldCheck size={14} style={{ color: '#F76902', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#402E32' }}>Safety tip</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#B5866E', lineHeight: '1.6' }}>Meet in a public place on campus. Inspect the item before paying. Never send money in advance.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: sticky sidebar (desktop only) ──────────────── */}
              {!isMobile && (
                <div style={{ padding: '28px 24px', overflowY: 'auto', width: '300px', flexShrink: 0 }}>
                  <div style={{ position: 'sticky', top: '0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '22px', borderRadius: '14px', border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(64,46,50,0.07)' }}>
                      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E8D5C4' }}>
                        <span style={{ fontSize: '36px', fontWeight: 800, color: '#F76902' }}>${listing.price}</span>
                      </div>
                      {listing.profiles?.full_name && (
                        <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFF6EE', border: '2px solid #F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                            {listing.profiles.avatar_url
                              ? <img src={listing.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ fontSize: '15px', fontWeight: 700, color: '#F76902' }}>{listing.profiles.full_name.charAt(0)}</span>
                            }
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#402E32' }}>{listing.profiles.full_name}</p>
                            <p style={{ fontSize: '12px', color: '#B5866E' }}>Seller · {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                      )}
                      {showContactButton && (
                        <button onClick={() => { onContact(listing); onClose(); }} className="w-full flex items-center justify-center font-semibold"
                          style={{ padding: '13px', borderRadius: '10px', fontSize: '15px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(247,105,2,0.3)', transition: 'background 180ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F76902'; }}>
                          <MessageCircle size={16} /> Contact Seller
                        </button>
                      )}
                    </div>
                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4' }}>
                      <div className="flex items-center" style={{ gap: '8px', marginBottom: '8px' }}>
                        <ShieldCheck size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#402E32' }}>Safety tip</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#B5866E', lineHeight: '1.6' }}>Meet in a public place on campus. Inspect the item before paying. Never send money in advance.</p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#B5866E', textAlign: 'center' }}>
                      Listed {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            </div>{/* end outer transform wrapper */}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ── Housing: full redesign ───────────────────────────────────────────────
  const main = images[0];
  const thumbs = images.slice(1, 5);
  const hasImages = images.length > 0;

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Full-screen gallery — portalled to document.body so it sits above the Radix dialog in the root stacking context */}
      {galleryOpen && images.length > 0 && createPortal(
        <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: 'rgba(0,0,0,0.96)', zIndex: 9999 }}>
          {/* Header: counter + close (safe-area aware) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', paddingTop: 'max(env(safe-area-inset-top), 16px)', flexShrink: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500 }}>
              {images.length > 1 ? `${imgIdx + 1} of ${images.length}` : ''}
            </span>
            <button onClick={() => setGalleryOpen(false)} aria-label="Close gallery"
              style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={22} style={{ color: '#fff' }} />
            </button>
          </div>

          {/* Image area — swipe horizontally to navigate, swipe down to close */}
          <div
            onTouchStart={onImgTouchStart}
            onTouchEnd={onImgTouchEnd}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', touchAction: 'none' }}
          >
            <img
              src={images[imgIdx]?.url}
              alt={listing.title}
              style={{ maxWidth: '92vw', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />
            {/* Desktop arrows only */}
            {images.length > 1 && !isMobile && (
              <>
                <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={28} style={{ color: '#fff' }} />
                </button>
                <button onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={28} style={{ color: '#fff' }} />
                </button>
              </>
            )}
          </div>

          {/* Bottom: pill dots (multi-image) or close hint (single) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '20px', paddingBottom: 'max(env(safe-area-inset-bottom), 20px)', flexShrink: 0, minHeight: '64px' }}>
            {images.length > 1
              ? images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: i === imgIdx ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === imgIdx ? '#F76902' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 200ms ease' }}
                  />
                ))
              : <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>Swipe down or tap × to close</p>
            }
          </div>
        </div>,
        document.body
      )}

      <Dialog open={open} onOpenChange={o => { if (!o) { setGalleryOpen(false); onClose(); } }}>
        <DialogContent
          showCloseButton={!isMobile}
          onInteractOutside={e => { if (galleryOpen) e.preventDefault(); }}
          className={isMobile
            ? 'p-0 overflow-hidden !top-auto !bottom-0 !left-0 !right-0 !translate-x-0 !translate-y-0 !max-w-full !w-full !rounded-none !bg-transparent !border-0 !shadow-none'
            : 'p-0 overflow-hidden'}
          style={isMobile
            ? { maxHeight: '88vh', display: 'flex', flexDirection: 'column' }
            : { maxWidth: '900px', width: '95vw', maxHeight: '92vh', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Outer transform wrapper — whole sheet slides together (DOM-driven for 60fps) */}
          <div ref={isMobile ? sheetRef : undefined} style={{
            display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
            ...(isMobile ? {
              backgroundColor: '#FFFFFF',
              borderRadius: '16px 16px 0 0',
              boxShadow: '0 -4px 24px rgba(64,46,50,0.12)',
              willChange: 'transform',
            } : {}),
          }}>

          {/* Mobile: drag handle bar */}
          {isMobile && (
            <div
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 10px', flexShrink: 0, cursor: 'grab', touchAction: 'none' }}
            >
              <div style={{ flex: 1 }} />
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#D1C4BC' }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <DialogClose asChild>
                  <button
                    style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3EDEA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Close"
                  >
                    <X size={15} style={{ color: '#402E32' }} />
                  </button>
                </DialogClose>
              </div>
            </div>
          )}

          {/* ── Photo (mobile: single image; desktop: grid) ─────────── */}
          {hasImages && (
            <div
              className="relative flex-shrink-0"
              onTouchStart={onImgTouchStart}
              onTouchEnd={onImgTouchEnd}
              style={{ height: isMobile ? '220px' : '360px', backgroundColor: '#1a1a1a', touchAction: 'pan-y' }}
            >
              {(isMobile || images.length === 1) ? (
                <>
                  <img src={images[imgIdx]?.url || main.url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setGalleryOpen(true)} />
                  {images.length > 1 && <>
                    <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronLeft size={18} style={{ color: '#402E32' }} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={18} style={{ color: '#402E32' }} />
                    </button>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                      {imgIdx + 1} / {images.length}
                    </div>
                  </>}
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', gap: '3px' }}>
                  <div style={{ gridRow: '1 / 3', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setImgIdx(0); setGalleryOpen(true); }}>
                    <img src={main.url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                  </div>
                  {[0, 1, 2, 3].map(i => {
                    const img = thumbs[i];
                    if (!img) return <div key={i} style={{ backgroundColor: '#2a2a2a' }} />;
                    return (
                      <div key={i} style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setImgIdx(i + 1); setGalleryOpen(true); }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }} />
                      </div>
                    );
                  })}
                </div>
              )}
              {!isMobile && images.length > 1 && (
                <button onClick={() => { setImgIdx(0); setGalleryOpen(true); }}
                  style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.92)', color: '#402E32', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  ⊞ See all {images.length} photos
                </button>
              )}
            </div>
          )}

          {/* ── Scrollable body ─────────────────────────────────────── */}
          <div ref={isMobile ? scrollRef : undefined} style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100%' }}>

              {/* Mobile: price card at top */}
              {isMobile && (
                <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
                  <div style={{ padding: '18px', borderRadius: '14px', border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(64,46,50,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#F76902' }}>${listing.price}</span>
                        <span style={{ fontSize: '14px', color: '#B5866E' }}> / month</span>
                      </div>
                      {listing.profiles?.full_name && (
                        <div className="flex items-center" style={{ gap: '8px', flex: 1 }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#FFF6EE', border: '2px solid #F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                            {listing.profiles.avatar_url
                              ? <img src={listing.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ fontSize: '13px', fontWeight: 700, color: '#F76902' }}>{listing.profiles.full_name.charAt(0)}</span>
                            }
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#402E32' }}>{listing.profiles.full_name}</p>
                            <p style={{ fontSize: '11px', color: '#B5866E' }}>Host</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {showContactButton && (
                      <button onClick={() => { onContact(listing); onClose(); }} className="w-full flex items-center justify-center font-semibold"
                        style={{ padding: '13px', borderRadius: '10px', fontSize: '15px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer' }}>
                        <MessageCircle size={16} /> Message Host
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Left: details */}
              <div style={{ padding: isMobile ? '20px' : '32px 36px', flex: 1, borderRight: isMobile ? 'none' : '1px solid #E8D5C4' }}>

                <div className="flex items-start justify-between" style={{ gap: '16px', marginBottom: '16px' }}>
                  <h2 className="font-bold" style={{ fontSize: isMobile ? '20px' : '26px', color: '#402E32', lineHeight: '1.25', flex: 1 }}>
                    {listing.title}
                  </h2>
                  <div className="flex items-center flex-shrink-0" style={{ gap: '8px' }}>
                    <button style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={14} style={{ color: '#B5866E' }} />
                    </button>
                    <button onClick={() => setSaved(s => !s)}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={14} style={{ color: saved ? '#F76902' : '#B5866E', fill: saved ? '#F76902' : 'none' }} />
                    </button>
                  </div>
                </div>

                {/* Key facts */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E8D5C4' }}>
                  {listing.available_from && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Calendar size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#402E32' }}>{fmt(listing.available_from)}{listing.available_to ? ` – ${fmt(listing.available_to)}` : ''}</span>
                    </div>
                  )}
                  {listing.bedrooms != null && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <BedDouble size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#402E32' }}>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} bed`}</span>
                    </div>
                  )}
                  {listing.bathrooms != null && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Bath size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#402E32' }}>{listing.bathrooms} bath</span>
                    </div>
                  )}
                  {listing.housing_type && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Home size={15} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#402E32', textTransform: 'capitalize' }}>{listing.housing_type}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32', marginBottom: '10px' }}>About this place</h3>
                  <p style={{ fontSize: '15px', color: '#5A4A44', lineHeight: '1.7' }}>{listing.description}</p>
                </div>

                {listing.gender_pref && listing.gender_pref !== 'any' && (
                  <div style={{ marginBottom: '24px', padding: '14px 16px', borderRadius: '10px', backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4' }}>
                    <p style={{ fontSize: '14px', color: '#B5866E' }}>
                      <span style={{ color: '#F76902', fontWeight: 600 }}>Preference:</span> {listing.gender_pref.charAt(0).toUpperCase() + listing.gender_pref.slice(1)} preferred
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32', marginBottom: '12px' }}>Location</h3>
                  {listing.location && (
                    <div className="flex items-center" style={{ gap: '6px', marginBottom: '14px' }}>
                      <MapPin size={14} style={{ color: '#F76902', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#5A4A44' }}>
                        {listing.location}
                        {listing.distance_from_campus != null && <span style={{ color: '#B5866E' }}> · {listing.distance_from_campus} min from RIT</span>}
                      </span>
                    </div>
                  )}
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8D5C4', height: isMobile ? '160px' : '220px', backgroundColor: '#F3F4F6' }}>
                    <iframe title="location map" width="100%" height="100%" frameBorder="0" scrolling="no"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent((listing.location || 'RIT Rochester NY'))}&output=embed&z=14`}
                      style={{ border: 0, display: 'block' }} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#B5866E', marginTop: '8px', textAlign: 'center' }}>
                    Exact address shared after you message the host
                  </p>
                </div>
              </div>

              {/* Right: sticky price sidebar (desktop only) */}
              {!isMobile && (
                <div style={{ padding: '32px 28px', width: '320px', flexShrink: 0 }}>
                  <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '24px', borderRadius: '14px', border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(64,46,50,0.07)' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontSize: '32px', fontWeight: 800, color: '#F76902' }}>${listing.price}</span>
                        <span style={{ fontSize: '16px', color: '#B5866E' }}> / month</span>
                      </div>
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
                      {showContactButton && (
                        <button onClick={() => { onContact(listing); onClose(); }} className="w-full flex items-center justify-center font-semibold"
                          style={{ padding: '14px', borderRadius: '10px', fontSize: '15px', gap: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(247,105,2,0.35)', transition: 'background 180ms ease' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F76902'; }}>
                          <MessageCircle size={17} /> Message Host
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#B5866E', textAlign: 'center' }}>
                      Listed {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>{/* end outer transform wrapper */}
        </DialogContent>
      </Dialog>
    </>
  );
}
