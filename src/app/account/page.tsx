'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';
import { getProductImage } from '@/lib/imageHelpers';
import UserSidebar from '@/components/account/UserSidebar';
import AddressCard from '@/components/account/AddressCard';
import AddressForm from '@/components/account/AddressForm';
import SettingsTab from '@/components/account/SettingsTab';

type TabType = 'profile' | 'addresses' | 'orders' | 'payment' | 'settings';

type Address = {
  id: string;
  title: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
  is_default: boolean;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: any;
  delivery_address?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: showError } = useToastContext();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    title: 'Ev',
    fullName: '',
    phone: '',
    address: '',
    city: 'Alanya',
    district: 'Avsallar',
    postalCode: '07400',
    isDefault: false,
  });

  // Update newAddress when user changes
  useEffect(() => {
    if (user) {
      setNewAddress((prev) => ({
        ...prev,
        fullName: user.email?.split('@')[0] || prev.fullName,
      }));
    }
  }, [user]);

  // User data from database
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      last4: '1234',
      expiry: '12/25',
      cardholder: '',
      isDefault: true,
    },
  ]);

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        if (!authLoading) {
          router.push('/auth/login');
        }
        return;
      }

      setLoading(true);
      try {
        // Load user profile
        const profileResult = await ApiService.getProfile(user.id);
        if (profileResult?.data) {
          const profile = profileResult.data;
          setUserData({
            name: profile.full_name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: profile.phone || '',
          });
        } else {
          // If no profile, use email
          setUserData({
            name: user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: '',
          });
        }

        // Load addresses
        try {
          const userAddresses = await ApiService.getShippingAddresses(user.id);
          if (userAddresses && Array.isArray(userAddresses)) {
            setAddresses(userAddresses);
          } else {
            setAddresses([]);
          }
        } catch (err: any) {
          console.error('Error loading addresses:', err);
          // Don't show error to user, just log it
          setAddresses([]);
        }

        // Load orders
        try {
          const userOrders = await ApiService.getOrders(user.id, 'customer');
          if (userOrders && Array.isArray(userOrders)) {
            setOrders(userOrders);
          } else {
            setOrders([]);
          }
        } catch (err: any) {
          console.error('Error loading orders:', err);
          // Don't show error to user, just log it - orders might not be available yet
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, authLoading, router]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await ApiService.updateProfile(user.id, {
        full_name: userData.name,
        phone: userData.phone,
      });
      setIsEditing(false);
      success('Başarılı', 'Profil bilgileriniz güncellendi!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showError('Profil güncellenirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await ApiService.deleteShippingAddress(addressToDelete);
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      success('Başarılı', 'Adres başarıyla silindi');
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error: any) {
      console.error('Error deleting address:', error);
      showError('Adres silinirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      setShowDeleteModal(false);
      setAddressToDelete(null);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      title: address.title,
      fullName: address.full_name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postalCode: address.postal_code,
      isDefault: address.is_default,
    });
    setShowAddressForm(true);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
    setNewAddress({
      title: 'Ev',
      fullName: user?.email?.split('@')[0] || '',
      phone: '',
      address: '',
      city: 'Alanya',
      district: 'Avsallar',
      postalCode: '07400',
      isDefault: false,
    });
  };

  const handleSaveAddress = async () => {
    if (!user) {
      showError('Adres eklemek için giriş yapmanız gerekiyor');
      return;
    }

    // Validation
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
      showError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      if (editingAddress) {
        // Update existing address
        await ApiService.updateShippingAddress(editingAddress.id, {
          title: newAddress.title,
          full_name: newAddress.fullName,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          district: newAddress.district,
          postal_code: newAddress.postalCode,
          is_default: newAddress.isDefault,
        });
        success('Başarılı', 'Adres başarıyla güncellendi');
      } else {
        // Add new address
        const result = await ApiService.addShippingAddress(user.id, newAddress.title, {
          full_name: newAddress.fullName,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          district: newAddress.district,
          postal_code: newAddress.postalCode,
          is_default: newAddress.isDefault,
        });

        if (!result) {
          throw new Error('Adres kaydedilemedi');
        }
        success('Başarılı', 'Adres başarıyla eklendi');
      }

      // Refresh addresses list
      const userAddresses = await ApiService.getShippingAddresses(user.id);
      if (userAddresses && Array.isArray(userAddresses)) {
        setAddresses(userAddresses);
      }

      // Reset form
      handleCancelEdit();
    } catch (error: any) {
      console.error('Error saving address:', error);
      const errorMessage = error?.message || error?.error?.message || '';
      let userFriendlyMessage = editingAddress ? 'Adres güncellenirken hata oluştu. Lütfen tekrar deneyin.' : 'Adres eklenirken hata oluştu. Lütfen tekrar deneyin.';

      if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('unauthorized')) {
        userFriendlyMessage = 'Bu işlem için yetkiniz bulunmuyor. Lütfen giriş yaptığınızdan emin olun.';
      } else if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('unique')) {
        userFriendlyMessage = 'Bu adres zaten kayıtlı. Lütfen farklı bir adres ekleyin.';
      } else if (errorMessage.toLowerCase().includes('validation') || errorMessage.toLowerCase().includes('invalid')) {
        userFriendlyMessage = 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.';
      }

      showError(userFriendlyMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Hesabım</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesabım</h1>
          <p className="text-gray-600">Profil bilgilerinizi ve ayarlarınızı yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={userData.name} userEmail={userData.email} />

          {/* Main Content */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 absolute top-0 left-0"></div>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-4">Yükleniyor...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h3>
                        <p className="text-gray-600 mt-1">Kişisel bilgilerinizi güncelleyin</p>
                      </div>
                      <button onClick={() => setIsEditing(!isEditing)} className="btn btn-ghost px-6 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600 transition-all">
                        {isEditing ? '✕ İptal' : '✏️ Düzenle'}
                      </button>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Ad Soyad</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={userData.name}
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              placeholder="Adınızı girin"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{userData.name || 'Belirtilmemiş'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">E-posta</label>
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{userData.email}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Telefon</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={userData.phone}
                              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              placeholder="0500 000 00 00"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{userData.phone || 'Belirtilmemiş'}</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-3 pt-4">
                          <button onClick={handleSaveProfile} className="btn btn-primary px-8 flex-1 md:flex-initial">
                            💾 Kaydet
                          </button>
                          <button onClick={() => setIsEditing(false)} className="btn btn-ghost px-8">
                            İptal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="p-6">
                    {/* Header - Trendyol Style */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Adres Bilgilerim</h3>
                      <button
                        onClick={() => {
                          if (showAddressForm) {
                            handleCancelEdit();
                          } else {
                            setShowAddressForm(true);
                          }
                        }}
                        className="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {showAddressForm ? 'İptal' : 'Yeni Adres Ekle'}
                      </button>
                    </div>

                    {/* Add/Edit Address Form */}
                    {showAddressForm && <AddressForm formData={newAddress} onChange={setNewAddress} onSubmit={handleSaveAddress} onCancel={handleCancelEdit} isEditing={!!editingAddress} />}

                    {/* Addresses Grid - Trendyol Style */}
                    {addresses.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz kayıtlı adresiniz yok</h3>
                        <p className="text-gray-600 mb-6">İlk adresinizi ekleyerek başlayın</p>
                        <button onClick={() => setShowAddressForm(true)} className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                          + Yeni Adres Ekle
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <AddressCard key={address.id} address={address} onEdit={handleEditAddress} onDelete={handleDeleteAddress} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="p-8">
                    <div className="mb-8 pb-6 border-b border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Siparişlerim</h3>
                      <p className="text-gray-600">Sipariş geçmişinizi görüntüleyin</p>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="text-7xl mb-6">📦</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz Siparişiniz Yok</h3>
                        <p className="text-gray-600 mb-8 text-lg">İlk siparişinizi vermek için alışverişe başlayın</p>
                        <Link href="/" className="btn btn-primary px-10 py-4 text-lg inline-flex items-center shadow-lg hover:shadow-xl">
                          🛒 Alışverişe Başla
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const itemCount = order.items?.length || 0;
                          const deliveryCount = 1; // Simplification
                          const orderDate = new Date(order.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });

                          return (
                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                              {/* Order Header - Trendyol Style */}
                              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                    <div>
                                      <span className="font-semibold text-gray-700">Sipariş tarihi:</span> <span className="text-gray-900">{orderDate}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-700">Sipariş özeti:</span>{' '}
                                      <span className="text-gray-900">
                                        {deliveryCount} Teslimat, {itemCount} Ürün
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-700">Alıcı:</span> <span className="text-gray-900">{userData.name || 'Kullanıcı'}</span>
                                    </div>
                                    <div className="ml-auto md:ml-0">
                                      <span className="font-semibold text-gray-700">Toplam:</span> <span className="text-lg font-bold text-orange-600">₺{Number(order.total_amount).toLocaleString('tr-TR')}</span>
                                    </div>
                                  </div>
                                  <button className="btn btn-primary px-6 py-2 text-sm whitespace-nowrap ml-auto md:ml-0">Detaylar</button>
                                </div>
                              </div>

                              {/* Order Status & Products */}
                              <div className="p-6">
                                {/* Status */}
                                <div className="flex items-center gap-3 mb-4">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  >
                                    {order.status === 'completed' || order.status === 'delivered' ? (
                                      <span className="text-white text-sm">✓</span>
                                    ) : order.status === 'cancelled' ? (
                                      <span className="text-white text-sm">✕</span>
                                    ) : (
                                      <span className="text-white text-sm">⏳</span>
                                    )}
                                  </div>
                                  <div>
                                    <span className={`font-semibold ${order.status === 'completed' || order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                                      {order.status === 'completed' || order.status === 'delivered'
                                        ? 'Teslim edildi'
                                        : order.status === 'pending'
                                        ? 'Beklemede'
                                        : order.status === 'cancelled'
                                        ? 'İptal edildi'
                                        : order.status === 'confirmed'
                                        ? 'Onaylandı'
                                        : order.status === 'preparing'
                                        ? 'Hazırlanıyor'
                                        : order.status === 'delivering'
                                        ? 'Kargoda'
                                        : 'Sipariş tamamlandı'}
                                    </span>
                                    <span className="text-gray-600 text-sm ml-2">{itemCount} ürün teslim edildi</span>
                                  </div>
                                </div>

                                {/* Product Images - Trendyol Style */}
                                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                                  <div className="flex items-center gap-3">
                                    {order.items.slice(0, 4).map((item: any, index: number) => {
                                      const productId = item.product_id || item.id || String(index + 1);
                                      const imageUrl = item.image || getProductImage(productId, 80, 80);
                                      return (
                                        <div key={index} className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
                                          <Image src={imageUrl} alt={item.title || item.name || 'Ürün'} width={80} height={80} className="w-full h-full object-cover" />
                                        </div>
                                      );
                                    })}
                                    {order.items.length > 4 && (
                                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 font-semibold text-sm">+{order.items.length - 4}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Methods Tab */}
                {activeTab === 'payment' && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Ödeme Yöntemleri</h3>
                        <p className="text-gray-600 mt-1">Kayıtlı ödeme yöntemlerinizi yönetin</p>
                      </div>
                      <button className="btn btn-primary px-6 shadow-lg hover:shadow-xl transition-all">+ Yeni Kart Ekle</button>
                    </div>

                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl text-white">💳</span>
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">**** **** **** {method.last4}</p>
                                <p className="text-sm text-gray-600">
                                  {method.cardholder} • {method.expiry}
                                </p>
                              </div>
                              {method.isDefault && <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">⭐ Varsayılan</span>}
                            </div>
                            <div className="flex space-x-2">
                              <button className="btn btn-ghost px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-500 transition-all rounded-xl">✏️ Düzenle</button>
                              <button className="btn btn-ghost px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-500 transition-all rounded-xl">🗑️ Sil</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && user && <SettingsTab userId={user.id} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Adresi Sil</h3>
              <p className="text-gray-600">Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAddressToDelete(null);
                }}
                className="btn btn-ghost px-8 flex-1 border-2 border-gray-200 hover:border-gray-300 transition-all rounded-xl"
              >
                İptal
              </button>
              <button onClick={confirmDeleteAddress} className="btn btn-primary px-8 flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all rounded-xl">
                🗑️ Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
