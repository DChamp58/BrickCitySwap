import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth-context';
import { saveListing, unsaveListing, fetchSavedListings } from '@/lib/api';
import { toast } from 'sonner';

interface SavedContextType {
  savedIds: Set<string>;
  loading: boolean;
  toggleSave: (listingId: string) => Promise<void>;
  isSaved: (listingId: string) => boolean;
  refresh: () => Promise<void>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setSavedIds(new Set()); return; }
    setLoading(true);
    try {
      const data = await fetchSavedListings(user.id);
      setSavedIds(new Set(data.map((row: { listing_id: string }) => row.listing_id)));
    } catch {
      // silently fail — saved state just won't show
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggleSave = useCallback(async (listingId: string) => {
    if (!user) return;
    const currently = savedIds.has(listingId);
    // Optimistic update
    setSavedIds(prev => {
      const next = new Set(prev);
      currently ? next.delete(listingId) : next.add(listingId);
      return next;
    });
    try {
      if (currently) {
        await unsaveListing(user.id, listingId);
      } else {
        await saveListing(user.id, listingId);
        toast.success('Saved!');
      }
    } catch {
      // Revert on failure
      setSavedIds(prev => {
        const next = new Set(prev);
        currently ? next.add(listingId) : next.delete(listingId);
        return next;
      });
      toast.error('Failed to update saved listing');
    }
  }, [user, savedIds]);

  const isSaved = useCallback((listingId: string) => savedIds.has(listingId), [savedIds]);

  return (
    <SavedContext.Provider value={{ savedIds, loading, toggleSave, isSaved, refresh: load }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
}
