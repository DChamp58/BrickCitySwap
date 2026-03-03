import React, { createContext, useContext, useState, useCallback } from 'react';

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
  /** userId of the person who posted the listing */
  sellerId: string;
  sellerName: string;
  /** userId of the person who initiated contact */
  buyerId: string;
  buyerName: string;
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
}

interface MessagingContextType {
  conversations: Conversation[];
  /** Start a new conversation or return the existing one */
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
  }) => Conversation;
  sendMessage: (conversationId: string, senderId: string, senderName: string, content: string) => void;
  markConversationRead: (conversationId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getConversationsForUser: (userId: string) => Conversation[];
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const startConversation = useCallback((params: {
    listingId: string;
    listingTitle: string;
    listingType: 'housing' | 'marketplace';
    listingPrice: number;
    sellerId: string;
    sellerName: string;
    buyerId: string;
    buyerName: string;
    initialMessage: string;
  }): Conversation => {
    let existing: Conversation | undefined;

    setConversations(prev => {
      existing = prev.find(
        c => c.listingId === params.listingId &&
             c.buyerId === params.buyerId &&
             c.sellerId === params.sellerId
      );
      if (existing) return prev;

      const now = new Date().toISOString();
      const firstMsg: Message = {
        id: makeId(),
        senderId: params.buyerId,
        senderName: params.buyerName,
        content: params.initialMessage,
        timestamp: now,
        read: false,
      };
      const convo: Conversation = {
        id: makeId(),
        listingId: params.listingId,
        listingTitle: params.listingTitle,
        listingType: params.listingType,
        listingPrice: params.listingPrice,
        sellerId: params.sellerId,
        sellerName: params.sellerName,
        buyerId: params.buyerId,
        buyerName: params.buyerName,
        messages: [firstMsg],
        createdAt: now,
        lastMessageAt: now,
      };
      existing = convo;
      return [...prev, convo];
    });

    // Return the conversation after state update — we capture `existing` synchronously above
    return existing!;
  }, []);

  const sendMessage = useCallback((
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
  ) => {
    const now = new Date().toISOString();
    const msg: Message = {
      id: makeId(),
      senderId,
      senderName,
      content,
      timestamp: now,
      read: false,
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, msg], lastMessageAt: now }
          : c
      )
    );
  }, []);

  const markConversationRead = useCallback((conversationId: string, userId: string) => {
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
      startConversation,
      sendMessage,
      markConversationRead,
      getUnreadCount,
      getConversationsForUser,
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
