'use client';

type TabType = 'profile' | 'addresses' | 'orders' | 'payment' | 'settings';

type UserSidebarProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userName: string;
  userEmail: string;
};

export default function UserSidebar({ activeTab, setActiveTab, userName, userEmail }: UserSidebarProps) {
  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri' },
    { id: 'addresses', label: 'Adreslerim' },
    { id: 'orders', label: 'Siparişlerim' },
    { id: 'payment', label: 'Ödeme Yöntemleri' },
    { id: 'settings', label: 'Ayarlar' },
  ];

  return (
    <div className="lg:col-span-3">
      {/* User Info - Trendyol Style */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{userName?.charAt(0).toUpperCase() || 'K'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">{userName || 'Kullanıcı'}</h3>
            <p className="text-sm text-gray-600 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Trendyol Style */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Hesabım</div>
          <nav className="space-y-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

