import { Camera } from 'lucide-react';

export function Profile() {
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@rit.edu',
    initials: 'AJ',
    memberSince: 'January 2024'
  };

  return (
    <div 
      className="w-full min-h-screen"
      style={{ 
        backgroundColor: '#F9FAFB',
        padding: '48px 24px'
      }}
    >
      <div 
        className="mx-auto"
        style={{ 
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Page Title */}
        <div>
          <h1 
            className="font-bold"
            style={{
              fontSize: '56px',
              color: '#0F172A',
              marginBottom: '8px',
              lineHeight: '1.1'
            }}
          >
            Profile
          </h1>
          <p 
            className="font-normal"
            style={{
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="bg-white"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '32px'
          }}
        >
          {/* Avatar and User Info Section */}
          <div 
            className="flex items-center"
            style={{ gap: '16px', marginBottom: '32px' }}
          >
            {/* Avatar with Edit Overlay */}
            <div 
              className="relative flex-shrink-0"
              style={{ width: '64px', height: '64px' }}
            >
              {/* Avatar Circle */}
              <div
                className="flex items-center justify-center font-semibold"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3EC',
                  color: '#F76902',
                  fontSize: '24px',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                {user.initials}
              </div>

              {/* Edit Icon Overlay */}
              <button
                className="absolute flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{
                  bottom: '0',
                  right: '0',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#F76902',
                  border: '2px solid #FFFFFF',
                  cursor: 'pointer'
                }}
                title="Change photo"
              >
                <Camera size={12} style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h2 
                className="font-semibold"
                style={{
                  fontSize: '20px',
                  color: '#111827',
                  marginBottom: '4px'
                }}
              >
                {user.name}
              </h2>
              <p 
                className="font-normal"
                style={{
                  fontSize: '14px',
                  color: '#6B7280'
                }}
              >
                {user.email}
              </p>
            </div>

            {/* Edit Profile Button */}
            <button
              className="font-medium hover:opacity-80 transition-opacity"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                fontSize: '14px'
              }}
            >
              Edit Profile
            </button>
          </div>

          {/* Divider */}
          <div 
            style={{ 
              height: '1px', 
              backgroundColor: '#E5E7EB',
              marginBottom: '32px'
            }} 
          />

          {/* Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label 
                className="font-semibold"
                style={{
                  fontSize: '14px',
                  color: '#111827',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full outline-none"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#F9FAFB'
                }}
              />
            </div>

            <div>
              <label 
                className="font-semibold"
                style={{
                  fontSize: '14px',
                  color: '#111827',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full outline-none"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#F9FAFB'
                }}
              />
            </div>

            <div>
              <label 
                className="font-semibold"
                style={{
                  fontSize: '14px',
                  color: '#111827',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Member Since
              </label>
              <input
                type="text"
                value={user.memberSince}
                readOnly
                className="w-full outline-none"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#F9FAFB'
                }}
              />
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: '32px' }}>
            <button
              className="font-semibold transition-all"
              style={{
                backgroundColor: '#F76902',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
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
              Save Changes
            </button>
          </div>
        </div>

        {/* Additional Settings Cards */}
        <div
          className="bg-white"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '32px'
          }}
        >
          <h3 
            className="font-semibold"
            style={{
              fontSize: '18px',
              color: '#111827',
              marginBottom: '16px'
            }}
          >
            Account Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              className="flex items-center justify-between font-normal hover:opacity-70 transition-opacity text-left"
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                fontSize: '16px'
              }}
            >
              <span>Change Password</span>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>→</span>
            </button>

            <button
              className="flex items-center justify-between font-normal hover:opacity-70 transition-opacity text-left"
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                fontSize: '16px'
              }}
            >
              <span>Notification Preferences</span>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>→</span>
            </button>

            <button
              className="flex items-center justify-between font-normal hover:opacity-70 transition-opacity text-left"
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#D32F2F',
                fontSize: '16px'
              }}
            >
              <span>Delete Account</span>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}