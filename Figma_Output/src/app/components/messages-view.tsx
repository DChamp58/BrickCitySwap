import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-context';
import { useMessaging, Conversation } from './messaging-context';
import { Send, Search, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface MessagesViewProps {
  openConversationId?: string | null;
}

export function MessagesView({ openConversationId }: MessagesViewProps) {
  const { user } = useAuth();
  const { getConversationsForUser, sendMessage, markConversationRead, loading: messagesLoading } = useMessaging();
  const [selectedId, setSelectedId] = useState<string | null>(openConversationId ?? null);
  const [mobileShowChat, setMobileShowChat] = useState(!!openConversationId);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const allConversations = user ? getConversationsForUser(user.id) : [];
  const conversations = searchQuery.trim()
    ? allConversations.filter(c => {
        const q = searchQuery.toLowerCase();
        const other = c.sellerId === user?.id ? c.buyerName : c.sellerName;
        return other.toLowerCase().includes(q) || c.listingTitle.toLowerCase().includes(q);
      })
    : allConversations;
  const selected = allConversations.find(c => c.id === selectedId) ?? null;

  useEffect(() => {
    if (selected && user) {
      markConversationRead(selected.id, user.id);
    }
  }, [selected?.id, selected?.messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF6EE' }}>
        <div className="text-center">
          <MessageSquare size={48} style={{ color: '#C4A88E', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px', color: '#402E32', fontWeight: 600 }}>Sign in to view messages</p>
          <p style={{ fontSize: '14px', color: '#B5866E', marginTop: '8px' }}>You must be signed in to send and receive messages.</p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !selected || !user) return;
    sendMessage(selected.id, user.id, user.name, trimmed);
    setInput('');
  };

  const otherName = (convo: Conversation) =>
    convo.sellerId === user.id ? convo.buyerName : convo.sellerName;

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].substring(0, 2);
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFF6EE', height: 'calc(100vh - 72px)' }}>
      <div
        className="mx-auto h-full"
        style={{ maxWidth: '1400px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', padding: '48px 24px' }}
      >
        {/* Conversations List */}
        <div
          className={`bg-white flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}
          style={{ borderRadius: '12px', border: '1px solid #E8D5C4', overflow: 'hidden', height: '100%' }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid #E8D5C4' }}>
            <h2 className="font-semibold" style={{ fontSize: '20px', color: '#402E32', marginBottom: '16px' }}>Messages</h2>
            <div className="relative">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#C4A88E' }} />
              <input
                type="text" placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none"
                style={{ padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E8D5C4', fontSize: '14px', color: '#402E32' }}
              />
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {messagesLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: '48px 24px' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: '#F76902', marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', color: '#B5866E' }}>Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: '48px 24px' }}>
                <MessageSquare size={40} style={{ color: '#C4A88E', marginBottom: '12px' }} />
                <p style={{ fontSize: '16px', color: '#402E32', fontWeight: 600 }}>No messages yet</p>
                <p style={{ fontSize: '14px', color: '#B5866E', marginTop: '8px' }}>
                  Browse listings and click "Contact Seller" to start a conversation.
                </p>
              </div>
            ) : (
              conversations.map((convo) => {
                const unread = convo.messages.filter(m => m.senderId !== user.id && !m.read).length;
                const name = otherName(convo);
                const lastMsg = convo.messages[convo.messages.length - 1];
                return (
                  <button
                    key={convo.id}
                    onClick={() => { setSelectedId(convo.id); setMobileShowChat(true); }}
                    className="w-full flex items-center text-left transition-colors"
                    style={{
                      padding: '16px 24px', borderBottom: '1px solid #E8D5C4',
                      backgroundColor: selectedId === convo.id ? '#FFF6EE' : '#FFFFFF',
                      cursor: 'pointer', border: 'none', gap: '12px'
                    }}
                  >
                    <div
                      className="flex items-center justify-center font-semibold flex-shrink-0"
                      style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        backgroundColor: unread > 0 ? '#FFF6EE' : '#F3F4F6',
                        color: unread > 0 ? '#F76902' : '#B5866E', fontSize: '16px'
                      }}
                    >
                      {getInitials(name).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                        <span className="font-semibold" style={{ fontSize: '15px', color: '#402E32', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {name}
                        </span>
                        <span className="font-normal flex-shrink-0" style={{ fontSize: '12px', color: '#C4A88E', marginLeft: '8px' }}>
                          {formatTime(convo.lastMessageAt)}
                        </span>
                      </div>
                      <p className="font-normal" style={{ fontSize: '13px', color: '#C4A88E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {convo.listingTitle} · ${convo.listingPrice}
                      </p>
                      {lastMsg && (
                        <p style={{
                          fontSize: '14px', color: unread > 0 ? '#402E32' : '#B5866E',
                          fontWeight: unread > 0 ? 500 : 400,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                    {unread > 0 && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F76902', flexShrink: 0 }} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`bg-white flex flex-col ${!mobileShowChat && !selected ? 'hidden md:flex' : 'flex'}`}
          style={{ borderRadius: '12px', border: '1px solid #E8D5C4', overflow: 'hidden', height: '100%' }}
        >
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center" style={{ padding: '20px 24px', borderBottom: '1px solid #E8D5C4', gap: '12px' }}>
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <ArrowLeft size={20} />
                </button>
                <div
                  className="flex items-center justify-center font-semibold"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFF6EE', color: '#F76902', fontSize: '14px' }}
                >
                  {getInitials(otherName(selected)).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontSize: '16px', color: '#402E32' }}>
                    {otherName(selected)}
                  </h3>
                  <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E' }}>
                    About: {selected.listingTitle} · ${selected.listingPrice}{selected.listingType === 'housing' ? '/mo' : ''}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1" style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selected.messages.map((message) => (
                  <div key={message.id} className="flex" style={{ justifyContent: message.senderId === user.id ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '60%', padding: '12px 16px', borderRadius: '12px',
                      backgroundColor: message.senderId === user.id ? '#F76902' : '#F3F4F6',
                      color: message.senderId === user.id ? '#FFFFFF' : '#402E32'
                    }}>
                      <p className="font-normal" style={{ fontSize: '15px', marginBottom: '4px', color: message.senderId === user.id ? '#FFFFFF' : '#402E32' }}>{message.content}</p>
                      <p className="font-normal" style={{
                        fontSize: '12px',
                        color: message.senderId === user.id ? 'rgba(255, 255, 255, 0.8)' : '#C4A88E',
                        textAlign: 'right'
                      }}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Message Input */}
              <div style={{ padding: '20px 24px', borderTop: '1px solid #E8D5C4' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <input
                    type="text" placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    className="flex-1 outline-none"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8D5C4', fontSize: '15px', color: '#402E32' }}
                  />
                  <button
                    onClick={handleSend}
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: '48px', height: '48px', borderRadius: '8px',
                      backgroundColor: '#F76902', border: 'none', cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D85802'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; }}
                  >
                    <Send size={20} style={{ color: '#FFFFFF' }} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: '48px' }}>
              <MessageSquare size={48} style={{ color: '#C4A88E', marginBottom: '16px' }} />
              <p style={{ fontSize: '18px', color: '#402E32', fontWeight: 600 }}>Select a conversation</p>
              <p style={{ fontSize: '14px', color: '#B5866E', marginTop: '8px' }}>Choose a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
