import { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(64, 46, 50, 0.4)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="bg-white relative"
        style={{ borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 48px rgba(64,46,50,0.16)' }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#FFF6EE', cursor: 'pointer' }}
        >
          <X size={16} style={{ color: '#402E32' }} />
        </button>

        <div className="flex items-center" style={{ gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FFF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} style={{ color: '#F76902' }} />
          </div>
          <h2 className="font-bold" style={{ fontSize: '22px', color: '#402E32' }}>Change Password</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#B5866E', marginBottom: '28px' }}>
          Choose a strong password with at least 8 characters.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* New password */}
          <div>
            <label className="font-semibold" style={{ fontSize: '13px', color: '#402E32', display: 'block', marginBottom: '7px' }}>
              New Password
            </label>
            <div className="flex items-center" style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px', backgroundColor: '#FAFAFA' }}>
              <Lock size={16} style={{ color: '#C4A88E', flexShrink: 0 }} />
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: '15px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
              />
              <button onClick={() => setShowNew(v => !v)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                {showNew ? <EyeOff size={16} style={{ color: '#C4A88E' }} /> : <Eye size={16} style={{ color: '#C4A88E' }} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="font-semibold" style={{ fontSize: '13px', color: '#402E32', display: 'block', marginBottom: '7px' }}>
              Confirm New Password
            </label>
            <div className="flex items-center" style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px', backgroundColor: '#FAFAFA' }}>
              <Lock size={16} style={{ color: '#C4A88E', flexShrink: 0 }} />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                className="flex-1 outline-none"
                style={{ fontSize: '15px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
              />
              <button onClick={() => setShowConfirm(v => !v)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                {showConfirm ? <EyeOff size={16} style={{ color: '#C4A88E' }} /> : <Eye size={16} style={{ color: '#C4A88E' }} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '5px' }}>Passwords do not match</p>
            )}
          </div>
        </div>

        <div className="flex" style={{ gap: '10px', marginTop: '28px' }}>
          <button
            onClick={handleClose}
            className="flex-1 font-medium"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E8D5C4', backgroundColor: '#FFFFFF', color: '#402E32', fontSize: '14px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !newPassword || !confirmPassword}
            className="flex-1 font-semibold transition-all"
            style={{
              padding: '12px', borderRadius: '8px', border: 'none',
              backgroundColor: saving || !newPassword || !confirmPassword ? '#E8D5C4' : '#F76902',
              color: saving || !newPassword || !confirmPassword ? '#B5866E' : '#FFFFFF',
              fontSize: '14px', cursor: saving || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!saving && newPassword && confirmPassword) e.currentTarget.style.backgroundColor = '#D85802'; }}
            onMouseLeave={(e) => { if (!saving && newPassword && confirmPassword) e.currentTarget.style.backgroundColor = '#F76902'; }}
          >
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
