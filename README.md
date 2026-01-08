# 🎬 Movie Watchlist Application - Huga

Aplikasi Movie Watchlist dengan arsitektur microservices yang terintegrasi dengan partner services. Sistem ini menampilkan katalog film, memungkinkan user mengelola watchlist pribadi, dan menyediakan fitur review film dengan desain premium dark theme.

## 🌐 Live Demo

- **Frontend (Vercel):** https://huga.tugastst.my.id/
- **STB Deployment:** http://watchlist-huga.tugastst.my.id/ (port 8585)
- **Watchlist API:** http://100.114.117.49:9595
- **Movie Service (Partner):** https://joan.tugastst.my.id

---

## 📁 Struktur Proyek

```
TST-Watchlist/
├── src/
│   ├── api/
│   │   ├── movie-microservices/          # Movie service (partner - Joan)
│   │   │   ├── docker-compose.yml
│   │   │   ├── Dockerfile
│   │   │   ├── index.js
│   │   │   ├── package.json
│   │   │   └── data/
│   │   │       ├── movies.json
│   │   │       └── reviews.json
│   │   │
│   │   └── watchlist-microservices/      # Watchlist service (Huga)
│   │       ├── Dockerfile
│   │       ├── index.js
│   │       ├── package.json
│   │       └── data/
│   │           ├── users.json
│   │           └── watchlists.json
│   │
│   └── frontend/                          # Web frontend (Vercel)
│       ├── app.js                         # JavaScript logic
│       ├── index.html                     # HTML structure
│       ├── styles.css                     # Premium dark theme CSS
│       ├── nginx.conf                     # Nginx config (Docker)
│       ├── Dockerfile                     # Frontend container
│       ├── docker-compose.yml
│       ├── deploy.sh
│       ├── vercel.json                    # Vercel config
│       └── README.md
│
├── deployment/                            # Full deployment package
│   ├── docker-compose.yml                 # Multi-service orchestration
│   ├── nginx.conf
│   ├── deploy.sh                          # Auto deployment script
│   ├── transfer.sh                        # SCP transfer helper
│   ├── README.md                          # Full deployment guide
│   ├── QUICKSTART.md                      # Quick reference
│   ├── watchlist-service/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   └── data/
│   └── frontend/
│       ├── index.html
│       ├── app.js
│       └── styles.css
│
└── deployment-stb/                        # Minimal STB deployment (4 files)
    ├── Dockerfile                         # Single container
    ├── index.html                         # Frontend + inline CSS/JS
    ├── index.js                           # Backend API server
    ├── package.json                       # Dependencies
    └── nginx.conf                         # Optional reverse proxy
```

---

## 🚀 Quick Start

### Option 1: Frontend di Vercel (Production)

```bash
cd src/frontend
npm i -g vercel@latest
vercel --prod
```

Deployed at: **https://huga.tugastst.my.id/**

### Option 2: STB Deployment (Single Container - 4 Files)

**Transfer files ke STB:**
```bash
scp deployment-stb/* root@100.114.117.49:/root/watchlist-huga/
```

**Deploy di STB:**
```bash
ssh root@100.114.117.49
cd /root/watchlist-huga
docker build -t watchlist-huga-stb .
docker run -d --name watchlist-huga \
  -p 8585:8585 \
  -v watchlist_data:/data \
  watchlist-huga-stb
```

Access: **http://100.114.117.49:8585** atau **http://watchlist-huga.tugastst.my.id**

### Option 3: Full Deployment Package (Docker Compose)

```bash
cd deployment
./deploy.sh
```

---

## 🌟 Fitur Aplikasi

### 🔐 Authentication
- **Registrasi** - Daftar user baru dengan nama
- **Login** - Login dengan nama (simple auth)
- **Logout** - Keluar dan clear session

### 🎥 Movie Catalog
- **Browse Movies** - Lihat semua film dari partner service
- **Search** - Cari film berdasarkan title, director, atau genre
- **Movie Details** - Rating, tahun, director, description
- **Poster Images** - High-quality movie posters

### ⭐ Watchlist Management
- **Add to Watchlist** - Tambah film ke watchlist pribadi
- **My Watchlist** - Lihat daftar film favorit dengan detail lengkap
- **Remove** - Hapus film dari watchlist (coming soon)

### 💬 Review System
- **View Reviews** - Lihat review dari user lain
- **Add Review** - Tulis review dengan rating (1-5 stars)
- **Review Modal** - Popup modal untuk menampilkan semua review

### 🎨 Premium UI/UX
- **Dark Theme** - Desain gelap dengan gold accents (#d4af37)
- **Responsive Design** - Mobile, tablet, desktop friendly
- **Smooth Animations** - Hover effects, transitions, shadows
- **Toast Notifications** - Feedback untuk setiap aksi
- **Loading States** - Skeleton screens untuk data loading

---

## 🔗 API Endpoints

### Movie Service - Joan (`https://joan.tugastst.my.id`)
```
GET    /movies                    # Semua film
GET    /movies/:id                # Detail film by ID
GET    /movies/search/:query      # Cari film
POST   /reviews                   # Tambah review
GET    /reviews/movie/:movieId    # Review untuk film tertentu
```

### Watchlist Service - Huga (`http://100.114.117.49:9595` atau `:8585`)
```
POST   /users                     # Registrasi user baru
GET    /users                     # Get semua user
POST   /watchlist                 # Tambah movie ke watchlist
GET    /watchlist/:userId         # Watchlist by user
GET    /watchlist/:userId/full    # Watchlist + detail film (integrated)
GET    /health                    # Health check endpoint
```

**Request Examples:**

Create User:
```json
POST /users
{
  "name": "Huga"
}
```

Add to Watchlist:
```json
POST /watchlist
{
  "userId": "1234567890",
  "movieId": "1"
}
```

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid, animations
- **Vanilla JavaScript** - ES6+, async/await, fetch API
- **localStorage** - Client-side session management
- **Vercel** - Production deployment

### Backend (Watchlist Service)
- **Node.js 18** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client untuk integrasi
- **File System (fs)** - JSON-based data storage
- **CORS** - Cross-origin support

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy & static file serving
- **Cloudflare Tunnel** - Secure public access
- **Git** - Version control

---

## 🎨 Design System

### Color Palette (Premium Dark)
```css
--primary-color: #d4af37      /* Gold */
--primary-dark: #b8942f       /* Dark Gold */
--primary-light: #f0d97a      /* Light Gold */
--background: #0a0a0a         /* Deep Black */
--surface: #1a1a1a            /* Card Background */
--surface-light: #242424      /* Light Surface */
--text-primary: #f5f5f5       /* White Text */
--text-secondary: #b8b8b8     /* Gray Text */
--success: #2dd4bf            /* Teal */
--error: #f87171              /* Red */
```

### Typography
- **Font Family:** Inter, Segoe UI, sans-serif
- **Headings:** 700 weight, tight letter-spacing
- **Body:** 1.6 line-height for readability

### Components
- **Buttons:** Gold gradient with hover lift effect
- **Cards:** 12px border-radius, subtle shadows
- **Inputs:** Focus rings with gold accent
- **Modals:** Backdrop blur, slide-down animation
- **Toast:** Bottom-right notifications with 3s timeout

---

## 🐳 Docker Deployment

### STB Deployment (Minimal - 4 Files)

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN mkdir -p /data && chown node:node /data
ENV DATA_DIR=/data
COPY package.json ./
RUN npm install --production
COPY index.js index.html ./
USER node
EXPOSE 8585
CMD ["node", "index.js"]
```

**Build & Run:**
```bash
docker build -t watchlist-huga-stb .
docker run -d --name watchlist-huga \
  -e PORT=8585 \
  -e MOVIE_SERVICE="https://joan.tugastst.my.id" \
  -p 8585:8585 \
  -v watchlist_data:/data \
  watchlist-huga-stb
```

### Full Deployment (Docker Compose)

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  watchlist-service:
    build: ./watchlist-service
    ports:
      - "9595:9595"
    volumes:
      - ./watchlist-service/data:/app/data
    environment:
      - NODE_ENV=production
  
  frontend:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - watchlist-service
```

---

## 🌐 Deployment Scenarios

### Scenario 1: Vercel (Frontend Only)
- Frontend: Vercel CDN
- API: External (100.114.117.49:9595)
- Best for: Public access, high availability

### Scenario 2: STB Single Container
- Frontend + Backend: Same container (port 8585)
- Data: Docker volume
- Best for: Simple deployment, minimal files

### Scenario 3: STB Docker Compose
- Frontend: Nginx container (port 8080)
- Backend: Node container (port 9595)
- Best for: Separation of concerns, scalability

### Scenario 4: Cloudflare Tunnel
- Public URL via Cloudflare tunnel
- No port forwarding needed
- Best for: Secure remote access

---

## 🔧 Configuration

### Environment Variables

**Backend (index.js):**
```bash
PORT=8585                                  # Server port
DATA_DIR=/data                             # Data directory
MOVIE_SERVICE=https://joan.tugastst.my.id  # Partner API
```

**Frontend (app.js):**
```javascript
const API_CONFIG = {
    MOVIE_SERVICE: 'https://joan.tugastst.my.id',
    WATCHLIST_SERVICE: ''  // Same-origin (relative paths)
};
```

### Cloudflare Tunnel Setup

**config.yml:**
```yaml
ingress:
  - hostname: watchlist-huga.tugastst.my.id
    service: http://127.0.0.1:8585
  - service: http_status:404
```

**Cloudflare Dashboard:**
1. Go to **Tunnels** → Select your tunnel
2. **Public Hostnames** → **Create public hostname**
3. Subdomain: `watchlist-huga`
4. Domain: `tugastst.my.id`
5. Service: `http://127.0.0.1:8585`

---

## 📊 Data Structure

### users.json
```json
[
  {
    "id": "1736331234567",
    "name": "Huga"
  }
]
```

### watchlists.json
```json
[
  {
    "userId": "1736331234567",
    "movieId": "1"
  }
]
```

### Integration Response (GET /watchlist/:userId/full)
```json
[
  {
    "userId": "1736331234567",
    "movieId": "1",
    "movie": {
      "id": 1,
      "title": "The Shawshank Redemption",
      "year": 1994,
      "genre": ["Drama"],
      "director": "Frank Darabont",
      "rating": 9.3,
      "poster": "https://...",
      "description": "..."
    }
  }
]
```

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8585/health
# Response: {"status":"ok"}
```

### API Tests
```bash
# Create user
curl -X POST http://localhost:8585/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'

# Get users
curl http://localhost:8585/users

# Add to watchlist
curl -X POST http://localhost:8585/watchlist \
  -H "Content-Type: application/json" \
  -d '{"userId":"123","movieId":"1"}'

# Get watchlist with movies
curl http://localhost:8585/watchlist/123/full
```

---

## 🐛 Troubleshooting

### Container won't start
```bash
docker logs watchlist-huga
docker inspect watchlist-huga
```

### Port already in use
```bash
netstat -tlnp | grep 8585
docker ps | grep 8585
```

### Data not persisting
```bash
docker volume ls
docker volume inspect watchlist_data
```

### Can't reach partner API
```bash
curl -v https://joan.tugastst.my.id/movies
```

### DNS not resolving
```bash
nslookup watchlist-huga.tugastst.my.id
dig watchlist-huga.tugastst.my.id
```

---

## 📚 Documentation

- [Frontend README](src/frontend/README.md) - Frontend documentation
- [Frontend QUICKSTART](src/frontend/QUICKSTART.md) - Quick deployment
- [Deployment README](deployment/README.md) - Full deployment guide
- [Deployment QUICKSTART](deployment/QUICKSTART.md) - Quick reference

---

## 🔄 Update & Maintenance

### Update Code
```bash
git pull origin main
cd deployment-stb
docker build -t watchlist-huga-stb .
docker stop watchlist-huga
docker rm watchlist-huga
docker run -d --name watchlist-huga \
  -p 8585:8585 \
  -v watchlist_data:/data \
  watchlist-huga-stb
```

### Backup Data
```bash
docker exec watchlist-huga tar -czf /tmp/backup.tar.gz /data
docker cp watchlist-huga:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

### Restore Data
```bash
docker cp backup-20260108.tar.gz watchlist-huga:/tmp/
docker exec watchlist-huga tar -xzf /tmp/backup.tar.gz -C /
docker restart watchlist-huga
```

### View Logs
```bash
docker logs -f watchlist-huga
docker logs --tail 100 watchlist-huga
```

---

## 🎯 Roadmap

- [ ] Delete from watchlist
- [ ] Edit user profile
- [ ] Movie filtering (genre, year, rating)
- [ ] Sorting options
- [ ] Pagination for large datasets
- [ ] User authentication with JWT
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Admin dashboard
- [ ] Social sharing
- [ ] Email notifications

---

## 👨‍💻 Developer

**Huga Atama**  
Sistem Terintegrasi - UAS  
Universitas Indonesia  
2026

---

## 📄 License

MIT License - Free for educational and personal use

---

## 🙏 Acknowledgments

- **Joan** - Movie & Review Service API
- **Cloudflare** - Tunnel infrastructure
- **Vercel** - Frontend hosting
- **Node.js & Express** - Backend framework
- **Docker** - Containerization platform

---

**⭐ Star this repo if you find it useful!**

MIT License