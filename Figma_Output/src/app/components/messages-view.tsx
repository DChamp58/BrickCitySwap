import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import { useMessaging, Conversation } from './messaging-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, MessageSquare, Home, Package, ArrowLeft } from 'lucide-react';
import { cn } from './ui/utils';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  currentUserId: string;
  onSelect: (id: string) => void;
}

function ConversationList({ conversations, selectedId, currentUserId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="font-semibold text-lg">No messages yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Browse listings and click "Contact Seller" to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map(convo => {
        const unread = convo.messages.filter(m => m.senderId !== currentUserId && !m.read).length;
        const lastMsg = convo.messages[convo.messages.length - 1];
        const otherName = convo.sellerId === currentUserId ? convo.buyerName : convo.sellerName;

        return (
          <button
            key={convo.id}
            onClick={() => onSelect(convo.id)}
            className={cn(
              'w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors flex items-start gap-3',
              selectedId === convo.id && 'bg-muted'
            )}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#F76902] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
              {otherName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm truncate">{otherName}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatTime(convo.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {convo.listingType === 'housing'
                  ? <Home className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  : <Package className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                }
                <p className="text-xs text-muted-foreground truncate">{convo.listingTitle}</p>
              </div>
              {lastMsg && (
                <p className={cn(
                  'text-xs truncate mt-0.5',
                  unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )}>
                  {lastMsg.senderId === currentUserId ? 'You: ' : ''}{lastMsg.content}
                </p>
              )}
            </div>

            {unread > 0 && (
              <Badge className="bg-[#F76902] text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                {unread}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface ChatPanelProps {
  conversation: Conversation;
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
}

function ChatPanel({ conversation, currentUserId, currentUserName, onBack }: ChatPanelProps) {
  const { sendMessage, markConversationRead } = useMessaging();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherName = conversation.sellerId === currentUserId
    ? conversation.buyerName
    : conversation.sellerName;

  useEffect(() => {
    markConversationRead(conversation.id, currentUserId);
  }, [conversation.id, conversation.messages.length, currentUserId, markConversationRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(conversation.id, currentUserId, currentUserName, trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background sticky top-0">
        <button
          onClick={onBack}
          className="md:hidden p-1 rounded hover:bg-muted transition-colors"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#F76902] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {otherName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{otherName}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {conversation.listingType === 'housing'
              ? <Home className="w-3 h-3" />
              : <Package className="w-3 h-3" />
            }
            <span className="truncate">{conversation.listingTitle}</span>
            <span className="flex-shrink-0">
              · ${conversation.listingPrice}{conversation.listingType === 'housing' ? '/mo' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {conversation.messages.map((msg, idx) => {
          const isMine = msg.senderId === currentUserId;
          const prevMsg = conversation.messages[idx - 1];
          const showName = !isMine && (idx === 0 || prevMsg?.senderId !== msg.senderId);

          return (
            <div key={msg.id} className={cn('flex flex-col', isMine ? 'items-end' : 'items-start')}>
              {showName && (
                <span className="text-xs text-muted-foreground mb-1 px-1">{msg.senderName}</span>
              )}
              <div
                className={cn(
                  'max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words',
                  isMine
                    ? 'bg-[#F76902] text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t bg-background">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1"
          autoFocus
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-[#F76902] hover:bg-[#D85802] flex-shrink-0"
          size="icon"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface MessagesViewProps {
  /** If set, open this conversation immediately */
  openConversationId?: string | null;
}

export function MessagesView({ openConversationId }: MessagesViewProps) {
  const { user } = useAuth();
  const { getConversationsForUser } = useMessaging();
  const [selectedId, setSelectedId] = useState<string | null>(openConversationId ?? null);
  const [mobileShowChat, setMobileShowChat] = useState(!!openConversationId);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-lg font-semibold mb-2">Sign in to view messages</p>
        <p className="text-muted-foreground text-sm">You must be signed in to send and receive messages.</p>
      </div>
    );
  }

  const conversations = getConversationsForUser(user.id);
  const selected = conversations.find(c => c.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileShowChat(true);
  };

  const handleBack = () => {
    setMobileShowChat(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="border rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        {/* Conversation list — always visible on desktop, hidden on mobile when chat is open */}
        <aside
          className={cn(
            'w-full md:w-80 border-r flex flex-col flex-shrink-0 bg-background',
            mobileShowChat ? 'hidden md:flex' : 'flex'
          )}
        >
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm text-muted-foreground">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              currentUserId={user.id}
              onSelect={handleSelect}
            />
          </div>
        </aside>

        {/* Chat area */}
        <main
          className={cn(
            'flex-1 flex flex-col bg-background',
            !mobileShowChat && !selected ? 'hidden md:flex' : 'flex'
          )}
        >
          {selected ? (
            <ChatPanel
              conversation={selected}
              currentUserId={user.id}
              currentUserName={user.name}
              onBack={handleBack}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Select a conversation</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a conversation from the left to start chatting.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
