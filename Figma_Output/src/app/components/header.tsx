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

  return (
    <nav
      className="bg-white border-b w-full sticky top-0 z-50"
      style={{ height: '72px', borderBottomColor: '#E5E7EB' }}
    >
      <div className="h-full mx-auto flex items-center" style={{ padding: '0 48px' }}>
        {/* Logo */}
        <div className="flex-1 flex items-center">
          <button
            onClick={() => onViewChange('home')}
            className="no-underline"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <h1 className="text-[24px] font-bold leading-none" style={{ fontSize: '24px' }}>
              <span style={{ color: '#111827' }}>BrickCity</span>
              <span style={{ color: '#F76902' }}>Swap</span>
            </h1>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-[32px]">
          <button
            onClick={() => onViewChange('housing')}
            className="text-[16px] font-normal relative group transition-colors"
            style={{
              color: isActive('housing') ? '#F76902' : '#111827',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Housing
            <span
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{
                backgroundColor: isActive('housing') ? '#F76902' : '#111827',
                width: isActive('housing') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </button>
          <button
            onClick={() => onViewChange('marketplace')}
            className="text-[16px] font-normal relative group transition-colors"
            style={{
              color: isActive('marketplace') ? '#F76902' : '#111827',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Marketplace
            <span
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{
                backgroundColor: isActive('marketplace') ? '#F76902' : '#111827',
                width: isActive('marketplace') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </button>
          <button
            onClick={() => onViewChange('pricing')}
            className="text-[16px] font-normal relative group transition-colors"
            style={{
              color: isActive('pricing') ? '#F76902' : '#111827',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            Pricing
            <span
              className="absolute left-0 bottom-[-4px] h-[2px] group-hover:w-full transition-all"
              style={{
                backgroundColor: isActive('pricing') ? '#F76902' : '#111827',
                width: isActive('pricing') ? '100%' : '0',
                transitionDuration: '200ms'
              }}
            />
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="flex-1 flex items-center justify-end">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="text-[16px] font-normal hover:opacity-70 transition-opacity"
              style={{
                color: isActive('profile') || isActive('my-listings') || isActive('messages') ? '#F76902' : '#111827',
                padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              {user ? 'Profile' : 'Sign In'}
            </button>

            {isProfileDropdownOpen && (
              <div
                className="absolute bg-white"
                style={{
                  top: 'calc(100% + 12px)', right: '0', width: '220px',
                  borderRadius: '12px', border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  padding: '8px', zIndex: 50
                }}
              >
                {user && (
                  <>
                    {/* Post - Featured Action */}
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onCreateListing(); }}
                      className="flex items-center w-full text-left transition-all"
                      style={{
                        padding: '12px 16px', borderRadius: '8px', gap: '12px',
                        backgroundColor: '#FEF3EC', border: 'none', cursor: 'pointer'
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F76902' }}
                      >
                        <Plus size={18} style={{ color: '#FFFFFF' }} />
                      </div>
                      <span className="font-semibold" style={{ fontSize: '15px', color: '#F76902' }}>Post</span>
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
                  </>
                )}

                {user && (
                  <>
                    {/* My Listings */}
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onViewChange('my-listings'); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <Package size={18} style={{ color: '#6B7280' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#111827' }}>My Listings</span>
                    </button>

                    {/* Messages */}
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onViewChange('messages'); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <MessageSquare size={18} style={{ color: '#6B7280' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#111827' }}>
                        Messages
                        {unreadCount > 0 && (
                          <span
                            style={{
                              marginLeft: '8px', backgroundColor: '#F76902', color: '#FFFFFF',
                              fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 600
                            }}
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </span>
                    </button>
                  </>
                )}

                {/* Profile / Sign In */}
                <button
                  onClick={() => { setIsProfileDropdownOpen(false); onViewChange('profile'); }}
                  className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                  style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  <User size={18} style={{ color: '#6B7280' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#111827' }}>
                    {user ? 'Profile' : 'Sign In'}
                  </span>
                </button>

                {user && (
                  <>
                    <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); signOut(); }}
                      className="flex items-center w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ padding: '10px 16px', borderRadius: '8px', gap: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    >
                      <LogOut size={18} style={{ color: '#6B7280' }} />
                      <span className="font-normal" style={{ fontSize: '15px', color: '#111827' }}>Sign Out</span>
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
