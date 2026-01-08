# UAS-TST - Movie Watchlist Application

Aplikasi Movie Watchlist dengan arsitektur microservices yang terdiri dari:
- Movie Microservice (katalog film)
- Watchlist Microservice (user & watchlist management)
- Frontend Web Application (user interface)

## 📁 Struktur Proyek

```
src/
├── api/
│   ├── movie-microservices/       # Service untuk data film
│   └── watchlist-microservices/   # Service untuk user & watchlist
└── frontend/                       # Web frontend application
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── nginx.conf
    ├── Dockerfile
    ├── docker-compose.yml
    └── deploy.sh
```

## 🚀 Quick Start

### Frontend Application
```bash
cd src/frontend
./deploy.sh
```

Akses: **https://huga.tugastst.my.id/**

### Microservices

#### Movie Service
```bash
cd src/api/movie-microservices
docker-compose up -d
```

#### Watchlist Service
```bash
cd src/api/watchlist-microservices
npm install
node index.js
```

## 🌟 Fitur Frontend

1. **Daftar** - Registrasi user baru dengan nama
2. **Login** - Login user dengan nama
3. **Movie Catalog** - Browse dan search film
4. **Add to Watchlist** - Tambahkan film ke watchlist pribadi
5. **My Watchlist** - Lihat daftar film favorit

## 🔗 API Endpoints

### Movie Service (`https://joan.tugastst.my.id`)
- `GET /movies` - Semua film
- `GET /movies/:id` - Detail film
- `GET /movies/search/:query` - Cari film

### Watchlist Service (`http://100.114.117.49:9595`)
- `POST /users` - Daftar user baru
- `GET /users` - Semua user
- `POST /watchlist` - Tambah ke watchlist
- `GET /watchlist/:userId` - Watchlist user
- `GET /watchlist/:userId/full` - Watchlist dengan detail film

## 📖 Documentation

- [Frontend README](src/frontend/README.md) - Dokumentasi lengkap frontend
- [Frontend Quick Start](src/frontend/QUICKSTART.md) - Panduan cepat deployment

## 🛠️ Teknologi

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Nginx (Web Server)
- Docker & Docker Compose

**Backend:**
- Node.js + Express
- JSON File Storage
- Docker

## 🔐 Deployment

Frontend dideploy ke subdomain: **https://huga.tugastst.my.id/**

Untuk deployment detail, lihat [Frontend README](src/frontend/README.md)

## 👨‍💻 Developer

Huga - Sistem Terintegrasi UAS

## 📝 License

MIT License