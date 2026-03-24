import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/auth-context';
import { MessagingProvider } from './components/messaging-context';
import { Header } from './components/header';
import { AuthView } from './components/auth-view';
import { ListingsView } from './components/listings-view';
import { MyListingsView } from './components/my-listings-view';
import { MessagesView } from './components/messages-view';
import { CreateListingDialog } from './components/create-listing-dialog';
import { ContactDialog } from './components/contact-dialog';
import { ListingDetailDialog } from './components/listing-detail-dialog';
import { HomeView } from './components/home-view';
import { PricingView } from './components/pricing-view';
import { Footer } from './components/footer';
import { Listing } from './components/listing-card';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent } from './components/ui/card';
import { recordListingView } from '@/lib/api';

type View = 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing' | 'messages';

function AppContent() {
  const { user, accessToken, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openConversationId, setOpenConversationId] = useState<string | null>(null);

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
    // Record the view if user is logged in and not viewing their own listing
    if (user && listing.user_id !== user.id) {
      recordListingView(listing.id, user.id);
    }
  };

  const handleListingCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleConversationStarted = (conversationId: string) => {
    setOpenConversationId(conversationId);
    setCurrentView('messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="text-center">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <span style={{ color: '#111827', fontWeight: 700 }}>BrickCity</span>
            <span style={{ color: '#F76902', fontWeight: 700 }}>Swap</span>
          </div>
          <div style={{ fontSize: '16px', color: '#6B7280' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateListing={handleCreateListing}
      />

      <main>
        {currentView === 'profile' && <AuthView />}

        {currentView === 'home' && (
          <div key={`home-${refreshKey}`}>
            <HomeView onNavigate={setCurrentView} onView={handleViewListing} />
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

        {currentView === 'messages' && (
          <div key={`messages-${openConversationId}`}>
            <MessagesView openConversationId={openConversationId} />
          </div>
        )}
      </main>

      {/* Free user ad */}
      {user && user.subscriptionTier === 'free' && currentView !== 'profile' && currentView !== 'pricing' && (
        <div
          className="fixed bottom-0 left-0 right-0 text-white text-center text-sm"
          style={{
            background: 'linear-gradient(135deg, #F76902, #D55A02)',
            padding: '12px 24px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            zIndex: 40
          }}
        >
          <span style={{ marginRight: '16px' }}>Want to post listings and remove ads? Start at just $2.99/month!</span>
          <button
            onClick={() => setCurrentView('pricing')}
            style={{
              backgroundColor: '#FFFFFF', color: '#F76902',
              padding: '6px 16px', borderRadius: '6px',
              fontWeight: 600, border: 'none', cursor: 'pointer',
              fontSize: '14px'
            }}
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
        onConversationStarted={handleConversationStarted}
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
      <MessagingProvider>
        <AppContent />
      </MessagingProvider>
    </AuthProvider>
  );
}
