# Movie Watchlist Frontend

Frontend aplikasi Movie Watchlist yang terintegrasi dengan microservices movie dan watchlist.

## Fitur

1. **Daftar** - Registrasi user baru hanya dengan nama
2. **Login** - Login user hanya dengan nama
3. **Movie Catalog** - Menampilkan katalog film dengan fitur pencarian
4. **Watchlist** - Menambahkan dan melihat daftar film favorit user

## Teknologi

- HTML5
- CSS3 (Modern Dark Theme)
- Vanilla JavaScript
- Nginx (Web Server)
- Docker & Docker Compose

## API Integration

Frontend ini terhubung dengan:
- **Movie Service**: `https://joan.tugastst.my.id` (untuk data film)
- **Watchlist Service**: `http://100.114.117.49:9595` (untuk user dan watchlist)

## Struktur File

```
src/frontend/
├── index.html          # Main HTML file
├── app.js              # JavaScript logic & API integration
├── styles.css          # Styling
├── nginx.conf          # Nginx configuration
├── Dockerfile          # Docker image configuration
├── docker-compose.yml  # Docker compose configuration
└── README.md           # This file
```

## Deployment ke https://huga.tugastst.my.id/

### Prerequisites

1. Server dengan Docker & Docker Compose terinstall
2. Domain `huga.tugastst.my.id` sudah pointing ke server Anda
3. SSL Certificate (gunakan Let's Encrypt/Certbot)

### Langkah 1: Setup SSL Certificate

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Generate SSL certificate
sudo certbot certonly --standalone -d huga.tugastst.my.id

# Certificate akan tersimpan di:
# /etc/letsencrypt/live/huga.tugastst.my.id/fullchain.pem
# /etc/letsencrypt/live/huga.tugastst.my.id/privkey.pem
```

### Langkah 2: Upload Files ke Server

```bash
# Di local machine, upload folder frontend ke server
scp -r src/frontend user@your-server:/home/user/movie-app/

# Atau clone repository
cd /home/user
git clone <your-repo-url>
cd movie-app/src/frontend
```

### Langkah 3: Build dan Run dengan Docker

```bash
# Masuk ke direktori frontend
cd /home/user/movie-app/src/frontend

# Build Docker image
docker-compose build

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Langkah 4: Verifikasi

Buka browser dan akses:
- HTTP: `http://huga.tugastst.my.id` (akan redirect ke HTTPS)
- HTTPS: `https://huga.tugastst.my.id`

## Development (Local)

Untuk development di local tanpa SSL:

```bash
# Jalankan dengan simple HTTP server
cd src/frontend

# Python 3
python3 -m http.server 8080

# Atau dengan Node.js (install http-server)
npx http-server -p 8080

# Akses di browser: http://localhost:8080
```

**Note untuk Local Development:**
- Update `API_CONFIG.WATCHLIST_SERVICE` di `app.js` jika perlu
- Browser mungkin block mixed content (HTTPS API dari HTTP page)

## Konfigurasi API

Jika URL API berubah, edit file `app.js`:

```javascript
const API_CONFIG = {
    MOVIE_SERVICE: 'https://joan.tugastst.my.id',
    WATCHLIST_SERVICE: 'http://100.114.117.49:9595'
};
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up -d --build
```

## Troubleshooting

### 1. Certificate Error
```bash
# Check certificate files exist
ls -la /etc/letsencrypt/live/huga.tugastst.my.id/

# Renew certificate
sudo certbot renew
```

### 2. Port Already in Use
```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service
sudo systemctl stop apache2  # or nginx
```

### 3. API Connection Failed
- Pastikan watchlist service running di port 9595
- Check firewall: `sudo ufw allow 9595`
- Verify CORS settings di backend

### 4. Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## Security Notes

- SSL certificates harus di-mount sebagai read-only (`:ro`)
- Nginx security headers sudah dikonfigurasi
- Jangan commit SSL certificates ke Git
- Update SSL certificates sebelum expired (certbot auto-renewal)

## Auto-Renewal SSL Certificate

Setup auto-renewal dengan cron:

```bash
# Edit crontab
sudo crontab -e

# Add line (check & renew every day at 2am):
0 2 * * * certbot renew --quiet && docker-compose -f /home/user/movie-app/src/frontend/docker-compose.yml restart
```

## Monitoring

```bash
# Check container status
docker ps | grep huga-frontend

# Check nginx access logs
docker-compose exec frontend tail -f /var/log/nginx/access.log

# Check nginx error logs
docker-compose exec frontend tail -f /var/log/nginx/error.log
```

## Updates & Maintenance

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
cd src/frontend
docker-compose up -d --build

# Clean up old images
docker image prune -a
```

## Support

Untuk pertanyaan dan issue, hubungi developer atau buat issue di repository.
