// API Configuration
const API_CONFIG = {
    MOVIE_SERVICE: 'https://joan.tugastst.my.id',
    WATCHLIST_SERVICE: 'https://huga.tugastst.my.id'
};

// State Management
let currentUser = null;
let allMovies = [];
let filteredMovies = [];
let currentMovie = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Auth Functions
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainContent();
    } else {
        showAuthSection();
    }
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('navUser').style.display = 'none';
}

function showMainContent() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userNameDisplay').textContent = `Hello, ${currentUser.name}!`;
    
    loadMovies();
    loadWatchlist();
}

function showTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
    }
    
    clearErrors();
}

async function register() {
    const name = document.getElementById('registerName').value.trim();
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    if (!name) {
        errorDiv.textContent = 'Nama tidak boleh kosong!';
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.WATCHLIST_SERVICE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) throw new Error('Gagal mendaftar');
        
        const user = await response.json();
        successDiv.textContent = 'Pendaftaran berhasil! Silakan login.';
        document.getElementById('registerName').value = '';
        
        setTimeout(() => {
            showTab('login');
            document.getElementById('loginName').value = name;
        }, 1500);
        
    } catch (error) {
        errorDiv.textContent = 'Gagal mendaftar. Silakan coba lagi.';
        console.error(error);
    }
}

async function login() {
    const name = document.getElementById('loginName').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    if (!name) {
        errorDiv.textContent = 'Nama tidak boleh kosong!';
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.WATCHLIST_SERVICE}/users`);
        
        if (!response.ok) throw new Error('Gagal mengambil data user');
        
        const users = await response.json();
        const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
        
        if (!user) {
            errorDiv.textContent = 'User tidak ditemukan. Silakan daftar terlebih dahulu.';
            return;
        }
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMainContent();
        showToast('Login berhasil!');
        
    } catch (error) {
        errorDiv.textContent = 'Gagal login. Silakan coba lagi.';
        console.error(error);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    allMovies = [];
    filteredMovies = [];
    showAuthSection();
    showToast('Logout berhasil!');
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerSuccess').textContent = '';
}

// Content Navigation
function showContent(section) {
    const tabs = document.querySelectorAll('.content-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    
    if (section === 'catalog') {
        document.getElementById('catalogSection').classList.add('active');
        document.getElementById('watchlistSection').classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        document.getElementById('watchlistSection').classList.add('active');
        document.getElementById('catalogSection').classList.remove('active');
        tabs[1].classList.add('active');
        loadWatchlist();
    }
}

// Movie Functions
async function loadMovies() {
    const movieGrid = document.getElementById('movieGrid');
    const loading = document.getElementById('movieLoading');
    const errorDiv = document.getElementById('movieError');
    
    loading.style.display = 'block';
    movieGrid.innerHTML = '';
    errorDiv.textContent = '';
    
    try {
        const response = await fetch(`${API_CONFIG.MOVIE_SERVICE}/movies`);
        
        if (!response.ok) throw new Error('Gagal mengambil data movie');
        
        const data = await response.json();
        allMovies = data.data || [];
        filteredMovies = [...allMovies];
        
        displayMovies(filteredMovies);
        loading.style.display = 'none';
        
    } catch (error) {
        loading.style.display = 'none';
        errorDiv.textContent = 'Gagal memuat movie catalog. Silakan coba lagi.';
        console.error(error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    
    if (movies.length === 0) {
        movieGrid.innerHTML = '<div class="empty-state">Tidak ada movie ditemukan.</div>';
        return;
    }
    
    movies.forEach(movie => {
        const card = createMovieCard(movie, false);
        movieGrid.appendChild(card);
    });
}

function createMovieCard(movie, isWatchlist = false) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
        <div class="movie-poster" onclick="openReviewModal(${movie.id})" style="cursor: pointer;">
            <img src="${movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}" 
                 alt="${movie.title}"
                 onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
            <div class="review-overlay">
                <span class="review-icon">💬 View Reviews</span>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title" onclick="openReviewModal(${movie.id})" style="cursor: pointer;">${movie.title}</h3>
            <p class="movie-year">${movie.year} • ${movie.genre.join(', ')}</p>
            <p class="movie-director">Director: ${movie.director}</p>
            <div class="movie-rating">
                <span class="rating-star">⭐</span>
                <span class="rating-value">${movie.rating}</span>
            </div>
            <p class="movie-description">${movie.description}</p>
            ${!isWatchlist ? 
                `<button onclick="addToWatchlist(${movie.id}); event.stopPropagation();" class="btn-add-watchlist">
                    + Add to Watchlist
                </button>` : 
                `<span class="watchlist-badge">In Your Watchlist</span>`
            }
        </div>
    `;
    
    return card;
}

function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        filteredMovies = [...allMovies];
    } else {
        filteredMovies = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.genre.some(g => g.toLowerCase().includes(searchTerm))
        );
    }
    
    displayMovies(filteredMovies);
}

async function addToWatchlist(movieId) {
    if (!currentUser) {
        showToast('Silakan login terlebih dahulu!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.WATCHLIST_SERVICE}/watchlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                movieId: movieId.toString()
            })
        });
        
        if (!response.ok) throw new Error('Gagal menambahkan ke watchlist');
        
        showToast('Movie berhasil ditambahkan ke watchlist!', 'success');
        
    } catch (error) {
        showToast('Gagal menambahkan ke watchlist. Silakan coba lagi.', 'error');
        console.error(error);
    }
}

// Watchlist Functions
async function loadWatchlist() {
    if (!currentUser) return;
    
    const watchlistGrid = document.getElementById('watchlistGrid');
    const loading = document.getElementById('watchlistLoading');
    const errorDiv = document.getElementById('watchlistError');
    const emptyState = document.getElementById('watchlistEmpty');
    
    loading.style.display = 'block';
    watchlistGrid.innerHTML = '';
    errorDiv.textContent = '';
    emptyState.style.display = 'none';
    
    try {
        const response = await fetch(
            `${API_CONFIG.WATCHLIST_SERVICE}/watchlist/${currentUser.id}/full`
        );
        
        if (!response.ok) throw new Error('Gagal mengambil watchlist');
        
        const watchlistData = await response.json();
        loading.style.display = 'none';
        
        if (watchlistData.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        watchlistData.forEach(item => {
            if (item.movie) {
                const card = createMovieCard(item.movie, true);
                watchlistGrid.appendChild(card);
            }
        });
        
    } catch (error) {
        loading.style.display = 'none';
        errorDiv.textContent = 'Gagal memuat watchlist. Silakan coba lagi.';
        console.error(error);
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Review Modal Functions
async function openReviewModal(movieId) {
    currentMovie = allMovies.find(m => m.id === movieId);
    if (!currentMovie) return;
    
    const modal = document.getElementById('reviewModal');
    const modalTitle = document.getElementById('modalMovieTitle');
    const modalMovieInfo = document.getElementById('modalMovieInfo');
    
    modalTitle.textContent = `Reviews for ${currentMovie.title}`;
    
    modalMovieInfo.innerHTML = `
        <div class="modal-movie-details">
            <img src="${currentMovie.poster || 'https://via.placeholder.com/150x225?text=No+Image'}" 
                 alt="${currentMovie.title}"
                 onerror="this.src='https://via.placeholder.com/150x225?text=No+Image'">
            <div class="modal-movie-text">
                <h3>${currentMovie.title}</h3>
                <p>${currentMovie.year} • ${currentMovie.genre.join(', ')}</p>
                <p>Director: ${currentMovie.director}</p>
                <div class="movie-rating">
                    <span class="rating-star">⭐</span>
                    <span class="rating-value">${currentMovie.rating}</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Clear previous review input
    document.getElementById('reviewRating').value = '5';
    document.getElementById('reviewComment').value = '';
    document.getElementById('reviewError').textContent = '';
    document.getElementById('reviewSuccess').textContent = '';
    
    // Load reviews
    await loadReviews(movieId);
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentMovie = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('reviewModal');
    if (event.target === modal) {
        closeReviewModal();
    }
}

async function loadReviews(movieId) {
    const reviewsList = document.getElementById('reviewsList');
    const reviewsLoading = document.getElementById('reviewsLoading');
    const reviewsEmpty = document.getElementById('reviewsEmpty');
    
    reviewsList.innerHTML = '';
    reviewsLoading.style.display = 'block';
    reviewsEmpty.style.display = 'none';
    
    try {
        const response = await fetch(`${API_CONFIG.MOVIE_SERVICE}/reviews/movie/${movieId}`);
        
        if (!response.ok) throw new Error('Failed to load reviews');
        
        const data = await response.json();
        const reviews = data.data || [];
        
        reviewsLoading.style.display = 'none';
        
        if (reviews.length === 0) {
            reviewsEmpty.style.display = 'block';
            return;
        }
        
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="review-user">
                        <span class="review-username">👤 ${review.username}</span>
                        <span class="review-date">${reviewDate}</span>
                    </div>
                    <div class="review-rating">
                        <span class="rating-star">⭐</span>
                        <span class="rating-value">${review.rating}</span>
                    </div>
                </div>
                <div class="review-comment">${review.comment || 'No comment provided.'}</div>
            `;
            
            reviewsList.appendChild(reviewCard);
        });
        
    } catch (error) {
        reviewsLoading.style.display = 'none';
        reviewsList.innerHTML = '<div class="error-message">Failed to load reviews. Please try again.</div>';
        console.error(error);
    }
}

async function submitReview() {
    if (!currentUser) {
        showToast('Please login first!', 'error');
        return;
    }
    
    if (!currentMovie) return;
    
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    const errorDiv = document.getElementById('reviewError');
    const successDiv = document.getElementById('reviewSuccess');
    
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    if (!comment) {
        errorDiv.textContent = 'Please write a comment for your review.';
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.MOVIE_SERVICE}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                movieId: currentMovie.id,
                userId: currentUser.id,
                username: currentUser.name,
                rating: rating,
                comment: comment
            })
        });
        
        if (!response.ok) throw new Error('Failed to submit review');
        
        successDiv.textContent = 'Review submitted successfully!';
        document.getElementById('reviewRating').value = '5';
        document.getElementById('reviewComment').value = '';
        
        // Reload reviews
        await loadReviews(currentMovie.id);
        
        showToast('Review added successfully!', 'success');
        
    } catch (error) {
        errorDiv.textContent = 'Failed to submit review. Please try again.';
        console.error(error);
    }
}
