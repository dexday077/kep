'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';
import { ApiService } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuth();
  const { success, error: showError } = useToastContext();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address form state
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    title: 'Ev',
    fullName: user?.email?.split('@')[0] || '',
    phone: '',
    address: '',
    city: 'Alanya',
    district: 'Avsallar',
    postalCode: '07400',
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Load user addresses from Supabase if logged in
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) {
        // If not logged in, use default empty address
        setAddresses([]);
        return;
      }

      setLoadingAddresses(true);
      try {
        // Try to load addresses from Supabase
        const userAddresses = await ApiService.getShippingAddresses(user.id);

        if (userAddresses && userAddresses.length > 0) {
          const formattedAddresses = userAddresses.map((addr: any) => ({
            id: addr.id,
            title: addr.title || 'Ev',
            fullName: addr.full_name || user?.email?.split('@')[0] || 'Kullanıcı',
            phone: addr.phone || '',
            address: typeof addr.address === 'string' ? addr.address : addr.address?.address || '',
            city: typeof addr.address === 'string' ? '' : addr.address?.city || 'Alanya',
            district: typeof addr.address === 'string' ? '' : addr.address?.district || 'Avsallar',
            postalCode: typeof addr.address === 'string' ? '' : addr.address?.postal_code || '07400',
            isDefault: addr.is_default || false,
          }));
          setAddresses(formattedAddresses);
        } else {
          // No addresses found, use default
          setAddresses([]);
        }
      } catch (error: any) {
        console.error('Error loading addresses:', error);
        // If error, use empty array and show a warning
        setAddresses([]);

        // Only show error if it's not a missing table/function error
        const errorMessage = error?.message || error?.error?.message || '';
        if (!errorMessage.toLowerCase().includes('does not exist') && !errorMessage.toLowerCase().includes('relation') && !errorMessage.toLowerCase().includes('function')) {
          // Silently handle - user can still add addresses manually
          console.warn('Could not load saved addresses:', errorMessage);
        }
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user]);

  const shippingCost = total >= 500 ? 0 : 29;
  const tax = total * 0.18;
  const grandTotal = total + shippingCost + tax;

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setStep(2);
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
      showError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      title: newAddress.title || 'Ev',
      fullName: newAddress.fullName,
      phone: newAddress.phone,
      address: newAddress.address,
      city: newAddress.city || 'Alanya',
      district: newAddress.district || 'Avsallar',
      postalCode: newAddress.postalCode || '',
      isDefault: addresses.length === 0,
    };

    // Save to Supabase if user is logged in
    if (user) {
      try {
        const result = await ApiService.addShippingAddress(user.id, address.title, {
          full_name: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          district: address.district,
          postal_code: address.postalCode,
          is_default: address.isDefault,
        });

        // Update address with returned data from Supabase
        if (result) {
          address.id = result.id;
          // Update any other fields from database
          if (result.full_name) address.fullName = result.full_name;
          if (result.postal_code) address.postalCode = result.postal_code;
          if (result.is_default !== undefined) address.isDefault = result.is_default;
        } else {
          throw new Error('Address was not saved to database');
        }
      } catch (error: any) {
        console.error('Error saving address:', error);

        // Check if it's a missing function/table error - allow proceeding anyway
        const errorCode = error?.code || error?.error?.code || '';
        const errorMessage = error?.message || error?.error?.message || '';

        // Extract meaningful error message - always require database save
        let userFriendlyMessage = 'Adres kaydedilirken hata oluştu. Lütfen tekrar deneyin.';

        if (errorMessage) {
          // Provide user-friendly error message in Turkish
          if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('unauthorized')) {
            userFriendlyMessage = 'Bu işlem için yetkiniz bulunmuyor. Lütfen giriş yaptığınızdan emin olun.';
          } else if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('unique')) {
            userFriendlyMessage = 'Bu adres zaten kayıtlı. Lütfen farklı bir adres ekleyin.';
          } else if (errorMessage.toLowerCase().includes('validation') || errorMessage.toLowerCase().includes('invalid')) {
            userFriendlyMessage = 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.';
          } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
            userFriendlyMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
          } else if (errorMessage.toLowerCase().includes('customer not found')) {
            userFriendlyMessage = 'Kullanıcı bilgisi bulunamadı. Lütfen giriş yapıp tekrar deneyin.';
          } else if (errorMessage.toLowerCase().includes('does not exist') || errorMessage.toLowerCase().includes('function') || errorMessage.toLowerCase().includes('schema cache')) {
            userFriendlyMessage = 'Veritabanı yapılandırması eksik. Lütfen sistem yöneticisine bildirin.';
          }
        }

        showError(userFriendlyMessage);
        return;
      }
    } else {
      // If not logged in, show error
      showError('Adres kaydetmek için giriş yapmanız gerekiyor');
      return;
    }

    setAddresses([...addresses, address]);
    setShowAddressForm(false);
    setNewAddress({
      title: 'Ev',
      fullName: user?.email?.split('@')[0] || '',
      phone: '',
      address: '',
      city: 'Alanya',
      district: 'Avsallar',
      postalCode: '07400',
    });
    success('Adres Eklendi', 'Yeni adres başarıyla eklendi');
  };

  const handlePaymentSelect = (method: 'card' | 'cash' | 'transfer') => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleCompleteOrder = async () => {
    if (!selectedAddress) {
      showError('Lütfen bir adres seçin');
      setStep(1);
      return;
    }

    if (!user) {
      showError('Sipariş vermek için giriş yapmanız gerekiyor');
      router.push('/auth/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Get seller_id from first product, or use a default
      // In a multi-seller marketplace, you might need to group by seller and create multiple orders
      let sellerId = user.id; // Default to customer's own ID

      // Try to get seller_id from first product if productId exists
      if (items[0]?.productId) {
        try {
          const product = await ApiService.getProduct(items[0].productId);
          if (product && (product as any).seller_id) {
            sellerId = (product as any).seller_id;
          }
        } catch (err) {
          console.warn('Could not fetch product seller_id, using default:', err);
        }
      }

      // Format order items for API
      const orderItems = items.map((item) => ({
        product_id: item.productId || item.id,
        title: item.title,
        quantity: item.qty,
        price: item.price,
        subtotal: item.price * item.qty,
      }));

      // Format delivery address
      const deliveryAddress = `${selectedAddress.address}, ${selectedAddress.district}, ${selectedAddress.city} ${selectedAddress.postalCode}`;

      // Create order via API
      const orderResult = await ApiService.createOrder({
        customer_id: user.id,
        seller_id: sellerId as string,
        items: orderItems,
        total_amount: grandTotal,
        delivery_address: deliveryAddress,
        notes: `Telefon: ${selectedAddress.phone}, Ödeme: ${paymentMethod === 'card' ? 'Kart' : paymentMethod === 'cash' ? 'Kapıda Ödeme' : 'Havale/EFT'}`,
      });

      // Create payment record (optional, based on payment method)
      if (paymentMethod === 'card' || paymentMethod === 'transfer') {
        try {
          await ApiService.createPayment(orderResult.order_id, paymentMethod === 'card' ? 'stripe' : 'bank_transfer', grandTotal, 'TRY');
        } catch (paymentError) {
          console.error('Payment record creation failed:', paymentError);
          // Don't fail the order if payment record fails
        }
      }

      clearCart();
      success('Sipariş Başarılı!', 'Siparişiniz başarıyla oluşturuldu.');
      router.push('/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);

      // Extract meaningful error message
      let errorMessage = 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.details) {
        errorMessage = error.details;
      }

      // Provide user-friendly error messages
      if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('unauthorized')) {
        errorMessage = 'Sipariş oluşturmak için giriş yapmanız gerekiyor.';
      } else if (errorMessage.toLowerCase().includes('stock') || errorMessage.toLowerCase().includes('inventory')) {
        errorMessage = 'Sepetinizdeki bazı ürünler stokta yok. Lütfen sepetinizi kontrol edin.';
      } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
        errorMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
      }

      showError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Sipariş vermek için önce sepetinize ürün ekleyin</p>
          <Link href="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  // Show loading if checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Sepete Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Onayı</h1>
          <p className="text-gray-600 mt-2">Siparişinizi tamamlamak için bilgilerinizi kontrol edin</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              {
                step: 1,
                label: 'Adres',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                step: 2,
                label: 'Ödeme',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
              },
              {
                step: 3,
                label: 'Onay',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map(({ step: stepNumber, label, icon }) => (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all ${
                    step >= stepNumber ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-110' : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {icon}
                </div>
                <span className={`mt-3 text-sm font-medium ${step >= stepNumber ? 'text-orange-600' : 'text-gray-400'}`}>{label}</span>
                {stepNumber < 3 && <div className={`absolute top-7 left-[60%] w-full h-0.5 ${step > stepNumber ? 'bg-orange-500' : 'bg-gray-300'}`} style={{ width: 'calc(100% - 3.5rem)' }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Teslimat Adresi Seçin
                  </h2>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : !showAddressForm && addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz yok.</p>
                    <button onClick={() => setShowAddressForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                      İlk Adresinizi Ekleyin
                    </button>
                  </div>
                ) : !showAddressForm ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${selectedAddress?.id === address.id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress?.id === address.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                              {selectedAddress?.id === address.id && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{address.title}</h3>
                                {address.isDefault && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">Varsayılan</span>}
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-700 font-medium">{address.fullName}</p>
                                <p className="text-gray-600 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                  {address.phone}
                                </p>
                                <p className="text-gray-600 flex items-start gap-2">
                                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>
                                    {address.address}, {address.district}, {address.city} {address.postalCode}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 text-gray-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Yeni Adres Ekle
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Yeni Adres Bilgileri</h3>
                      <button onClick={() => setShowAddressForm(false)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adres Başlığı *</label>
                        <select
                          value={newAddress.title}
                          onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="Ev">Ev</option>
                          <option value="İş">İş</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                        <input
                          type="text"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Adınız Soyadınız"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="0555 123 45 67"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu</label>
                        <input
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="07400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                        <textarea
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Mahalle, sokak, bina no, daire no"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">İlçe *</label>
                        <input
                          type="text"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleAddAddress} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                        Adresi Kaydet
                      </button>
                      <button onClick={() => setShowAddressForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Ödeme Yöntemi Seçin
                  </h2>
                  <button onClick={() => setStep(1)} className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri Dön
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'card',
                      label: 'Kredi/Banka Kartı',
                      desc: 'Visa, Mastercard, Troy',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      ),
                    },
                    {
                      id: 'cash',
                      label: 'Kapıda Ödeme',
                      desc: 'Teslimatta nakit ödeme',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ),
                    },
                    {
                      id: 'transfer',
                      label: 'Havale/EFT',
                      desc: 'Banka transferi',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      ),
                    },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentSelect(method.id as any)}
                      className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{method.label}</h3>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sipariş Özeti ve Onay
                  </h2>
                  <button onClick={() => setStep(2)} className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri Dön
                  </button>
                </div>

                {/* Selected Address */}
                {selectedAddress && (
                  <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">Teslimat Adresi</h3>
                    </div>
                    <div className="space-y-1 text-gray-700">
                      <p className="font-medium">{selectedAddress.fullName}</p>
                      <p>{selectedAddress.phone}</p>
                      <p>
                        {selectedAddress.address}, {selectedAddress.district}, {selectedAddress.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Ödeme Yöntemi</h3>
                  </div>
                  <p className="text-gray-700">
                    {paymentMethod === 'card' && 'Kredi/Banka Kartı'}
                    {paymentMethod === 'cash' && 'Kapıda Ödeme'}
                    {paymentMethod === 'transfer' && 'Havale/EFT'}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Ürünler ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 flex-1">
                          {item.image && (
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.title} width={64} height={64} className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">Adet: {item.qty}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 text-lg">₺{(item.price * item.qty).toLocaleString('tr-TR')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sipariş Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Siparişi Onayla ve Tamamla
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ürünler ({items.length})</span>
                  <span className="font-semibold text-gray-900">₺{total.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kargo</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shippingCost === 0 ? 'Ücretsiz' : `₺${shippingCost}`}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">KDV (%18)</span>
                  <span className="font-semibold text-gray-900">₺{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t-2 border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Toplam</span>
                  <span className="text-xl font-bold text-orange-600">₺{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {shippingCost === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 text-sm font-medium">Ücretsiz kargo!</p>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 text-sm">{(500 - total).toFixed(0)} ₺ daha alışveriş yapın, ücretsiz kargo kazanın!</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Güvenli ödeme ile korunuyorsunuz. SSL sertifikası ile bilgileriniz güvende.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
