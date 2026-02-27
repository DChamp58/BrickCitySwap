import React from 'react';
import { Home, Package, User, LogOut, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './auth-context';
import pricingIcon from 'figma:asset/57339c2f1c137c45ea12885696f5320e34a64609.png';

interface HeaderProps {
  currentView: 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing';
  onViewChange: (view: 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing') => void;
  onCreateListing: () => void;
}

export function Header({ currentView, onViewChange, onCreateListing }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-[#F76902] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="text-2xl font-bold">🐯 BrickCitySwap</div>
            <span className="hidden sm:inline text-sm opacity-90">RIT Student Housing Marketplace</span>
          </button>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'housing' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('housing')}
              className={currentView === 'housing' ? '' : 'text-white hover:bg-white/20'}
            >
              <Home className="w-4 h-4 mr-2" />
              Housing
            </Button>
            
            <Button
              variant={currentView === 'marketplace' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('marketplace')}
              className={currentView === 'marketplace' ? '' : 'text-white hover:bg-white/20'}
            >
              <Package className="w-4 h-4 mr-2" />
              Marketplace
            </Button>

            <Button
              variant={currentView === 'pricing' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('pricing')}
              className={currentView === 'pricing' ? '' : 'text-white hover:bg-white/20'}
            >
              <img src={pricingIcon} alt="Pricing" className="w-4 h-4 mr-1 brightness-0 invert" />
              Pricing
            </Button>

            {user && (
              <>
                <Button
                  variant={currentView === 'my-listings' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('my-listings')}
                  className={currentView === 'my-listings' ? '' : 'text-white hover:bg-white/20'}
                >
                  My Listings
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateListing}
                  className="text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </>
            )}
            
            <Button
              variant={currentView === 'profile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('profile')}
              className={currentView === 'profile' ? '' : 'text-white hover:bg-white/20'}
            >
              <User className="w-4 h-4 mr-2" />
              {user ? 'Profile' : 'Sign In'}
            </Button>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}