import { useState, useEffect } from 'react';
import {
  Camera, Shield, CheckCircle2, MessageCircle, Package,
  Heart, Calendar, Plus, DollarSign, Eye, ArrowUpRight, Star, LogOut, Pencil,
} from 'lucide-react';
import { useAuth } from './auth-context';
import { fetchMyListings as fetchMyListingsApi } from '@/lib/api';
import { Listing } from './listing-card';
import { EditProfileDialog } from './edit-profile-dialog';
import { ChangePasswordDialog } from './change-password-dialog';
import { NotificationPreferencesDialog } from './notification-preferences-dialog';

interface ProfileViewProps {
  onNavigate: (view: string) => void;
  onCreateListing: () => void;
}

export function ProfileView({ onNavigate, onCreateListing }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notifPrefsOpen, setNotifPrefsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMyListingsApi(user.id)
      .then(data => setListings(data as Listing[]))
      .catch(() => {})
      .finally(() => setLoadingListings(false));
  }, [user]);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const activeListings = listings.filter(l => l.status === 'available');
  const soldListings = listings.filter(l => l.status === 'sold');
  const totalViews = listings.reduce((sum, l) => sum + (l.view_count ?? 0), 0);

  const planLimits: Record<string, number> = { free: 0, poster: 8, premium: 20 };
  const planLimit = planLimits[user.subscriptionTier] ?? 0;

  const planDesc: Record<string, string> = {
    free: 'Browse only · Ads displayed',
    poster: '8 active listings · No ads',
    premium: '20 active listings · Featured spots',
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFF6EE' }}>

      {/* ── Profile Header ──────────────────────────────────────────────── */}
      <div className="w-full" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8D5C4' }}>
        <div className="mx-auto" style={{ maxWidth: '1400px', padding: '48px' }}>
          <div className="flex items-center" style={{ gap: '36px' }}>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="flex items-center justify-center font-bold"
                style={{
                  width: '110px', height: '110px', borderRadius: '50%',
                  backgroundColor: '#FFF6EE', color: '#F76902', fontSize: '40px',
                }}
              >
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : initials
                }
              </div>
              <button
                onClick={() => setEditProfileOpen(true)}
                className="absolute flex items-center justify-center"
                style={{
                  bottom: '2px', right: '2px', width: '32px', height: '32px',
                  borderRadius: '50%', backgroundColor: '#F76902',
                  border: '2px solid #FFFFFF', cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(247, 105, 2, 0.35)',
                }}
                title="Change photo"
              >
                <Camera size={15} style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* User info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name + verified badge */}
              <div className="flex items-center" style={{ gap: '12px', marginBottom: '6px' }}>
                <h1 className="font-bold" style={{ fontSize: '48px', color: '#402E32', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                  {user.name}
                </h1>
                <div
                  title="Verified RIT Student"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={17} style={{ color: '#FFFFFF' }} />
                </div>
              </div>

              {/* Email + year/major */}
              <p style={{ fontSize: '15px', color: '#B5866E', marginBottom: user.year || user.major ? '6px' : '14px' }}>
                {user.email}
              </p>
              {(user.year || user.major) && (
                <p style={{ fontSize: '15px', color: '#B5866E', marginBottom: '14px' }}>
                  {[user.year, user.major].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* Badges row */}
              <div className="flex items-center" style={{ gap: '14px' }}>
                <div className="flex items-center" style={{ gap: '6px' }}>
                  <Calendar size={15} style={{ color: '#B5866E' }} />
                  <span style={{ fontSize: '14px', color: '#B5866E' }}>RIT Student</span>
                </div>
                <div
                  className="inline-flex items-center"
                  style={{
                    padding: '5px 12px', borderRadius: '100px',
                    backgroundColor: '#FFF6EE', border: '1px solid #E8D5C4',
                    gap: '5px',
                  }}
                >
                  <Star size={13} style={{ color: '#F76902', fill: '#F76902' }} />
                  <span className="font-semibold" style={{ fontSize: '13px', color: '#F76902', textTransform: 'capitalize' }}>
                    {user.subscriptionTier === 'free' ? 'Free Plan' : `${user.subscriptionTier} Plan`}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p style={{ fontSize: '15px', color: '#5A4A44', marginTop: '14px', lineHeight: '1.6', maxWidth: '560px' }}>
                  {user.bio}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center flex-shrink-0" style={{ gap: '10px' }}>
              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center font-medium"
                style={{
                  padding: '11px 20px', borderRadius: '10px', gap: '8px',
                  border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF',
                  color: '#402E32', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(64, 46, 50, 0.06)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F76902'; e.currentTarget.style.color = '#F76902'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8D5C4'; e.currentTarget.style.color = '#402E32'; }}
              >
                <Pencil size={15} />
                Edit Profile
              </button>
              <button
                onClick={signOut}
                className="flex items-center font-medium"
                style={{
                  padding: '11px 20px', borderRadius: '10px', gap: '8px',
                  border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF',
                  color: '#402E32', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(64, 46, 50, 0.06)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FCA5A5'; e.currentTarget.style.color = '#DC2626'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8D5C4'; e.currentTarget.style.color = '#402E32'; }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div
        className="mx-auto"
        style={{ maxWidth: '1400px', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: '28px' }}
      >

        {/* Welcome / Quick Actions bar */}
        <div
          className="flex items-center justify-between bg-white"
          style={{ padding: '24px 32px', borderRadius: '12px', border: '1px solid #E8D5C4' }}
        >
          <div>
            <h2 className="font-semibold" style={{ fontSize: '20px', color: '#402E32', marginBottom: '4px' }}>
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E' }}>
              {activeListings.length} active listing{activeListings.length !== 1 ? 's' : ''} · {totalViews} total views
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <button
              onClick={() => onNavigate('messages')}
              className="flex items-center font-medium transition-all hover:scale-105"
              style={{
                padding: '10px 20px', borderRadius: '8px', border: '1px solid #E8D5C4',
                backgroundColor: '#FFFFFF', color: '#402E32', fontSize: '14px', gap: '8px', cursor: 'pointer',
              }}
            >
              <MessageCircle size={16} />
              Messages
            </button>
            <button
              onClick={onCreateListing}
              className="flex items-center font-semibold transition-all hover:scale-105"
              style={{
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                backgroundColor: '#F76902', color: '#FFFFFF', fontSize: '14px', gap: '8px', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D85802'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F76902'}
            >
              <Plus size={17} />
              New Listing
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            {
              label: 'Active Listings',
              value: activeListings.length,
              sub: planLimit > 0 ? `of ${planLimit} available` : 'Upgrade to post',
              icon: <Package size={18} style={{ color: '#F76902' }} />,
            },
            {
              label: 'Total Views',
              value: totalViews.toLocaleString(),
              sub: 'All time',
              icon: <Eye size={18} style={{ color: '#3B82F6' }} />,
            },
            {
              label: 'Items Sold',
              value: soldListings.length,
              sub: 'All time',
              icon: <DollarSign size={18} style={{ color: '#10B981' }} />,
            },
            {
              label: 'Total Listings',
              value: listings.length,
              sub: 'Including sold',
              icon: <Star size={18} style={{ color: '#F59E0B', fill: '#F59E0B' }} />,
            },
          ].map(({ label, value, sub, icon }) => (
            <div
              key={label}
              className="bg-white transition-shadow hover:shadow-md"
              style={{ borderRadius: '12px', padding: '24px', border: '1px solid #E8D5C4', transitionDuration: '200ms' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <h3 className="font-medium" style={{ fontSize: '14px', color: '#B5866E' }}>{label}</h3>
                {icon}
              </div>
              <p className="font-bold" style={{ fontSize: '28px', color: '#402E32', lineHeight: '1.1' }}>{value}</p>
              <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E', marginTop: '4px' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid" style={{ gridTemplateColumns: '2.5fr 1fr', gap: '28px', alignItems: 'start' }}>

          {/* ── Left: Active Listings ──────────────────────────────────── */}
          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '32px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="font-semibold" style={{ fontSize: '20px', color: '#402E32' }}>Your Active Listings</h2>
              <button
                onClick={() => onNavigate('my-listings')}
                className="flex items-center font-medium transition-opacity hover:opacity-70"
                style={{ fontSize: '14px', color: '#F76902', gap: '4px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
              >
                View All <ArrowUpRight size={15} />
              </button>
            </div>

            {loadingListings ? (
              <p style={{ fontSize: '14px', color: '#B5866E', textAlign: 'center', padding: '32px 0' }}>Loading...</p>
            ) : activeListings.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#B5866E', textAlign: 'center', padding: '32px 0' }}>
                No active listings yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeListings.slice(0, 5).map(listing => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between transition-colors"
                    style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #E8D5C4' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF6EE'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex items-center" style={{ gap: '14px', flex: 1, minWidth: 0 }}>
                      {/* Thumbnail */}
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#FFF6EE', overflow: 'hidden', flexShrink: 0 }}>
                        {listing.listing_images?.[0]?.url ? (
                          <img src={listing.listing_images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                            <Package size={20} style={{ color: '#B5866E' }} />
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          className="font-medium"
                          style={{ fontSize: '15px', color: '#402E32', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {listing.title}
                        </p>
                        <div className="flex items-center" style={{ gap: '14px' }}>
                          <span className="font-semibold" style={{ fontSize: '14px', color: '#F76902' }}>
                            ${listing.price}{listing.type === 'housing' ? '/mo' : ''}
                          </span>
                          <div className="flex items-center" style={{ gap: '4px' }}>
                            <Eye size={13} style={{ color: '#B5866E' }} />
                            <span style={{ fontSize: '13px', color: '#B5866E' }}>{listing.view_count ?? 0} views</span>
                          </div>
                          <span
                            style={{
                              fontSize: '12px', color: '#B5866E', backgroundColor: '#FFF6EE',
                              padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize',
                            }}
                          >
                            {listing.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onCreateListing}
              className="w-full flex items-center justify-center font-medium transition-all"
              style={{
                marginTop: '16px', padding: '14px', borderRadius: '8px',
                border: '1px dashed #E8D5C4', color: '#B5866E', fontSize: '14px',
                gap: '8px', backgroundColor: 'transparent', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFF6EE'; e.currentTarget.style.borderColor = '#F76902'; e.currentTarget.style.color = '#F76902'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#E8D5C4'; e.currentTarget.style.color = '#B5866E'; }}
            >
              <Plus size={16} /> Add New Listing
            </button>
          </div>

          {/* ── Right Column ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Current Plan */}
            <div className="bg-white" style={{ borderRadius: '12px', border: '2px solid #F76902', padding: '24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32' }}>Current Plan</h3>
                <div style={{ padding: '4px 12px', borderRadius: '100px', backgroundColor: '#FFF6EE' }}>
                  <span className="font-semibold" style={{ fontSize: '12px', color: '#F76902', textTransform: 'capitalize' }}>
                    {user.subscriptionTier}
                  </span>
                </div>
              </div>
              <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '16px' }}>
                {planDesc[user.subscriptionTier] ?? ''}
              </p>
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full flex items-center justify-center font-medium transition-colors"
                style={{
                  padding: '10px 16px', borderRadius: '8px', border: '1px solid #F76902',
                  backgroundColor: '#FFFFFF', color: '#F76902', fontSize: '14px', cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF6EE'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                {user.subscriptionTier === 'premium' ? 'Manage Plan' : 'Upgrade Plan'}
              </button>
            </div>

            {/* Trust & Safety */}
            <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
                <Shield size={17} style={{ color: '#F76902' }} />
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32' }}>Trust & Safety</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Email Verified', done: true },
                  { label: 'Phone Verified', done: false },
                  { label: 'ID Verified', done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: '#5A4A44' }}>{label}</span>
                    {done
                      ? <CheckCircle2 size={17} style={{ color: '#10B981' }} />
                      : <span style={{ fontSize: '13px', color: '#B5866E' }}>Not yet</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '24px' }}>
              <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32', marginBottom: '12px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { icon: <Package size={15} style={{ color: '#B5866E' }} />, label: 'My Listings', view: 'my-listings' },
                  { icon: <MessageCircle size={15} style={{ color: '#B5866E' }} />, label: 'Messages', view: 'messages' },
                  { icon: <Heart size={15} style={{ color: '#B5866E' }} />, label: 'Saved Items', view: 'saved' },
                ].map(({ icon, label, view }) => (
                  <button
                    key={label}
                    onClick={() => view && onNavigate(view)}
                    className="flex items-center text-left transition-colors"
                    style={{
                      padding: '10px 12px', borderRadius: '6px', gap: '10px',
                      border: 'none', backgroundColor: 'transparent', cursor: view ? 'pointer' : 'default', width: '100%',
                    }}
                    onMouseEnter={e => { if (view) e.currentTarget.style.backgroundColor = '#FFF6EE'; }}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {icon}
                    <span style={{ fontSize: '14px', color: '#402E32' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Account Settings ──────────────────────────────────────────── */}
        <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E8D5C4', padding: '32px' }}>
          <h2 className="font-semibold" style={{ fontSize: '20px', color: '#402E32', marginBottom: '24px' }}>Account Settings</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { title: 'Change Password', sub: 'Update your password', danger: false, action: () => setChangePasswordOpen(true) },
              { title: 'Notifications', sub: 'Manage preferences', danger: false, action: () => setNotifPrefsOpen(true) },
            ].map(({ title, sub, danger, action }) => (
              <button
                key={title}
                onClick={action}
                className="flex flex-col items-start text-left transition-colors"
                style={{
                  padding: '20px', borderRadius: '8px', cursor: 'pointer', gap: '6px',
                  border: danger ? '1px solid #FEE2E2' : '1px solid #E8D5C4',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = danger ? '#FEF2F2' : '#FFF6EE'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <span className="font-medium" style={{ fontSize: '15px', color: danger ? '#DC2626' : '#402E32' }}>{title}</span>
                <span style={{ fontSize: '13px', color: danger ? '#EF4444' : '#B5866E' }}>{sub}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <NotificationPreferencesDialog
        open={notifPrefsOpen}
        onClose={() => setNotifPrefsOpen(false)}
      />
    </div>
  );
}
