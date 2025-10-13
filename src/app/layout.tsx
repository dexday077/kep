import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { ToastProvider } from "@/context/ToastContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Kep Marketplace",
	description: "Amazon ve eBay mantığında modern e-ticaret.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
				<ErrorBoundary>
					<ToastProvider>
						<LoadingProvider>
							<CartProvider>
								<SearchProvider>
									<Navbar />
									<main className="flex-1">{children}</main>
									<Footer />
									<LoadingOverlay />
								</SearchProvider>
							</CartProvider>
						</LoadingProvider>
					</ToastProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
