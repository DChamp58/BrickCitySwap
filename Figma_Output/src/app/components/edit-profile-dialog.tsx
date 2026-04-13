import { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { useAuth } from './auth-context';
import { updateProfile } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  const { user, updateProfile: updateLocalProfile } = useAuth();
  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [open, user]);

  if (!open || !user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const displayAvatar = avatarPreview ?? user.avatarUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      let avatarUrl = user.avatarUrl;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      const updated = await updateProfile(user.id, {
        full_name: name.trim(),
        ...(avatarUrl !== user.avatarUrl ? { avatar_url: avatarUrl ?? undefined } : {}),
      });

      updateLocalProfile({
        ...user,
        name: updated.full_name,
        avatarUrl: updated.avatar_url,
      });

      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(64, 46, 50, 0.4)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white flex flex-col"
        style={{
          width: '480px', borderRadius: '16px',
          boxShadow: '0 24px 48px rgba(64, 46, 50, 0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '24px 28px', borderBottom: '1px solid #E8D5C4' }}
        >
          <h2 className="font-bold" style={{ fontSize: '20px', color: '#402E32' }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              backgroundColor: '#FFF6EE', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} style={{ color: '#B5866E' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Avatar picker */}
          <div className="flex flex-col items-center" style={{ gap: '12px' }}>
            <div className="relative">
              <div
                className="flex items-center justify-center font-bold"
                style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  backgroundColor: '#FFF6EE', color: '#F76902', fontSize: '32px',
                  overflow: 'hidden',
                }}
              >
                {displayAvatar
                  ? <img src={displayAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials
                }
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: '#F76902', border: '2px solid #FFFFFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(247, 105, 2, 0.35)',
                }}
              >
                <Camera size={14} style={{ color: '#FFFFFF' }} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <p style={{ fontSize: '13px', color: '#B5866E' }}>Click the camera icon to change your photo</p>
          </div>

          {/* Name field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="outline-none"
              style={{
                padding: '12px 16px', borderRadius: '8px',
                border: '1px solid #E8D5C4', fontSize: '15px',
                color: '#402E32', backgroundColor: '#FFFFFF',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#F76902'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E8D5C4'; }}
            />
          </div>

          {/* Email — read-only */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>
              Email <span style={{ fontWeight: 400, color: '#B5866E' }}>(cannot be changed)</span>
            </label>
            <div
              style={{
                padding: '12px 16px', borderRadius: '8px',
                border: '1px solid #E8D5C4', fontSize: '15px',
                color: '#B5866E', backgroundColor: '#FFF6EE',
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end"
          style={{ padding: '20px 28px', borderTop: '1px solid #E8D5C4', gap: '12px' }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className="font-medium"
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
              border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF',
              color: '#B5866E', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center font-semibold"
            style={{
              padding: '10px 24px', borderRadius: '8px', fontSize: '14px', gap: '8px',
              border: 'none', backgroundColor: saving ? '#E8D5C4' : '#F76902',
              color: '#FFFFFF', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 4px 12px rgba(247, 105, 2, 0.35)',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#D85802'; }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#F76902'; }}
          >
            {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
