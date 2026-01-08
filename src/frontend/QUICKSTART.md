# Quick Start Guide - Movie Watchlist Frontend

## 🚀 Deployment ke Production (https://huga.tugastst.my.id/)

### Langkah Cepat:

1. **Login ke Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Setup SSL Certificate** (jika belum ada)
   ```bash
   sudo apt update
   sudo apt install certbot -y
   sudo certbot certonly --standalone -d huga.tugastst.my.id
   ```

3. **Clone atau Upload Code**
   ```bash
   cd /home/user
   git clone <your-repo>
   cd <repo>/src/frontend
   ```

4. **Deploy**
   ```bash
   sudo ./deploy.sh
   ```

5. **Akses**
   Buka browser: `https://huga.tugastst.my.id`

---

## 💻 Development Local

### Tanpa Docker (Simple):

```bash
cd src/frontend

# Python
python3 -m http.server 8080

# Node.js
npx http-server -p 8080
```

Akses: `http://localhost:8080`

### Dengan Docker:

```bash
cd src/frontend
docker-compose up -d
```

Akses: `http://localhost` (atau port yang dikonfigurasi)

---

## 📋 Cara Menggunakan Aplikasi

### 1. Daftar User Baru
- Klik tab "Daftar"
- Masukkan nama Anda
- Klik "Daftar"

### 2. Login
- Klik tab "Login"
- Masukkan nama yang sudah terdaftar
- Klik "Login"

### 3. Lihat Movie Catalog
- Setelah login, Anda akan melihat katalog film
- Gunakan search box untuk mencari film
- Klik "+ Add to Watchlist" untuk menambahkan ke watchlist

### 4. Lihat Watchlist
- Klik tab "⭐ My Watchlist"
- Lihat semua film yang sudah Anda tambahkan
- Klik "🔄 Refresh" untuk reload data

---

## 🔧 Troubleshooting

### "Movie service unreachable"
✅ **Solusi**: Pastikan movie microservice running di `https://joan.tugastst.my.id`

### "User tidak ditemukan"
✅ **Solusi**: Daftar terlebih dahulu dengan nama yang sama

### SSL Certificate Error
✅ **Solusi**: 
```bash
sudo certbot renew
docker-compose restart
```

### Container tidak start
✅ **Solusi**:
```bash
docker-compose down
docker-compose up -d --build
docker-compose logs -f
```

---

## 📦 Update Code

```bash
# Pull latest changes
git pull origin main

# Rebuild & restart
cd src/frontend
docker-compose up -d --build
```

---

## 🔍 Monitoring

```bash
# Check status
docker ps | grep huga-frontend

# View logs
docker-compose logs -f

# Container stats
docker stats huga-frontend
```

---

## 🆘 Support Commands

```bash
# Stop everything
docker-compose down

# Remove all containers & images
docker-compose down --rmi all

# Clean Docker
docker system prune -a

# Restart nginx in container
docker-compose exec frontend nginx -s reload
```

---

## 📝 Notes

- **Local storage** digunakan untuk menyimpan session user
- **CORS** harus diaktifkan di backend services
- **SSL certificates** akan expire dalam 90 hari (setup auto-renewal)
- **Backup** data watchlist secara berkala

---

## 🎯 Testing Checklist

- [ ] Register user baru
- [ ] Login dengan user yang sudah ada
- [ ] Browse movie catalog
- [ ] Search movies
- [ ] Add movie to watchlist
- [ ] View watchlist
- [ ] Logout
- [ ] Login kembali (session harus tersimpan)

---

## 📞 Contact

Jika ada masalah, hubungi developer atau buat issue di repository.
