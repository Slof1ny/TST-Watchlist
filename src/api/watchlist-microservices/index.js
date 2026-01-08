const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

const USERS = "./data/users.json";
const WATCHLISTS = "./data/watchlists.json";

// partner movie service
const MOVIE_SERVICE = "http://100.114.117.49:8010";

const read = (f) => JSON.parse(fs.readFileSync(f));
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

/* USERS */
app.post("/users", (req, res) => {
  const users = read(USERS);
  const user = { id: Date.now().toString(), name: req.body.name };
  users.push(user);
  write(USERS, users);
  res.json(user);
});

app.get("/users", (req, res) => {
  res.json(read(USERS));
});

/* WATCHLIST */
app.post("/watchlist", (req, res) => {
  const lists = read(WATCHLISTS);
  lists.push(req.body);
  write(WATCHLISTS, lists);
  res.json({ status: "added" });
});

app.get("/watchlist/:userId", (req, res) => {
  const lists = read(WATCHLISTS).filter(
    l => l.userId === req.params.userId
  );
  res.json(lists);
});

/* INTEGRATION ENDPOINT */
app.get("/watchlist/:userId/full", async (req, res) => {
  try {
    // 1. Ambil watchlist user
    const lists = read(WATCHLISTS).filter(
      l => l.userId === req.params.userId
    );

    if (lists.length === 0) {
      return res.json([]);
    }

    // 2. Ambil SEMUA movie dari API partner
    const movieResponse = await axios.get(
      "https://joan.tugastst.my.id/movies",
      { timeout: 5000 }
    );

    if (
      !movieResponse.data ||
      !Array.isArray(movieResponse.data.data)
    ) {
      return res.status(502).json({
        error: "Invalid movie API response"
      });
    }

    const movies = movieResponse.data.data;

    // 3. Gabungkan watchlist + detail movie
    const detailed = lists.map(l => {
      const movie = movies.find(
        m => m.id === Number(l.movieId)
      );

      return {
        userId: l.userId,
        movieId: l.movieId,
        movie: movie || null
      };
    });

    res.json(detailed);

  } catch (err) {
    res.status(502).json({
      error: "Movie service unreachable",
      detail: err.message
    });
  }
});

app.listen(9595, "0.0.0.0", () => {
  console.log("Huga User Watchlist Service running on port 9595");
});
