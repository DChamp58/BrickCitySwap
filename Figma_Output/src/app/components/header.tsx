import { useState, useRef, useEffect } from 'react';
import { Plus, Package, MessageSquare, User, LogOut, Menu, X, Home, Tag, DollarSign } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (view: View) => currentView === view;

  // Close dropdown on outside click
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

  // Close mobile menu on navigation
  const navigate = (view: View) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  // Desktop nav link
  const NavLink = ({ id, label, views }: { id: string; label: string; views: View[] }) => {
    const active = views.some(v => isActive(v));
    const hovered = hoveredNav === id;
    return (
      <button
        onClick={() => navigate(views[0])}
        onMouseEnter={() => setHoveredNav(id)}
        onMouseLeave={() => setHoveredNav(null)}
        style={{
          position: 'relative', fontSize: '16px', fontWeight: 500,
          color: active || hovered ? '#F76902' : '#402E32',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '7px 14px', borderRadius: '8px',
          transition: 'color 180ms ease',
        }}
      >
        {label}
        <span style={{
          position: 'absolute', bottom: '2px', left: '14px', right: '14px',
          height: '2px', backgroundColor: '#F76902', borderRadius: '1px',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
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
    <>
      <nav
        className="bg-white border-b w-full sticky top-0 z-50"
        style={{ borderBottomColor: '#E8D5C4' }}
      >
        <div className="h-full mx-auto flex items-center" style={{ height: '72px', padding: '0 24px' }}>

          {/* Logo */}
          <div className="flex-1 flex items-center">
            <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <h1 className="font-bold leading-none" style={{ fontSize: '22px' }}>
                <span style={{ color: '#402E32' }}>BrickCity</span>
                <span style={{ color: '#F76902' }}>Swap</span>
              </h1>
            </button>
          </div>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
            <NavLink id="housing"     label="Housing"     views={['housing']} />
            <NavLink id="marketplace" label="Marketplace" views={['marketplace']} />
            <NavLink id="pricing"     label="Pricing"     views={['pricing']} />
          </div>

          {/* Desktop profile area — hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-end">
            <div className="relative flex items-center" style={{ gap: '4px' }} ref={dropdownRef}>
              {/* Name / Sign In */}
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                onMouseEnter={() => setHoveredNav('name')}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  position: 'relative', fontSize: '16px', fontWeight: 500,
                  color: profileActive || nameHovered ? '#F76902' : '#402E32',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '7px 14px', borderRadius: '8px',
                  transition: 'color 180ms ease',
                }}
              >
                {user ? user.name.split(' ')[0] : 'Sign In'}
                <span style={{
                  position: 'absolute', bottom: '2px', left: '14px', right: '14px',
                  height: '2px', backgroundColor: '#F76902', borderRadius: '1px',
                  transform: profileActive ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'center',
                  transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </button>

              {/* Avatar */}
              {user && (
                <button
                  onClick={() => { setIsProfileDropdownOpen(false); navigate('profile'); }}
                  onMouseEnter={() => setHoveredNav('avatar')}
                  onMouseLeave={() => setHoveredNav(null)}
                  title="Go to profile"
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#FFF6EE', border: 'none',
                    cursor: 'pointer', overflow: 'hidden', flexShrink: 0, padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: avatarHovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: avatarHovered ? '0 0 0 3px rgba(247,105,2,0.35)' : '0 0 0 2px #F76902',
                    transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease',
                  }}
                >
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '14px', fontWeight: 700, color: '#F76902' }}>{user.name?.charAt(0).toUpperCase() ?? '?'}</span>
                  }
                </button>
              )}

              {/* Desktop dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute bg-white" style={{ top: 'calc(100% + 12px)', right: 0, width: '220px', borderRadius: '12px', border: '1px solid #E8D5C4', boxShadow: '0 4px 16px rgba(64,46,50,0.08)', padding: '8px', zIndex: 50 }}>
                  {user && (
                    <>
                      <button onClick={() => { setIsProfileDropdownOpen(false); onCreateListing(); }} className="flex items-center w-full text-left" style={{ padding: '12px 16px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFF6EE', border: 'none', cursor: 'pointer' }}>
                        <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F76902' }}>
                          <Plus size={18} style={{ color: '#fff' }} />
                        </div>
                        <span className="font-semibold" style={{ fontSize: '15px', color: '#F76902' }}>Post</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />
                      <button onClick={() => navigate('my-listings')} className="flex items-center w-full text-left hover:bg-gray-50 transition-colors" style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        <Package size={18} style={{ color: '#B5866E' }} />
                        <span style={{ fontSize: '15px', color: '#402E32' }}>My Listings</span>
                      </button>
                      <button onClick={() => navigate('messages')} className="flex items-center w-full text-left hover:bg-gray-50 transition-colors" style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        <MessageSquare size={18} style={{ color: '#B5866E' }} />
                        <span style={{ fontSize: '15px', color: '#402E32' }}>
                          Messages
                          {unreadCount > 0 && <span style={{ marginLeft: '8px', backgroundColor: '#F76902', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                        </span>
                      </button>
                    </>
                  )}
                  <button onClick={() => navigate('profile')} className="flex items-center w-full text-left hover:bg-gray-50 transition-colors" style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <User size={18} style={{ color: '#B5866E' }} />
                    <span style={{ fontSize: '15px', color: '#402E32' }}>{user ? 'Profile' : 'Sign In'}</span>
                  </button>
                  {user && (
                    <>
                      <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />
                      <button onClick={() => { setIsProfileDropdownOpen(false); signOut(); }} className="flex items-center w-full text-left hover:bg-gray-50 transition-colors" style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        <LogOut size={18} style={{ color: '#B5866E' }} />
                        <span style={{ fontSize: '15px', color: '#402E32' }}>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile right side: avatar + hamburger */}
          <div className="flex md:hidden items-center" style={{ gap: '12px' }}>
            {user && (
              <button
                onClick={() => navigate('profile')}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  backgroundColor: '#FFF6EE', border: 'none',
                  cursor: 'pointer', overflow: 'hidden', flexShrink: 0, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 2px #F76902',
                }}
              >
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '13px', fontWeight: 700, color: '#F76902' }}>{user.name?.charAt(0).toUpperCase() ?? '?'}</span>
                }
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isMobileMenuOpen
                ? <X size={24} style={{ color: '#402E32' }} />
                : <Menu size={24} style={{ color: '#402E32' }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu — slides down */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white" style={{ borderTop: '1px solid #E8D5C4', padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* Nav links */}
            {[
              { id: 'home',        label: 'Home',        icon: <Home size={18} />,       view: 'home' as View },
              { id: 'housing',     label: 'Housing',     icon: <User size={18} />,       view: 'housing' as View },
              { id: 'marketplace', label: 'Marketplace', icon: <Tag size={18} />,        view: 'marketplace' as View },
              { id: 'pricing',     label: 'Pricing',     icon: <DollarSign size={18} />, view: 'pricing' as View },
            ].map(({ id, label, icon, view }) => (
              <button
                key={id}
                onClick={() => navigate(view)}
                className="flex items-center w-full text-left"
                style={{
                  padding: '13px 16px', borderRadius: '10px', gap: '14px',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: isActive(view) ? '#FFF6EE' : 'transparent',
                  color: isActive(view) ? '#F76902' : '#402E32',
                  fontSize: '16px', fontWeight: isActive(view) ? 600 : 400,
                }}
              >
                <span style={{ color: isActive(view) ? '#F76902' : '#B5866E' }}>{icon}</span>
                {label}
              </button>
            ))}

            {user && (
              <>
                <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />

                {/* Post */}
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onCreateListing(); }}
                  className="flex items-center w-full text-left"
                  style={{ padding: '13px 16px', borderRadius: '10px', gap: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#FFF6EE' }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#F76902', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Plus size={16} style={{ color: '#fff' }} />
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#F76902' }}>Post a Listing</span>
                </button>

                <button onClick={() => navigate('my-listings')} className="flex items-center w-full text-left" style={{ padding: '13px 16px', borderRadius: '10px', gap: '14px', border: 'none', cursor: 'pointer', backgroundColor: isActive('my-listings') ? '#FFF6EE' : 'transparent', color: isActive('my-listings') ? '#F76902' : '#402E32', fontSize: '16px' }}>
                  <Package size={18} style={{ color: isActive('my-listings') ? '#F76902' : '#B5866E' }} />
                  My Listings
                </button>

                <button onClick={() => navigate('messages')} className="flex items-center w-full text-left" style={{ padding: '13px 16px', borderRadius: '10px', gap: '14px', border: 'none', cursor: 'pointer', backgroundColor: isActive('messages') ? '#FFF6EE' : 'transparent', color: isActive('messages') ? '#F76902' : '#402E32', fontSize: '16px' }}>
                  <MessageSquare size={18} style={{ color: isActive('messages') ? '#F76902' : '#B5866E' }} />
                  Messages
                  {unreadCount > 0 && <span style={{ marginLeft: '8px', backgroundColor: '#F76902', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>

                <div style={{ height: '1px', backgroundColor: '#E8D5C4', margin: '8px 0' }} />

                <button
                  onClick={() => { setIsMobileMenuOpen(false); signOut(); }}
                  className="flex items-center w-full text-left"
                  style={{ padding: '13px 16px', borderRadius: '10px', gap: '14px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#B5866E', fontSize: '16px' }}
                >
                  <LogOut size={18} style={{ color: '#B5866E' }} />
                  Sign Out
                </button>
              </>
            )}

            {!user && (
              <button onClick={() => navigate('profile')} className="flex items-center w-full text-left" style={{ padding: '13px 16px', borderRadius: '10px', gap: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F76902', color: '#fff', fontSize: '16px', fontWeight: 600, marginTop: '8px' }}>
                <User size={18} style={{ color: '#fff' }} />
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
