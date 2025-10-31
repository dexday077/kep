# 🚀 KVM Sunucusu Deployment Rehberi

Bu rehber Kep Marketplace uygulamasını KVM sunucusunda deploy etmek için hazırlanmıştır.

## 📋 Gereksinimler

### Sunucu Gereksinimleri
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Minimum 2GB, Önerilen 4GB+
- **CPU**: Minimum 2 core
- **Disk**: Minimum 20GB boş alan
- **Network**: Port 80, 443, 3000 açık

### Yazılım Gereksinimleri
- Node.js 18+
- npm veya yarn
- PM2 (opsiyonel)
- Docker & Docker Compose (opsiyonel)
- Nginx (opsiyonel)

## 🛠️ Kurulum Yöntemleri

### Yöntem 1: Docker ile (Önerilen)

```bash
# 1. Projeyi klonlayın
git clone <repository-url>
cd kepmarketplace

# 2. Environment variables'ları ayarlayın
cp .env.example .env.local
nano .env.local

# 3. Docker ile başlatın
docker-compose up -d

# 4. Logları kontrol edin
docker-compose logs -f
```

### Yöntem 2: Manuel Kurulum

```bash
# 1. Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. PM2 kurulumu
sudo npm install -g pm2

# 3. Projeyi klonlayın
git clone <repository-url>
cd kepmarketplace

# 4. Bağımlılıkları yükleyin
npm ci

# 5. Build alın
npm run build

# 6. PM2 ile başlatın
pm2 start npm --name "kepmarketplace" -- start
pm2 save
pm2 startup
```

### Yöntem 3: Deploy Script ile

```bash
# 1. Deploy script'ini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Konfigürasyon

### Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Optional
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

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
```

## 🔒 SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d yourdomain.com

# Otomatik yenileme test edin
sudo certbot renew --dry-run
```

## 📊 Monitoring ve Logs

### PM2 Monitoring

```bash
# Uygulama durumu
pm2 status

# Logları görüntüle
pm2 logs kepmarketplace

# Restart
pm2 restart kepmarketplace

# Stop
pm2 stop kepmarketplace
```

### Docker Monitoring

```bash
# Container durumu
docker-compose ps

# Logları görüntüle
docker-compose logs -f kepmarketplace

# Restart
docker-compose restart

# Stop
docker-compose down
```

## 🚨 Troubleshooting

### Yaygın Sorunlar

1. **Port 3000 kullanımda**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Memory hatası**
   ```bash
   # Swap ekleyin
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **Permission hatası**
   ```bash
   sudo chown -R $USER:$USER /path/to/app
   chmod -R 755 /path/to/app
   ```

### Log Dosyaları

- **PM2**: `~/.pm2/logs/`
- **Docker**: `docker-compose logs`
- **Nginx**: `/var/log/nginx/`

## 🔄 Güncelleme

### Docker ile Güncelleme

```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Manuel Güncelleme

```bash
git pull
npm ci
npm run build
pm2 restart kepmarketplace
```

## 📈 Performans Optimizasyonu

### Nginx Optimizasyonu

```nginx
# nginx.conf içinde
worker_processes auto;
worker_connections 1024;

# Gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### PM2 Cluster Mode

```bash
pm2 start npm --name "kepmarketplace" -i max -- start
```

## 🛡️ Güvenlik

### Firewall Ayarları

```bash
# UFW ile
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# iptables ile
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📞 Destek

Sorun yaşarsanız:
1. Logları kontrol edin
2. Port'ların açık olduğunu doğrulayın
3. Environment variables'ları kontrol edin
4. Firewall ayarlarını kontrol edin

---

**Not**: Bu rehber production ortamı için hazırlanmıştır. Test ortamında farklı ayarlar gerekebilir.
