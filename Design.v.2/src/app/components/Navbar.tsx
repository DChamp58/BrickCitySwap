import { Link, useLocation } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { Plus, Package, MessageSquare, User, LogOut } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <nav 
      className="bg-white border-b w-full"
      style={{ 
        height: '72px',
        borderBottomColor: '#E5E7EB'
      }}
    >
      <div className="h-full mx-auto flex items-center" style={{ padding: '0 48px' }}>
        {/* Logo — flex-1 so it balances the right side */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="no-underline">
            <h1 className="text-[24px] font-bold leading-none">
              <span style={{ color: '#111827' }}>BrickCity</span>
              <span style={{ color: '#F76902' }}>Swap</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links — perfectly centred */}
        <div className="flex items-center gap-[32px]">
          <Link 
            to="/housing" 
            className="text-[16px] font-normal no-underline relative group transition-colors"
            style={{ 
              color: isActive('/housing') ? '#F76902' : '#111827',
              transitionDuration: '200ms'
            }}
          >
            Housing
            <span 
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{ 
                backgroundColor: isActive('/housing') ? '#F76902' : '#111827',
                width: isActive('/housing') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </Link>
          <Link 
            to="/marketplace" 
            className="text-[16px] font-normal no-underline relative group transition-colors"
            style={{ 
              color: isActive('/marketplace') ? '#F76902' : '#111827',
              transitionDuration: '200ms'
            }}
          >
            Marketplace
            <span 
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{ 
                backgroundColor: isActive('/marketplace') ? '#F76902' : '#111827',
                width: isActive('/marketplace') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </Link>
          <Link 
            to="/pricing" 
            className="text-[16px] font-normal relative group transition-colors no-underline"
            style={{ 
              color: isActive('/pricing') ? '#F76902' : '#111827',
              transitionDuration: '200ms'
            }}
          >
            Pricing
            <span 
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{ 
                backgroundColor: isActive('/pricing') ? '#F76902' : '#111827',
                width: isActive('/pricing') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </Link>
        </div>

        {/* Profile Dropdown — flex-1 so it mirrors the logo side */}
        <div className="flex-1 flex items-center justify-end">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="text-[16px] font-normal hover:opacity-70 transition-opacity"
              style={{ 
                color: isActive('/profile') || isActive('/post') || isActive('/listings') || isActive('/messages') ? '#F76902' : '#111827',
                padding: '8px 16px'
              }}
            >
              Profile
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div
                className="absolute bg-white"
                style={{
                  top: 'calc(100% + 12px)',
                  right: '0',
                  width: '220px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  padding: '8px',
                  zIndex: 50
                }}
              >
                {/* Post - Featured Action */}
                <Link
                  to="/post"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-opacity-100 transition-all"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    gap: '12px',
                    backgroundColor: '#FEF3EC'
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#F76902'
                    }}
                  >
                    <Plus size={18} style={{ color: '#FFFFFF' }} />
                  </div>
                  <span
                    className="font-semibold"
                    style={{ fontSize: '15px', color: '#F76902' }}
                  >
                    Post
                  </span>
                </Link>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />

                {/* My Listings */}
                <Link
                  to="/listings"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    gap: '12px'
                  }}
                >
                  <Package size={18} style={{ color: '#6B7280' }} />
                  <span
                    className="font-normal"
                    style={{ fontSize: '15px', color: '#111827' }}
                  >
                    My Listings
                  </span>
                </Link>

                {/* Messages */}
                <Link
                  to="/messages"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    gap: '12px'
                  }}
                >
                  <MessageSquare size={18} style={{ color: '#6B7280' }} />
                  <span
                    className="font-normal"
                    style={{ fontSize: '15px', color: '#111827' }}
                  >
                    Messages
                  </span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center no-underline hover:bg-gray-50 transition-colors"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    gap: '12px'
                  }}
                >
                  <User size={18} style={{ color: '#6B7280' }} />
                  <span
                    className="font-normal"
                    style={{ fontSize: '15px', color: '#111827' }}
                  >
                    Profile
                  </span>
                </Link>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />

                {/* Sign Out */}
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    console.log('Sign out clicked');
                  }}
                  className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={18} style={{ color: '#6B7280' }} />
                  <span
                    className="font-normal"
                    style={{ fontSize: '15px', color: '#111827' }}
                  >
                    Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}