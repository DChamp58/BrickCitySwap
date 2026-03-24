import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import {
  fetchConversations,
  findConversation,
  createConversation,
  sendMessageToConversation,
  markMessagesRead,
  ConversationWithDetails,
} from '@/lib/api';
import type { DbMessage } from '@/lib/database.types';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: 'housing' | 'marketplace';
  listingPrice: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
}

interface MessagingContextType {
  conversations: Conversation[];
  loading: boolean;
  startConversation: (params: {
    listingId: string;
    listingTitle: string;
    listingType: 'housing' | 'marketplace';
    listingPrice: number;
    sellerId: string;
    sellerName: string;
    buyerId: string;
    buyerName: string;
    initialMessage: string;
  }) => Promise<Conversation>;
  sendMessage: (conversationId: string, senderId: string, senderName: string, content: string) => void;
  markConversationRead: (conversationId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getConversationsForUser: (userId: string) => Conversation[];
  refreshConversations: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

function dbToConversation(c: ConversationWithDetails): Conversation {
  return {
    id: c.id,
    listingId: c.listing_id,
    listingTitle: c.listings.title,
    listingType: c.listings.type,
    listingPrice: c.listings.price,
    sellerId: c.seller_id,
    sellerName: c.seller.full_name,
    buyerId: c.buyer_id,
    buyerName: c.buyer.full_name,
    messages: c.messages.map(dbToMessage),
    createdAt: c.created_at,
    lastMessageAt: c.updated_at,
  };
}

function dbToMessage(m: DbMessage): Message {
  return {
    id: m.id,
    senderId: m.sender_id,
    senderName: '', // filled in by context when needed
    content: m.content,
    timestamp: m.created_at,
    read: m.read,
  };
}

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchConversations(user.id);
      setConversations(data.map(dbToConversation));
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load conversations when user logs in
  useEffect(() => {
    if (user && !loadedRef.current) {
      loadedRef.current = true;
      loadConversations();
    }
    if (!user) {
      loadedRef.current = false;
      setConversations([]);
    }
  }, [user, loadConversations]);

  const startConversation = useCallback(async (params: {
    listingId: string;
    listingTitle: string;
    listingType: 'housing' | 'marketplace';
    listingPrice: number;
    sellerId: string;
    sellerName: string;
    buyerId: string;
    buyerName: string;
    initialMessage: string;
  }): Promise<Conversation> => {
    // Check if conversation already exists
    const existing = conversations.find(
      c => c.listingId === params.listingId &&
           c.buyerId === params.buyerId &&
           c.sellerId === params.sellerId
    );

    if (existing) {
      // Send the message to existing conversation
      await sendMessageToConversation(existing.id, params.buyerId, params.initialMessage);
      await loadConversations();
      return conversations.find(c => c.id === existing.id) ?? existing;
    }

    // Also check Supabase in case it exists but wasn't loaded
    const dbExisting = await findConversation(params.listingId, params.buyerId, params.sellerId);
    if (dbExisting) {
      await sendMessageToConversation(dbExisting.id, params.buyerId, params.initialMessage);
      await loadConversations();
      const refreshed = conversations.find(c => c.id === dbExisting.id);
      return refreshed ?? dbToConversation(dbExisting);
    }

    // Create new conversation
    const convoId = await createConversation(params.listingId, params.buyerId, params.sellerId);
    await sendMessageToConversation(convoId, params.buyerId, params.initialMessage);
    await loadConversations();

    const newConvo = conversations.find(c => c.id === convoId);
    if (newConvo) return newConvo;

    // Fallback: construct from params if refresh hasn't settled yet
    return {
      id: convoId,
      listingId: params.listingId,
      listingTitle: params.listingTitle,
      listingType: params.listingType,
      listingPrice: params.listingPrice,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      messages: [{
        id: 'temp',
        senderId: params.buyerId,
        senderName: params.buyerName,
        content: params.initialMessage,
        timestamp: new Date().toISOString(),
        read: false,
      }],
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    };
  }, [conversations, loadConversations]);

  const sendMessage = useCallback((
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
  ) => {
    const now = new Date().toISOString();

    // Optimistic update
    const optimisticMsg: Message = {
      id: 'pending-' + Date.now(),
      senderId,
      senderName,
      content,
      timestamp: now,
      read: false,
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, optimisticMsg], lastMessageAt: now }
          : c
      )
    );

    // Persist to Supabase
    sendMessageToConversation(conversationId, senderId, content)
      .then(() => loadConversations())
      .catch(err => console.error('Failed to send message:', err));
  }, [loadConversations]);

  const markConversationRead = useCallback((conversationId: string, userId: string) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.senderId !== userId && !m.read ? { ...m, read: true } : m
              ),
            }
          : c
      )
    );

    // Persist
    markMessagesRead(conversationId, userId).catch(err =>
      console.error('Failed to mark messages read:', err)
    );
  }, []);

  const getUnreadCount = useCallback((userId: string): number => {
    return conversations.reduce((total, c) => {
      if (c.sellerId !== userId && c.buyerId !== userId) return total;
      return total + c.messages.filter(m => m.senderId !== userId && !m.read).length;
    }, 0);
  }, [conversations]);

  const getConversationsForUser = useCallback((userId: string): Conversation[] => {
    return conversations
      .filter(c => c.sellerId === userId || c.buyerId === userId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations]);

  return (
    <MessagingContext.Provider value={{
      conversations,
      loading,
      startConversation,
      sendMessage,
      markConversationRead,
      getUnreadCount,
      getConversationsForUser,
      refreshConversations: loadConversations,
    }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error('useMessaging must be used within a MessagingProvider');
  return ctx;
}
