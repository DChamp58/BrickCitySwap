import { useState } from 'react';
import { Search, Send } from 'lucide-react';

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Is the apartment still available?',
      timestamp: '2m ago',
      unread: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Thanks! I will take it.',
      timestamp: '1h ago',
      unread: false,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      lastMessage: 'Can we meet tomorrow?',
      timestamp: '3h ago',
      unread: true,
      avatar: 'ED'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      lastMessage: 'Sounds good!',
      timestamp: '1d ago',
      unread: false,
      avatar: 'AT'
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: 'them',
      text: 'Hi! I am interested in your studio apartment listing.',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Hi Sarah! Thanks for reaching out. The apartment is still available.',
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      sender: 'them',
      text: 'Great! Is it possible to schedule a viewing this week?',
      timestamp: '10:35 AM'
    },
    {
      id: 4,
      sender: 'me',
      text: 'Of course! I am available Tuesday or Thursday afternoon. Which works better for you?',
      timestamp: '10:37 AM'
    },
    {
      id: 5,
      sender: 'them',
      text: 'Is the apartment still available?',
      timestamp: '10:40 AM'
    }
  ];

  return (
    <div 
      className="w-full"
      style={{ 
        backgroundColor: '#F9FAFB',
        height: 'calc(100vh - 72px)'
      }}
    >
      <div 
        className="mx-auto h-full"
        style={{ 
          maxWidth: '1400px',
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          padding: '48px 24px'
        }}
      >
        {/* Conversations List */}
        <div
          className="bg-white flex flex-col"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            height: '100%'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
            <h2 
              className="font-semibold"
              style={{ fontSize: '20px', color: '#111827', marginBottom: '16px' }}
            >
              Messages
            </h2>

            {/* Search */}
            <div className="relative">
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }}
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full outline-none"
                style={{
                  padding: '10px 12px 10px 40px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#111827'
                }}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full flex items-center text-left transition-colors"
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: selectedConversation === conversation.id ? '#FEF3EC' : '#FFFFFF',
                  cursor: 'pointer',
                  border: 'none',
                  gap: '12px'
                }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center font-semibold flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: conversation.unread ? '#FEF3EC' : '#F3F4F6',
                    color: conversation.unread ? '#F76902' : '#6B7280',
                    fontSize: '16px'
                  }}
                >
                  {conversation.avatar}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                    <span 
                      className="font-semibold"
                      style={{ 
                        fontSize: '15px', 
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {conversation.name}
                    </span>
                    <span 
                      className="font-normal flex-shrink-0"
                      style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}
                    >
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p 
                    className="font-normal"
                    style={{ 
                      fontSize: '14px', 
                      color: conversation.unread ? '#111827' : '#6B7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: conversation.unread ? 500 : 400
                    }}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Unread Indicator */}
                {conversation.unread && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#F76902',
                      flexShrink: 0
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className="bg-white flex flex-col"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            height: '100%'
          }}
        >
          {/* Chat Header */}
          <div 
            className="flex items-center"
            style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid #E5E7EB',
              gap: '12px'
            }}
          >
            <div
              className="flex items-center justify-center font-semibold"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEF3EC',
                color: '#F76902',
                fontSize: '14px'
              }}
            >
              SJ
            </div>
            <div>
              <h3 
                className="font-semibold"
                style={{ fontSize: '16px', color: '#111827' }}
              >
                Sarah Johnson
              </h3>
              <p 
                className="font-normal"
                style={{ fontSize: '13px', color: '#6B7280' }}
              >
                About: Studio Apartment Near Campus
              </p>
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1"
            style={{ 
              overflowY: 'auto', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex"
                style={{
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '60%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.sender === 'me' ? '#F76902' : '#F3F4F6',
                    color: message.sender === 'me' ? '#FFFFFF' : '#111827'
                  }}
                >
                  <p 
                    className="font-normal"
                    style={{ fontSize: '15px', marginBottom: '4px' }}
                  >
                    {message.text}
                  </p>
                  <p 
                    className="font-normal"
                    style={{ 
                      fontSize: '12px', 
                      color: message.sender === 'me' ? 'rgba(255, 255, 255, 0.8)' : '#9CA3AF',
                      textAlign: 'right'
                    }}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div 
            style={{ 
              padding: '20px 24px', 
              borderTop: '1px solid #E5E7EB'
            }}
          >
            <div className="flex items-center" style={{ gap: '12px' }}>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 outline-none"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#111827'
                }}
              />
              <button
                className="flex items-center justify-center transition-all"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#F76902',
                  border: 'none',
                  cursor: 'pointer',
                  transitionDuration: '200ms'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D55A02';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F76902';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Send size={20} style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}