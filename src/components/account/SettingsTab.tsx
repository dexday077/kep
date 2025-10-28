'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/lib/api';
import { useToastContext } from '@/context/ToastContext';

type NotificationSettings = {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
};

type SettingsTabProps = {
  userId: string;
};

export default function SettingsTab({ userId }: SettingsTabProps) {
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: true,
    marketing_emails: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profile = await ApiService.getProfile(userId);
        if (profile?.data) {
          setNotifications({
            email_notifications: profile.data.email_notifications ?? true,
            sms_notifications: profile.data.sms_notifications ?? true,
            marketing_emails: profile.data.marketing_emails ?? false,
          });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    };
    loadSettings();
  }, [userId]);

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);

    try {
      await ApiService.updateProfile(userId, {
        [key]: value,
      });
      success('Başarılı', 'Bildirim ayarları güncellendi');
    } catch (err: any) {
      console.error('Error updating notifications:', err);
      showError('Ayarlar güncellenirken hata oluştu');
      // Revert on error
      setNotifications(notifications);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      showError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Yeni şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      // Update password via Supabase Auth
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      success('Başarılı', 'Şifreniz başarıyla değiştirildi');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error('Error changing password:', err);
      showError('Şifre değiştirilirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;

    setLoading(true);
    try {
      // This would typically be handled by a backend function
      showError('Hesap silme özelliği yakında eklenecek');
      setShowDeleteAccountModal(false);
    } catch (err: any) {
      console.error('Error deleting account:', err);
      showError('Hesap silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Ayarlar</h3>
          <p className="text-gray-600 mt-1">Hesap ayarlarınızı yönetin</p>
        </div>

        <div className="space-y-8 max-w-3xl">
          {/* Notification Settings */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Bildirimler</h4>
            <div className="space-y-3">
              {[
                {
                  key: 'email_notifications' as const,
                  label: 'E-posta bildirimleri',
                },
                {
                  key: 'sms_notifications' as const,
                  label: 'SMS bildirimleri',
                },
                {
                  key: 'marketing_emails' as const,
                  label: 'Pazarlama e-postaları',
                },
              ].map((notif) => (
                <label key={notif.key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 transition-all cursor-pointer">
                  <span className="text-gray-700 font-medium">{notif.label}</span>
                  <input type="checkbox" checked={notifications[notif.key]} onChange={(e) => handleNotificationChange(notif.key, e.target.checked)} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-5 h-5 cursor-pointer" />
                </label>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Güvenlik</h4>
            <div className="space-y-3">
              <button onClick={() => setShowPasswordModal(true)} className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-all font-medium">
                Şifre Değiştir
              </button>
              <button onClick={() => showError('İki faktörlü doğrulama yakında eklenecek')} className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-all font-medium">
                İki Faktörlü Doğrulama
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Hesap</h4>
            <button onClick={() => setShowDeleteAccountModal(true)} className="w-full text-left p-4 bg-white border border-red-200 rounded-lg hover:border-red-500 text-red-600 hover:bg-red-50 transition-all font-medium">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Şifre Değiştir</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Yeni şifrenizi girin (min. 6 karakter)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button onClick={handlePasswordChange} disabled={loading} className="px-6 py-2.5 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Değiştiriliyor...' : 'Değiştir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hesabı Sil</h3>
            <p className="text-gray-600 mb-6">Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteAccountModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                İptal
              </button>
              <button onClick={handleDeleteAccount} disabled={loading} className="px-6 py-2.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Siliniyor...' : 'Hesabı Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
