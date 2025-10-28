'use client';

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

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
};

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  // Mask phone number: 542*****31 format
  const maskPhone = (phone: string) => {
    if (!phone || phone.length <= 5) return phone;
    const cleaned = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleaned.length <= 5) return phone;
    return cleaned.slice(0, 3) + '*****' + cleaned.slice(-2);
  };

  // Format full address
  const fullAddress = [address.address, address.district && address.district, address.city && address.city, address.postal_code && address.postal_code].filter(Boolean).join(', ');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Address Title - Trendyol Style */}
      <h4 className="font-bold text-gray-900 text-lg mb-3">{address.title}</h4>

      {/* Address Info */}
      <div className="space-y-2 mb-4 text-gray-700">
        <p className="font-medium text-gray-900">{address.full_name}</p>
        <p className="text-sm leading-relaxed">{fullAddress || 'Adres bilgisi eksik'}</p>
        <p className="text-sm">{maskPhone(address.phone)}</p>
      </div>

      {/* Action Buttons - Trendyol Style: Sil (left) + Adresi Düzenle (right, orange) */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button onClick={() => onDelete(address.id)} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Sil
        </button>
        <button onClick={() => onEdit(address)} className="bg-orange-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-700 transition-colors shadow-sm">
          Adresi Düzenle
        </button>
      </div>
    </div>
  );
}
