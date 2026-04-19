import { supabase } from './supabase';
import type { Database, ListingWithImages, DbMessage } from './database.types';

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
  const listings = (data ?? []) as ListingWithImages[];

  // Count views directly from listing_views
  if (listings.length > 0) {
    const ids = listings.map(l => l.id);
    const counts = await fetchMyListingsViewCounts(ids);
    return listings.map(l => ({ ...l, view_count: counts[l.id] ?? 0 }));
  }

  return listings;
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

export async function deleteListingImage(imageId: string) {
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
}

export async function updateImagePositions(updates: { id: string; position: number }[]) {
  for (const { id, position } of updates) {
    const { error } = await supabase
      .from('listing_images')
      .update({ position })
      .eq('id', id);

    if (error) throw error;
  }
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

// ── Messaging ────────────────────────────────────────────────────────────────

export interface ConversationWithDetails {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  listings: {
    title: string;
    type: 'housing' | 'marketplace';
    price: number;
  };
  buyer: { full_name: string; avatar_url: string | null };
  seller: { full_name: string; avatar_url: string | null };
  messages: DbMessage[];
}

export async function fetchConversations(userId: string): Promise<ConversationWithDetails[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listings!listing_id(title, type, price),
      buyer:profiles!buyer_id(full_name, avatar_url),
      seller:profiles!seller_id(full_name, avatar_url),
      messages(*)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Sort messages within each conversation by created_at
  const convos = (data ?? []) as unknown as ConversationWithDetails[];
  for (const c of convos) {
    c.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
  return convos;
}

export async function findConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<ConversationWithDetails | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listings!listing_id(title, type, price),
      buyer:profiles!buyer_id(full_name, avatar_url),
      seller:profiles!seller_id(full_name, avatar_url),
      messages(*)
    `)
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const convo = data as unknown as ConversationWithDetails;
  convo.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return convo;
}

export async function createConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<string> {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function sendMessageToConversation(
  conversationId: string,
  senderId: string,
  content: string
): Promise<DbMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw error;

  // Update conversation's updated_at
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function markMessagesRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) throw error;
}

// ── Listing Views ───────────────────────────────────────────────────────────

export async function recordListingView(listingId: string, viewerId: string | null) {
  const { error } = await supabase.rpc('record_listing_view', {
    p_listing_id: listingId,
    p_viewer_id: viewerId ?? undefined,
  });
  if (error) console.warn('Failed to record view:', error.message);
}

export async function fetchMyListingsViewCounts(listingIds: string[]): Promise<Record<string, number>> {
  if (listingIds.length === 0) return {};
  const { data, error } = await supabase
    .from('listing_views')
    .select('listing_id')
    .in('listing_id', listingIds);

  if (error) return {};

  const counts: Record<string, number> = {};
  (data ?? []).forEach(v => {
    counts[v.listing_id] = (counts[v.listing_id] ?? 0) + 1;
  });
  return counts;
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
  updates: { full_name?: string; avatar_url?: string; year?: string | null; major?: string | null; bio?: string | null }
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
