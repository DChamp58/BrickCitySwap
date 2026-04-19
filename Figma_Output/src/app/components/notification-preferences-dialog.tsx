import { useState, useEffect } from 'react';
import { Bell, X, MessageSquare, Heart } from 'lucide-react';

interface NotificationPreferencesDialogProps {
  open: boolean;
  onClose: () => void;
}

const PREF_KEYS = {
  new_message: 'notif_pref_new_message',
  listing_saved: 'notif_pref_listing_saved',
} as const;

function readPref(key: string): boolean {
  const val = localStorage.getItem(key);
  return val === null ? true : val === 'true';
}

export function NotificationPreferencesDialog({ open, onClose }: NotificationPreferencesDialogProps) {
  const [newMessage, setNewMessage] = useState(true);
  const [listingSaved, setListingSaved] = useState(true);

  useEffect(() => {
    if (open) {
      setNewMessage(readPref(PREF_KEYS.new_message));
      setListingSaved(readPref(PREF_KEYS.listing_saved));
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem(PREF_KEYS.new_message, String(newMessage));
    localStorage.setItem(PREF_KEYS.listing_saved, String(listingSaved));
    onClose();
  };

  if (!open) return null;

  const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none',
        backgroundColor: on ? '#F76902' : '#E8D5C4',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background-color 200ms ease',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: on ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 200ms ease',
      }} />
    </button>
  );

  const prefs = [
    {
      icon: <MessageSquare size={18} style={{ color: '#F76902' }} />,
      label: 'New Messages',
      sub: 'Notify when someone sends you a message',
      value: newMessage,
      onChange: setNewMessage,
    },
    {
      icon: <Heart size={18} style={{ color: '#F76902', fill: '#F76902' }} />,
      label: 'Listing Saved',
      sub: 'Notify when someone saves your listing',
      value: listingSaved,
      onChange: setListingSaved,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(64, 46, 50, 0.4)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white relative"
        style={{ borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 48px rgba(64,46,50,0.16)' }}
      >
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#FFF6EE', cursor: 'pointer' }}
        >
          <X size={16} style={{ color: '#402E32' }} />
        </button>

        <div className="flex items-center" style={{ gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FFF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} style={{ color: '#F76902' }} />
          </div>
          <h2 className="font-bold" style={{ fontSize: '22px', color: '#402E32' }}>Notifications</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#B5866E', marginBottom: '28px' }}>
          Choose which notifications you want to receive.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {prefs.map(({ icon, label, sub, value, onChange }) => (
            <div
              key={label}
              className="flex items-center justify-between"
              style={{ padding: '18px 20px', borderRadius: '10px', border: '1px solid #E8D5C4', gap: '16px' }}
            >
              <div className="flex items-center" style={{ gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#FFF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <p className="font-medium" style={{ fontSize: '14px', color: '#402E32', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: '#B5866E' }}>{sub}</p>
                </div>
              </div>
              <Toggle on={value} onChange={onChange} />
            </div>
          ))}
        </div>

        <div className="flex" style={{ gap: '10px', marginTop: '28px' }}>
          <button
            onClick={onClose}
            className="flex-1 font-medium"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', color: '#402E32', fontSize: '14px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 font-semibold"
            style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#F76902', color: '#FFFFFF', fontSize: '14px', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D85802'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
