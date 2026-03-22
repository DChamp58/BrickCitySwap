import { useState, useRef, useEffect } from 'react';
import { Search, Send } from 'lucide-react';

type Message = { id: number; sender: 'me' | 'them'; text: string; timestamp: string };

const allConversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    about: 'Studio Apartment Near Campus',
    lastMessage: 'Is the apartment still available?',
    timestamp: '2m ago',
    unread: true,
    messages: [
      { id: 1, sender: 'them' as const, text: 'Hi! I am interested in your studio apartment listing.', timestamp: '10:30 AM' },
      { id: 2, sender: 'me' as const, text: 'Hi Sarah! Thanks for reaching out. The apartment is still available.', timestamp: '10:32 AM' },
      { id: 3, sender: 'them' as const, text: 'Great! Is it possible to schedule a viewing this week?', timestamp: '10:35 AM' },
      { id: 4, sender: 'me' as const, text: 'Of course! I am available Tuesday or Thursday afternoon. Which works better for you?', timestamp: '10:37 AM' },
      { id: 5, sender: 'them' as const, text: 'Is the apartment still available?', timestamp: '10:40 AM' },
    ],
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'MC',
    about: 'Desk & Chair Set',
    lastMessage: 'Thanks! I will take it.',
    timestamp: '1h ago',
    unread: false,
    messages: [
      { id: 1, sender: 'me' as const, text: 'Hey Mike, is the desk still available?', timestamp: '9:00 AM' },
      { id: 2, sender: 'them' as const, text: 'Yes it is! Are you interested?', timestamp: '9:05 AM' },
      { id: 3, sender: 'me' as const, text: 'Definitely. Can I pick it up this weekend?', timestamp: '9:08 AM' },
      { id: 4, sender: 'them' as const, text: 'Thanks! I will take it.', timestamp: '9:10 AM' },
    ],
  },
  {
    id: 3,
    name: 'Emily Davis',
    avatar: 'ED',
    about: 'Shared Room in Henrietta',
    lastMessage: 'Can we meet tomorrow?',
    timestamp: '3h ago',
    unread: true,
    messages: [
      { id: 1, sender: 'them' as const, text: 'Hi! I saw your shared room listing. Is it still open?', timestamp: '7:30 AM' },
      { id: 2, sender: 'me' as const, text: 'Yes, it is still available! Would you like to see it?', timestamp: '7:45 AM' },
      { id: 3, sender: 'them' as const, text: 'Can we meet tomorrow?', timestamp: '8:00 AM' },
    ],
  },
  {
    id: 4,
    name: 'Alex Thompson',
    avatar: 'AT',
    about: 'Mountain Bike',
    lastMessage: 'Sounds good!',
    timestamp: '1d ago',
    unread: false,
    messages: [
      { id: 1, sender: 'them' as const, text: 'Is the mountain bike still for sale?', timestamp: 'Yesterday' },
      { id: 2, sender: 'me' as const, text: 'Yes! $200 firm. Want to come check it out?', timestamp: 'Yesterday' },
      { id: 3, sender: 'them' as const, text: 'Sounds good!', timestamp: 'Yesterday' },
    ],
  },
];

export function Messages() {
  const [selectedId, setSelectedId] = useState(1);
  const [conversations, setConversations] = useState(allConversations);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === selectedId)!;

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedId, activeConversation?.messages.length]);

  const handleSelectConversation = (id: number) => {
    setSelectedId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      text,
      timestamp,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: text, timestamp: 'Just now' }
          : c
      )
    );
    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="w-full"
      style={{ backgroundColor: '#F9FAFB', height: 'calc(100vh - 72px)' }}
    >
      <div
        className="mx-auto h-full"
        style={{
          maxWidth: '1400px',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 360px) 1fr',
          gap: '20px',
          padding: '32px 24px',
        }}
      >
        {/* Conversations List */}
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', height: '100%' }}
        >
          {/* Header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
              <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827' }}>
                Messages
              </h2>
              <span
                className="font-semibold"
                style={{
                  fontSize: '11px',
                  backgroundColor: '#F76902',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                {conversations.filter((c) => c.unread).length} new
              </span>
            </div>
            <div className="relative">
              <Search
                size={16}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none"
                style={{
                  padding: '9px 12px 9px 34px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '13px',
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredConversations.length === 0 ? (
              <p style={{ padding: '24px', fontSize: '14px', color: '#9CA3AF', textAlign: 'center' }}>
                No conversations found.
              </p>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className="w-full flex items-center text-left transition-colors"
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #F3F4F6',
                    backgroundColor: selectedId === conversation.id ? '#FEF3EC' : '#FFFFFF',
                    cursor: 'pointer',
                    border: 'none',
                    borderLeft: selectedId === conversation.id ? '3px solid #F76902' : '3px solid transparent',
                    gap: '12px',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center font-semibold flex-shrink-0"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: conversation.unread ? '#FEF3EC' : '#F3F4F6',
                      color: conversation.unread ? '#F76902' : '#6B7280',
                      fontSize: '14px',
                    }}
                  >
                    {conversation.avatar}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '3px' }}>
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: '14px',
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conversation.name}
                      </span>
                      <span className="flex-shrink-0 font-normal" style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '8px' }}>
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        color: conversation.unread ? '#374151' : '#9CA3AF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: conversation.unread ? 500 : 400,
                      }}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {conversation.unread && (
                    <div
                      style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F76902', flexShrink: 0 }}
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden', height: '100%' }}
        >
          {/* Chat Header */}
          <div
            className="flex items-center"
            style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB', gap: '12px' }}
          >
            <div
              className="flex items-center justify-center font-semibold flex-shrink-0"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FEF3EC',
                color: '#F76902',
                fontSize: '14px',
              }}
            >
              {activeConversation.avatar}
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: '16px', color: '#111827' }}>
                {activeConversation.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>About: {activeConversation.about}</p>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1"
            style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {activeConversation.messages.map((message) => (
              <div
                key={message.id}
                className="flex"
                style={{ justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  style={{
                    maxWidth: '65%',
                    padding: '11px 15px',
                    borderRadius: message.sender === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    backgroundColor: message.sender === 'me' ? '#F76902' : '#F3F4F6',
                    color: message.sender === 'me' ? '#FFFFFF' : '#111827',
                  }}
                >
                  <p style={{ fontSize: '15px', lineHeight: '1.5', marginBottom: '4px' }}>{message.text}</p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: message.sender === 'me' ? 'rgba(255,255,255,0.75)' : '#9CA3AF',
                      textAlign: 'right',
                    }}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB' }}>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <input
                type="text"
                placeholder="Type a message... (Enter to send)"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none"
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="flex items-center justify-center transition-all"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: messageInput.trim() ? '#F76902' : '#E5E7EB',
                  border: 'none',
                  cursor: messageInput.trim() ? 'pointer' : 'default',
                  flexShrink: 0,
                }}
                aria-label="Send message"
              >
                <Send size={18} style={{ color: messageInput.trim() ? '#FFFFFF' : '#9CA3AF' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
