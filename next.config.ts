import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  
  // KVM sunucusu için optimizasyonlar
  experimental: {
    // Server-side rendering optimizasyonu
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Turbopack konfigürasyonu
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // KVM sunucusu için performans ayarları
  swcMinify: true,
  compress: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
    // Unsplash görselleri için hata toleransı
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  
  // KVM sunucusu için güvenlik ayarları
  poweredByHeader: false,
  generateEtags: false,
  
  // API routes için timeout ayarları
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default nextConfig;
