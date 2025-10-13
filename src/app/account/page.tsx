"use client";

import Link from "next/link";
import { useState } from "react";

type TabType = "profile" | "addresses" | "payment" | "settings";

export default function AccountPage() {
	const [activeTab, setActiveTab] = useState<TabType>("profile");
	const [isEditing, setIsEditing] = useState(false);

	// Mock user data
	const [userData, setUserData] = useState({
		name: "Berkcan Çiftyıldırım",
		email: "iberke207@gmail.com",
		phone: "+90 531 235 23 49",
		birthDate: "2007-05-08",
		gender: "Erkek"
	});

	const [addresses] = useState([
		{
			id: 1,
			title: "Ev Adresi",
			name: "Berkcan Çiftyıldırım",
			address: "Avsallar Mahallesi Zeytinlik Caddesi Sevgi Sitesi 15B Daire 2",
			city: "Antalya",
			district: "Alanya",
			postalCode: "07400",
			phone: "+90 531 235 23 49",
			isDefault: true
		},
		{
			id: 2,
			title: "İş Adresi",
			name: "Berkcan Çiftyıldırım",
			address: "Söğüt Caddesi Ünal İş Merkezi",
			city: "Antalya",
			district: "Alanya",
			postalCode: "07400",
			phone: "+90 531 235 23 49",
			isDefault: false
		}
	]);

	const [paymentMethods] = useState([
		{
			id: 1,
			type: "credit_card",
			last4: "1234",
			expiry: "12/25",
			cardholder: "Berkcan Çiftyıldırım",
			isDefault: true
		},
		{
			id: 2,
			type: "credit_card",
			last4: "5678",
			expiry: "08/26",
			cardholder: "Berkcan Çiftyıldırım",
			isDefault: false
		}
	]);

	const tabs = [
		{ id: "profile", label: "Profil Bilgileri", icon: "👤" },
		{ id: "addresses", label: "Adreslerim", icon: "📍" },
		{ id: "payment", label: "Ödeme Yöntemleri", icon: "💳" },
		{ id: "settings", label: "Ayarlar", icon: "⚙️" }
	];

	const handleSaveProfile = () => {
		// Here you would typically save to backend
		setIsEditing(false);
		alert("Profil bilgileriniz güncellendi!");
	};

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
			<nav className="mb-6 text-sm text-slate-500">
				<Link href="/">Ana Sayfa</Link> / <span>Hesabım</span>
			</nav>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Sidebar */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="text-center mb-6">
							<div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
								<span className="text-2xl text-white">👤</span>
							</div>
							<h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
							<p className="text-sm text-gray-600">{userData.email}</p>
						</div>

						<nav className="space-y-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id as TabType)}
									className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
										activeTab === tab.id
											? "bg-blue-50 text-blue-700 border border-blue-200"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									<span className="text-lg">{tab.icon}</span>
									<span className="text-sm font-medium">{tab.label}</span>
								</button>
							))}
						</nav>
					</div>
				</div>

				{/* Main Content */}
				<div className="lg:col-span-3">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						{/* Profile Tab */}
						{activeTab === "profile" && (
							<div>
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h3>
									<button
										onClick={() => setIsEditing(!isEditing)}
										className="btn btn-ghost px-4 py-2"
									>
										{isEditing ? "İptal" : "Düzenle"}
									</button>
								</div>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Ad Soyad
											</label>
											{isEditing ? (
												<input
													type="text"
													value={userData.name}
													onChange={(e) => setUserData({...userData, name: e.target.value})}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											) : (
												<p className="text-gray-900">{userData.name}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												E-posta
											</label>
											<p className="text-gray-900">{userData.email}</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Telefon
											</label>
											{isEditing ? (
												<input
													type="tel"
													value={userData.phone}
													onChange={(e) => setUserData({...userData, phone: e.target.value})}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											) : (
												<p className="text-gray-900">{userData.phone}</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Doğum Tarihi
											</label>
											{isEditing ? (
												<input
													type="date"
													value={userData.birthDate}
													onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											) : (
												<p className="text-gray-900">
													{new Date(userData.birthDate).toLocaleDateString("tr-TR")}
												</p>
											)}
										</div>
									</div>

									{isEditing && (
										<div className="flex space-x-3 pt-4">
											<button
												onClick={handleSaveProfile}
												className="btn btn-primary px-6"
											>
												Kaydet
											</button>
											<button
												onClick={() => setIsEditing(false)}
												className="btn btn-ghost px-6"
											>
												İptal
											</button>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Addresses Tab */}
						{activeTab === "addresses" && (
							<div>
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-xl font-semibold text-gray-900">Adreslerim</h3>
									<button className="btn btn-primary px-4 py-2">
										Yeni Adres Ekle
									</button>
								</div>

								<div className="space-y-4">
									{addresses.map((address) => (
										<div key={address.id} className="border border-gray-200 rounded-lg p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<h4 className="font-medium text-gray-900">{address.title}</h4>
														{address.isDefault && (
															<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
																Varsayılan
															</span>
														)}
													</div>
													<p className="text-gray-600 mb-1">{address.name}</p>
													<p className="text-gray-600 mb-1">{address.address}</p>
													<p className="text-gray-600">
														{address.district}, {address.city} {address.postalCode}
													</p>
													<p className="text-gray-600">{address.phone}</p>
												</div>
												<div className="flex space-x-2">
													<button className="btn btn-ghost px-3 py-1 text-sm">
														Düzenle
													</button>
													<button className="btn btn-ghost px-3 py-1 text-sm text-red-600">
														Sil
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Payment Methods Tab */}
						{activeTab === "payment" && (
							<div>
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-xl font-semibold text-gray-900">Ödeme Yöntemleri</h3>
									<button className="btn btn-primary px-4 py-2">
										Yeni Kart Ekle
									</button>
								</div>

								<div className="space-y-4">
									{paymentMethods.map((method) => (
										<div key={method.id} className="border border-gray-200 rounded-lg p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
														<span className="text-white text-xs font-bold">💳</span>
													</div>
													<div>
														<p className="font-medium text-gray-900">
															**** **** **** {method.last4}
														</p>
														<p className="text-sm text-gray-600">
															{method.cardholder} • {method.expiry}
														</p>
													</div>
													{method.isDefault && (
														<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
															Varsayılan
														</span>
													)}
												</div>
												<div className="flex space-x-2">
													<button className="btn btn-ghost px-3 py-1 text-sm">
														Düzenle
													</button>
													<button className="btn btn-ghost px-3 py-1 text-sm text-red-600">
														Sil
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Settings Tab */}
						{activeTab === "settings" && (
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-6">Ayarlar</h3>
								
								<div className="space-y-6">
									<div>
										<h4 className="text-lg font-medium text-gray-900 mb-4">Bildirimler</h4>
										<div className="space-y-3">
											<label className="flex items-center">
												<input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
												<span className="ml-3 text-sm text-gray-700">E-posta bildirimleri</span>
											</label>
											<label className="flex items-center">
												<input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
												<span className="ml-3 text-sm text-gray-700">SMS bildirimleri</span>
											</label>
											<label className="flex items-center">
												<input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
												<span className="ml-3 text-sm text-gray-700">Pazarlama e-postaları</span>
											</label>
										</div>
									</div>

									<div>
										<h4 className="text-lg font-medium text-gray-900 mb-4">Güvenlik</h4>
										<div className="space-y-3">
											<button className="btn btn-ghost px-4 py-2 text-left">
												Şifre Değiştir
											</button>
											<button className="btn btn-ghost px-4 py-2 text-left">
												İki Faktörlü Doğrulama
											</button>
										</div>
									</div>

									<div>
										<h4 className="text-lg font-medium text-gray-900 mb-4">Hesap</h4>
										<div className="space-y-3">
											<button className="btn btn-ghost px-4 py-2 text-left text-red-600 hover:text-red-700">
												Hesabı Sil
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
