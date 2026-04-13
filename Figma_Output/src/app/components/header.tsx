import { useState, useRef, useEffect } from 'react';
import { Plus, Package, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from './auth-context';
import { useMessaging } from './messaging-context';

type View = 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing' | 'messages';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onCreateListing: () => void;
}

export function Header({ currentView, onViewChange, onCreateListing }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { getUnreadCount } = useMessaging();
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (view: View) => currentView === view;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Nav link with pill + lift + center-grow underline
  const NavLink = ({ id, label, views }: { id: string; label: string; views: View[] }) => {
    const active = views.some(v => isActive(v));
    const hovered = hoveredNav === id;
    const lit = active || hovered;
    return (
      <button
        onClick={() => onViewChange(views[0])}
        onMouseEnter={() => setHoveredNav(id)}
        onMouseLeave={() => setHoveredNav(null)}
        style={{
          position: 'relative', fontSize: '16px', fontWeight: 500,
          color: lit ? '#F76902' : '#402E32',
          background: lit ? 'rgba(247, 105, 2, 0.07)' : 'transparent',
          border: 'none', cursor: 'pointer',
          padding: '7px 14px', borderRadius: '8px',
          transform: hovered && !active ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'color 180ms ease, background 180ms ease, transform 180ms ease',
        }}
      >
        {label}
        {/* Center-grow underline */}
        <span style={{
          position: 'absolute', bottom: '2px', left: '14px',
          right: '14px', height: '2px',
          backgroundColor: '#F76902',
          borderRadius: '1px',
          transform: lit ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </button>
    );
  };

  const profileActive = isActive('profile') || isActive('my-listings') || isActive('messages');
  const nameHovered = hoveredNav === 'name';
  const avatarHovered = hoveredNav === 'avatar';

  return (
    <nav
      className="bg-white border-b w-full sticky top-0 z-50"
      style={{ height: '72px', borderBottomColor: '#E8D5C4' }}
    >
      <div className="h-full mx-auto flex items-center" style={{ padding: '0 48px' }}>
        {/* Logo */}
        <div className="flex-1 flex items-center">
          <button
            onClick={() => onViewChange('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <h1 className="font-bold leading-none" style={{ fontSize: '24px' }}>
              <span style={{ color: '#402E32' }}>BrickCity</span>
              <span style={{ color: '#F76902' }}>Swap</span>
            </h1>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center" style={{ gap: '4px' }}>
          <NavLink id="housing"     label="Housing"     views={['housing']} />
          <NavLink id="marketplace" label="Marketplace" views={['marketplace']} />
          <NavLink id="pricing"     label="Pricing"     views={['pricing']} />
        </div>

        {/* Profile area */}
        <div className="flex-1 flex items-center justify-end">
          <div className="relative flex items-center" style={{ gap: '4px' }} ref={dropdownRef}>

            {/* Name / Sign In button */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onMouseEnter={() => setHoveredNav('name')}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                position: 'relative', fontSize: '16px', fontWeight: 500,
                color: profileActive || nameHovered ? '#F76902' : '#402E32',
                background: profileActive || nameHovered ? 'rgba(247, 105, 2, 0.07)' : 'transparent',
                border: 'none', cursor: 'pointer',
                padding: '7px 14px', borderRadius: '8px',
                transform: nameHovered && !profileActive ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'color 180ms ease, background 180ms ease, transform 180ms ease',
              }}
            >
              {user ? user.name.split(' ')[0] : 'Sign In'}
              <span style={{
                position: 'absolute', bottom: '2px', left: '14px', right: '14px',
                height: '2px', backgroundColor: '#F76902', borderRadius: '1px',
                transform: profileActive || nameHovered ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }} />
            </button>

            {/* Avatar — navigates directly to profile */}
            {user && (
              <button
                onClick={() => { setIsProfileDropdownOpen(false); onViewChange('profile'); }}
                onMouseEnter={() => setHoveredNav('avatar')}
                onMouseLeave={() => setHoveredNav(null)}
                title="Go to profile"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#FFF6EE',
                  border: 'none', cursor: 'pointer', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, padding: 0,
                  transform: avatarHovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: avatarHovered
                    ? '0 0 0 3px rgba(247, 105, 2, 0.35)'
                    : '0 0 0 2px #F76902',
                  transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease',
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F76902' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </button>
            )}

            {/* Dropdown */}
            {isProfileDropdownOpen && (
              <div
                className="absolute bg-white"
                style={{
                  top: 'calc(100% + 12px)', right: '0', width: '220px',
                  borderRadius: '12px', border: '1px solid #E8D5C4',
                  boxShadow: '0 4px 16px rgba(64, 46, 50, 0.08)',
                  padding: '8px', zIndex: 50
                }}
              >
                {user && (
                  <>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onCreateListing(); }}
                      className="flex items-center w-full text-left transition-all"
                      style={{ padding: '12px 16px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFF6EE', border: 'none', cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F76902' }}>
                        <Plus size={18} style={{ color: '#FFFFFF' }} />
                      </div>
                      <span className="font-semibold" style={{ fontSize: '15px', color: '#F76902' }}>Post</span>
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />
                  </>
                )}

                {user && (
                  <>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onViewChange('my-listings'); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <Package size={18} style={{ color: '#B5866E' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#402E32' }}>My Listings</span>
                    </button>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onViewChange('messages'); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <MessageSquare size={18} style={{ color: '#B5866E' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#402E32' }}>
                        Messages
                        {unreadCount > 0 && (
                          <span style={{ marginLeft: '8px', backgroundColor: '#F76902', color: '#FFFFFF', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => { setIsProfileDropdownOpen(false); onViewChange('profile'); }}
                  className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                  style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  <User size={18} style={{ color: '#B5866E' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#402E32' }}>{user ? 'Profile' : 'Sign In'}</span>
                </button>

                {user && (
                  <>
                    <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); signOut(); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <LogOut size={18} style={{ color: '#B5866E' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#402E32' }}>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
