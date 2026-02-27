import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/auth-context';
import { Header } from './components/header';
import { AuthView } from './components/auth-view';
import { ListingsView } from './components/listings-view';
import { MyListingsView } from './components/my-listings-view';
import { CreateListingDialog } from './components/create-listing-dialog';
import { ContactDialog } from './components/contact-dialog';
import { ListingDetailDialog } from './components/listing-detail-dialog';
import { HeroSection } from './components/hero-section';
import { HomeView } from './components/home-view';
import { PricingView } from './components/pricing-view';
import { Footer } from './components/footer';
import { Listing } from './components/listing-card';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent } from './components/ui/card';

type View = 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing';

function AppContent() {
  const { user, accessToken, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showHero, setShowHero] = useState(true);

  const handleCreateListing = () => {
    if (!user) {
      setCurrentView('profile');
      return;
    }
    setCreateDialogOpen(true);
  };

  const handleContactSeller = (listing: Listing) => {
    if (!user) {
      setCurrentView('profile');
      return;
    }
    setSelectedListing(listing);
    setContactDialogOpen(true);
  };

  const handleViewListing = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailDialogOpen(true);
  };

  const handleListingCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐯</div>
          <div className="text-xl font-semibold">Loading BrickCitySwap...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateListing={handleCreateListing}
      />

      <main className="pb-12">
        {currentView === 'profile' && <AuthView />}
        
        {currentView === 'home' && (
          <div key={`home-${refreshKey}`}>
            <HomeView onNavigate={setCurrentView} />
          </div>
        )}
        
        {currentView === 'housing' && (
          <div key={`housing-${refreshKey}`}>
            <ListingsView
              type="housing"
              onContact={handleContactSeller}
              onView={handleViewListing}
            />
          </div>
        )}
        
        {currentView === 'marketplace' && (
          <div key={`marketplace-${refreshKey}`}>
            <ListingsView
              type="marketplace"
              onContact={handleContactSeller}
              onView={handleViewListing}
            />
          </div>
        )}

        {currentView === 'my-listings' && (
          user ? (
            <div key={`my-listings-${refreshKey}`}>
              <MyListingsView
                accessToken={accessToken}
                onView={handleViewListing}
              />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6">
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-lg mb-4">Please sign in to view your listings</p>
                </CardContent>
              </Card>
            </div>
          )
        )}

        {currentView === 'pricing' && (
          <div key={`pricing-${refreshKey}`}>
            <PricingView />
          </div>
        )}
      </main>

      {/* Free user ad */}
      {user && user.subscriptionTier === 'free' && currentView !== 'profile' && currentView !== 'pricing' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#F76902] to-[#D85802] text-white p-3 text-center text-sm shadow-lg">
          <span className="mr-4">Want to post listings and remove ads? Start at just $2.99/month!</span>
          <button
            onClick={() => setCurrentView('pricing')}
            className="bg-white text-[#F76902] px-4 py-1 rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            View Plans
          </button>
        </div>
      )}

      <CreateListingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        accessToken={accessToken}
        onListingCreated={handleListingCreated}
      />

      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        listing={selectedListing}
        accessToken={accessToken}
      />

      <ListingDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        listing={selectedListing}
        onContact={handleContactSeller}
        showContactButton={!!user}
      />

      <Toaster />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}