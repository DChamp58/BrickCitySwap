import { supabase } from './supabase';
import type { Database, ListingWithImages } from './database.types';

type ListingInsert = Database['public']['Tables']['listings']['Insert'];
type ListingUpdate = Database['public']['Tables']['listings']['Update'];

// ── Listings ────────────────────────────────────────────────────────────────

export async function fetchListings(type: 'housing' | 'marketplace') {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*), profiles(full_name, avatar_url)')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ListingWithImages[];
}

export async function fetchMyListings(userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ListingWithImages[];
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*), profiles(full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ListingWithImages;
}

export async function createListing(listing: ListingInsert) {
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateListing(id: string, updates: ListingUpdate) {
  const { data, error } = await supabase
    .from('listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteListing(id: string) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ── Images ──────────────────────────────────────────────────────────────────

export async function uploadListingImage(
  file: File,
  listingId: string,
  position: number
) {
  const ext = file.name.split('.').pop();
  const path = `${listingId}/${position}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('listing-images')
    .getPublicUrl(path);

  // Save image record in DB
  const { error: dbError } = await supabase
    .from('listing_images')
    .insert({
      listing_id: listingId,
      url: urlData.publicUrl,
      position,
    });

  if (dbError) throw dbError;

  return urlData.publicUrl;
}

// ── Saved Listings ──────────────────────────────────────────────────────────

export async function saveListing(userId: string, listingId: string) {
  const { error } = await supabase
    .from('saved_listings')
    .insert({ user_id: userId, listing_id: listingId });

  if (error) throw error;
}

export async function unsaveListing(userId: string, listingId: string) {
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId);

  if (error) throw error;
}

export async function fetchSavedListings(userId: string) {
  const { data, error } = await supabase
    .from('saved_listings')
    .select('listing_id, listings:listing_id(*, listing_images(*))')
    .eq('user_id', userId);

  if (error) throw error;
  return data ?? [];
}

// ── Profile ─────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
