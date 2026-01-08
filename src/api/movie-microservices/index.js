const express = require('express');
const fs = require('fs');
const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const MOVIES_DB = './data/movies.json';
const REVIEWS_DB = './data/reviews.json';

const readMovies = () => JSON.parse(fs.readFileSync(MOVIES_DB));
const writeMovies = (data) => fs.writeFileSync(MOVIES_DB, JSON.stringify(data, null, 2));
const readReviews = () => JSON.parse(fs.readFileSync(REVIEWS_DB));
const writeReviews = (data) => fs.writeFileSync(REVIEWS_DB, JSON.stringify(data, null, 2));

// endpoint

// GET all movies
app.get('/movies', (req, res) => {
  const movies = readMovies();
  res.json({
    success: true,
    count: movies.length,
    data: movies
  });
});

// GET movie by ID
app.get('/movies/:id', (req, res) => {
  const movies = readMovies();
  const movie = movies.find(m => m.id == req.params.id);
  
  if (!movie) {
    return res.status(404).json({ 
      success: false, 
      message: 'Movie not found' 
    });
  }
  
  res.json({
    success: true,
    data: movie
  });
});

// GET movies by genre
app.get('/movies/genre/:genre', (req, res) => {
  const movies = readMovies();
  const genre = req.params.genre.toLowerCase();
  const filteredMovies = movies.filter(m => 
    m.genre.some(g => g.toLowerCase() === genre)
  );
  
  res.json({
    success: true,
    count: filteredMovies.length,
    data: filteredMovies
  });
});

// GET movie recommendations (based on genre preferences)
app.get('/movies/recommend/:genre', (req, res) => {
  const movies = readMovies();
  const genre = req.params.genre.toLowerCase();
  
  const recommendations = movies
    .filter(m => m.genre.some(g => g.toLowerCase() === genre))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  res.json({
    success: true,
    message: `Top recommendations for ${req.params.genre} genre`,
    count: recommendations.length,
    data: recommendations
  });
});

// GET top rated movies
app.get('/movies/top/rated', (req, res) => {
  const movies = readMovies();
  const limit = parseInt(req.query.limit) || 5;
  
  const topRated = movies
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
  
  res.json({
    success: true,
    message: `Top ${limit} rated movies`,
    data: topRated
  });
});

// Search movies by title
app.get('/movies/search/:query', (req, res) => {
  const movies = readMovies();
  const query = req.params.query.toLowerCase();
  
  const results = movies.filter(m => 
    m.title.toLowerCase().includes(query) ||
    m.director.toLowerCase().includes(query)
  );
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// POST - Add new movie
app.post('/movies', (req, res) => {
  const movies = readMovies();
  
  const newMovie = {
    id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
    title: req.body.title,
    genre: req.body.genre || [],
    year: req.body.year,
    rating: req.body.rating || 0,
    director: req.body.director,
    description: req.body.description || '',
    poster: req.body.poster || ''
  };
  
  movies.push(newMovie);
  writeMovies(movies);
  
  res.status(201).json({
    success: true,
    message: 'Movie added successfully',
    data: newMovie
  });
});

// PUT - Update movie
app.put('/movies/:id', (req, res) => {
  const movies = readMovies();
  const movieIndex = movies.findIndex(m => m.id == req.params.id);
  
  if (movieIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Movie not found' 
    });
  }
  
  movies[movieIndex] = {
    ...movies[movieIndex],
    ...req.body,
    id: movies[movieIndex].id
  };
  
  writeMovies(movies);
  
  res.json({
    success: true,
    message: 'Movie updated successfully',
    data: movies[movieIndex]
  });
});

// DELETE - Remove movie
app.delete('/movies/:id', (req, res) => {
  const movies = readMovies();
  const movieIndex = movies.findIndex(m => m.id == req.params.id);
  
  if (movieIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Movie not found' 
    });
  }
  
  const deletedMovie = movies.splice(movieIndex, 1);
  writeMovies(movies);
  
  res.json({
    success: true,
    message: 'Movie deleted successfully',
    data: deletedMovie[0]
  });
});

// GET all reviews
app.get('/reviews', (req, res) => {
  const reviews = readReviews();
  res.json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// GET reviews by movie ID
app.get('/reviews/movie/:movieId', (req, res) => {
  const reviews = readReviews();
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  
  res.json({
    success: true,
    count: movieReviews.length,
    data: movieReviews
  });
});

// GET reviews by user ID
app.get('/reviews/user/:userId', (req, res) => {
  const reviews = readReviews();
  const userReviews = reviews.filter(r => r.userId == req.params.userId);
  
  res.json({
    success: true,
    count: userReviews.length,
    data: userReviews
  });
});

// GET average rating for a movie
app.get('/reviews/rating/:movieId', (req, res) => {
  const reviews = readReviews();
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  
  if (movieReviews.length === 0) {
    return res.json({
      success: true,
      movieId: parseInt(req.params.movieId),
      averageRating: 0,
      totalReviews: 0
    });
  }
  
  const avgRating = movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length;
  
  res.json({
    success: true,
    movieId: parseInt(req.params.movieId),
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: movieReviews.length
  });
});

// POST - Add new review
app.post('/reviews', (req, res) => {
  const reviews = readReviews();
  
  const newReview = {
    id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
    movieId: req.body.movieId,
    userId: req.body.userId,
    username: req.body.username,
    rating: req.body.rating,
    comment: req.body.comment || '',
    createdAt: new Date().toISOString()
  };
  
  reviews.push(newReview);
  writeReviews(reviews);
  
  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: newReview
  });
});

// PUT - Update review
app.put('/reviews/:id', (req, res) => {
  const reviews = readReviews();
  const reviewIndex = reviews.findIndex(r => r.id == req.params.id);
  
  if (reviewIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Review not found' 
    });
  }
  
  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    rating: req.body.rating || reviews[reviewIndex].rating,
    comment: req.body.comment || reviews[reviewIndex].comment,
    updatedAt: new Date().toISOString()
  };
  
  writeReviews(reviews);
  
  res.json({
    success: true,
    message: 'Review updated successfully',
    data: reviews[reviewIndex]
  });
});

// DELETE - Remove review
app.delete('/reviews/:id', (req, res) => {
  const reviews = readReviews();
  const reviewIndex = reviews.findIndex(r => r.id == req.params.id);
  
  if (reviewIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Review not found' 
    });
  }
  
  const deletedReview = reviews.splice(reviewIndex, 1);
  writeReviews(reviews);
  
  res.json({
    success: true,
    message: 'Review deleted successfully',
    data: deletedReview[0]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Movie Recommendation Service',
    endpoints: {
      movies: '/movies',
      reviews: '/reviews'
    },
    timestamp: new Date().toISOString()
  });
});

const PORT = 8010;
app.listen(PORT, () => {
  console.log(`Movie Recommendation Service running on port ${PORT}`);
});
