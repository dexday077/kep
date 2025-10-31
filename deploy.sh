#!/bin/bash

# Kep Marketplace KVM Sunucusu Deployment Script
# Bu script KVM sunucusunda uygulamayı deploy etmek için kullanılır

echo "🚀 Kep Marketplace KVM Deployment Başlatılıyor..."

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

# Node.js versiyonunu kontrol et
echo -e "${YELLOW}📋 Node.js versiyonu kontrol ediliyor...${NC}"
node --version
npm --version

# Bağımlılıkları yükle
echo -e "${YELLOW}📦 Bağımlılıklar yükleniyor...${NC}"
npm ci --production=false

# TypeScript kontrolü
echo -e "${YELLOW}🔍 TypeScript kontrolü yapılıyor...${NC}"
npm run build

# Production build
echo -e "${YELLOW}🏗️ Production build oluşturuluyor...${NC}"
npm run build

# PM2 ile başlat (eğer yüklüyse)
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🔄 PM2 ile uygulama başlatılıyor...${NC}"
    pm2 stop kepmarketplace || true
    pm2 start npm --name "kepmarketplace" -- start
    pm2 save
    echo -e "${GREEN}✅ Uygulama PM2 ile başlatıldı!${NC}"
else
    echo -e "${YELLOW}⚠️ PM2 bulunamadı, manuel başlatma gerekli:${NC}"
    echo "npm start"
fi

# Port kontrolü
echo -e "${YELLOW}🌐 Port 3000 kontrol ediliyor...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Uygulama port 3000'de çalışıyor!${NC}"
else
    echo -e "${RED}❌ Port 3000'de uygulama çalışmıyor!${NC}"
fi

# Firewall kontrolü (Ubuntu/Debian)
if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}🔥 Firewall kuralları kontrol ediliyor...${NC}"
    sudo ufw allow 3000/tcp
    echo -e "${GREEN}✅ Port 3000 firewall'da açıldı!${NC}"
fi

# Nginx reverse proxy önerisi
echo -e "${YELLOW}📝 Nginx reverse proxy için örnek konfigürasyon:${NC}"
cat << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo -e "${GREEN}🎉 Deployment tamamlandı!${NC}"
echo -e "${YELLOW}📋 Sonraki adımlar:${NC}"
echo "1. Environment variables'ları ayarlayın (.env.local)"
echo "2. Supabase bağlantısını test edin"
echo "3. Nginx reverse proxy kurun (opsiyonel)"
echo "4. SSL sertifikası ekleyin (Let's Encrypt)"
echo "5. Domain'i DNS'e ekleyin"

echo -e "${GREEN}🌐 Uygulama: http://localhost:3000${NC}"
