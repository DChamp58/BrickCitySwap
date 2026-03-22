import { Link, useLocation } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { Plus, Package, MessageSquare, User, LogOut, Menu, X } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
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

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinkStyle = (path: string) => ({
    color: isActive(path) ? '#F76902' : '#111827',
    transitionDuration: '200ms',
  });

  return (
    <nav
      className="bg-white border-b w-full sticky top-0 z-50"
      style={{ borderBottomColor: '#E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="h-[72px] mx-auto flex items-center justify-between" style={{ padding: '0 24px', maxWidth: '1400px' }}>
        {/* Logo */}
        <Link to="/" className="no-underline flex-shrink-0">
          <h1 className="text-[22px] font-bold leading-none">
            <span style={{ color: '#111827' }}>BrickCity</span>
            <span style={{ color: '#F76902' }}>Swap</span>
          </h1>
        </Link>

        {/* Desktop Nav Links — centered */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/housing', label: 'Housing' },
            { to: '/marketplace', label: 'Marketplace' },
            { to: '/pricing', label: 'Pricing' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-[15px] font-normal no-underline relative group transition-colors"
              style={navLinkStyle(to)}
            >
              {label}
              <span
                className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all duration-200"
                style={{
                  backgroundColor: isActive(to) ? '#F76902' : '#111827',
                  width: isActive(to) ? '100%' : '0',
                }}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Right: Post button + Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Post a Listing CTA */}
          <Link
            to="/post"
            className="no-underline flex items-center gap-2 font-semibold text-white transition-all"
            style={{
              backgroundColor: '#F76902',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(247,105,2,0.35)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#D55A02';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F76902';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <Plus size={15} />
            Post
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 font-medium transition-all rounded-lg"
              style={{
                color: isActive('/profile') || isActive('/listings') || isActive('/messages') ? '#F76902' : '#111827',
                padding: '8px 14px',
                border: '1px solid #E5E7EB',
                backgroundColor: isProfileDropdownOpen ? '#F9FAFB' : 'transparent',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              <User size={16} />
              Profile
            </button>

            {isProfileDropdownOpen && (
              <div
                className="absolute bg-white"
                style={{
                  top: 'calc(100% + 8px)',
                  right: '0',
                  width: '220px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  padding: '8px',
                  zIndex: 50,
                }}
              >
                <Link
                  to="/listings"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ padding: '10px 16px', gap: '12px' }}
                >
                  <Package size={18} style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '15px', color: '#111827' }}>My Listings</span>
                </Link>

                <Link
                  to="/messages"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ padding: '10px 16px', gap: '12px' }}
                >
                  <MessageSquare size={18} style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '15px', color: '#111827' }}>Messages</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ padding: '10px 16px', gap: '12px' }}
                >
                  <User size={18} style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '15px', color: '#111827' }}>Profile</span>
                </Link>

                <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    console.log('Sign out clicked');
                  }}
                  className="flex items-center w-full text-left hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ padding: '10px 16px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  <LogOut size={18} style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '15px', color: '#111827' }}>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden items-center justify-center rounded-lg transition-colors"
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid #E5E7EB',
            backgroundColor: isMobileMenuOpen ? '#F9FAFB' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} style={{ color: '#111827' }} /> : <Menu size={20} style={{ color: '#111827' }} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t"
          style={{ borderColor: '#E5E7EB', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          {[
            { to: '/housing', label: 'Housing' },
            { to: '/marketplace', label: 'Marketplace' },
            { to: '/pricing', label: 'Pricing' },
            { to: '/listings', label: 'My Listings' },
            { to: '/messages', label: 'Messages' },
            { to: '/profile', label: 'Profile' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="no-underline font-medium rounded-lg transition-colors"
              style={{
                padding: '12px 16px',
                color: isActive(to) ? '#F76902' : '#111827',
                backgroundColor: isActive(to) ? '#FEF3EC' : 'transparent',
                fontSize: '16px',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
          <Link
            to="/post"
            className="no-underline flex items-center justify-center gap-2 font-semibold text-white rounded-lg"
            style={{
              backgroundColor: '#F76902',
              padding: '13px 16px',
              fontSize: '15px',
            }}
          >
            <Plus size={16} />
            Post a Listing
          </Link>
        </div>
      )}
    </nav>
  );
}
