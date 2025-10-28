'use client';

type AddressFormData = {
  title: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
};

type AddressFormProps = {
  formData: AddressFormData;
  onChange: (data: AddressFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  loading?: boolean;
};

export default function AddressForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  loading = false,
}: AddressFormProps) {
  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h4 className="text-lg font-bold text-gray-900 mb-6">{isEditing ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adres Başlığı <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          >
            <option value="Ev">Ev</option>
            <option value="İş">İş</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="Ad Soyad"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="0500 000 00 00"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adres <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="Mahalle, Sokak, Bina, Daire"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">İlçe</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="İlçe"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="Şehir"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Posta Kodu</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="00000"
          />
        </div>

        {/* Default Address */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => handleChange('isDefault', e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2 w-5 h-5 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-medium">Varsayılan adres olarak ayarla</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}

