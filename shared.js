// ========== shared.js ==========
const API_KEY = "a44d005848365ef66c0f555328109508";
const API_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const PLACEHOLDER = "https://placehold.co/300x450/151515/888?text=No+Image";

let currentUser = null;
let favorites = [];
let adminSettings = {
  showTrending: true,
  showTopRated: true,
  showUpcoming: true
};

// ---------- Auth ----------
function getUsers() {
  if (!localStorage.users) {
    localStorage.users = JSON.stringify({ 
      admin: { password: "admin123", role: "admin" },
      user: { password: "user123", role: "user" }
    });
  }
  return JSON.parse(localStorage.users);
}

function switchTab(tab) {
  const isLogin = tab === "login";
  const divLogin = document.getElementById("divLogin");
  const divSignup = document.getElementById("divSignup");
  const tabL = document.getElementById("tabL");
  const tabS = document.getElementById("tabS");
  if (divLogin) divLogin.style.display = isLogin ? "block" : "none";
  if (divSignup) divSignup.style.display = isLogin ? "none" : "block";
  if (tabL) tabL.className = "tab-btn" + (isLogin ? " active" : "");
  if (tabS) tabS.className = "tab-btn" + (!isLogin ? " active" : "");
}

function doLogin() {
  const username = document.getElementById("lUser")?.value;
  const password = document.getElementById("lPass")?.value;
  const users = getUsers();
  if (!users[username] || users[username].password !== password) {
    alert("Wrong credentials! Try admin/admin123 or user/user123");
    return;
  }
  currentUser = { name: username, role: users[username].role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  favorites = JSON.parse(localStorage.getItem(`favs_${username}`) || "[]");
  // Redirect to home page after login
  window.location.href = "index.html";
}

function doSignup() {
  const newUser = document.getElementById("sUser")?.value.trim();
  const newPass = document.getElementById("sPass")?.value;
  const users = getUsers();
  if (!newUser || newPass.length < 4) {
    alert("Username and password (min 4 chars) required");
    return;
  }
  if (users[newUser]) {
    alert("Username already taken!");
    return;
  }
  users[newUser] = { password: newPass, role: "user" };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  switchTab("login");
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
function loadAdminSettings() {
  const saved = localStorage.getItem("adminSettings");
  if (saved) {
    adminSettings = JSON.parse(saved);
  }
  // Update checkbox states if modal is open (optional)
  const trendCheck = document.getElementById("toggleTrending");
  if (trendCheck) trendCheck.checked = adminSettings.showTrending;
  const topCheck = document.getElementById("toggleTopRated");
  if (topCheck) topCheck.checked = adminSettings.showTopRated;
  const upCheck = document.getElementById("toggleUpcoming");
  if (upCheck) upCheck.checked = adminSettings.showUpcoming;
}

// Save settings and refresh home page
function applyAdminSettings() {
  adminSettings.showTrending = document.getElementById("toggleTrending").checked;
  adminSettings.showTopRated = document.getElementById("toggleTopRated").checked;
  adminSettings.showUpcoming = document.getElementById("toggleUpcoming").checked;
  localStorage.setItem("adminSettings", JSON.stringify(adminSettings));
  bootstrap.Modal.getInstance(document.getElementById("adminModal")).hide();
  showHome();  // refresh home with new settings
}

// Open admin modal (called from admin button)
function openAdminModal() {
  // Sync checkboxes with current settings
  document.getElementById("toggleTrending").checked = adminSettings.showTrending;
  document.getElementById("toggleTopRated").checked = adminSettings.showTopRated;
  document.getElementById("toggleUpcoming").checked = adminSettings.showUpcoming;
  new bootstrap.Modal(document.getElementById("adminModal")).show();
}

// Check auth on every page (except index which handles login)
function checkAuth() {
  const saved = localStorage.getItem("currentUser");
  if (!saved) {
    window.location.href = "index.html";
    return false;
  }
  currentUser = JSON.parse(saved);
  favorites = JSON.parse(localStorage.getItem(`favs_${currentUser.name}`) || "[]");
  return true;
}

// ---------- API Helpers ----------
async function fetchData(endpoint, params = {}) {
  try {
    const query = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
    const response = await fetch(`${API_URL}${endpoint}?${query}`);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getPoster(path) { return path ? IMG_URL + path : PLACEHOLDER; }
function getYear(date) { return date ? date.slice(0,4) : "—"; }
function getRating(vote) { return vote ? vote.toFixed(1) : "N/A"; }
function showLoader() { return '<div class="loader"></div>'; }

// ---------- Movie Grid ----------
function createMovieGrid(movies) {
  if (!movies || movies.length === 0) return '<div class="empty-state">No movies found 🎬</div>';
  let html = '<div class="movie-grid">';
  for (const movie of movies) {
    html += `
      <div class="movie-card-wrap">
        <div class="movie-card" onclick="showMovieDetail(${movie.id})">
          <img src="${getPoster(movie.poster_path)}" onerror="this.src='${PLACEHOLDER}'">
          <div class="movie-badge">⭐ ${getRating(movie.vote_average)}</div>
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-year">${getYear(movie.release_date)}</div>
          </div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

// ---------- Movie Detail Modal (global) ----------
async function showMovieDetail(movieId) {
  const modalEl = document.getElementById("movieModal");
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  document.getElementById("modalBody").innerHTML = showLoader();
  modal.show();
  const movie = await fetchData(`/movie/${movieId}`);
  if (!movie) return;
  const isFavorite = favorites.includes(movieId);
  const poster = getPoster(movie.poster_path);
  document.getElementById("modalBody").innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:20px;">
      <img src="${poster}" style="width:150px; border-radius:14px;" onerror="this.src='${PLACEHOLDER}'">
      <div style="flex:1;">
        <h3 style="font-family:'Bebas Neue'; font-size:28px;">${movie.title}</h3>
        <p style="color:#aaa; margin:10px 0;">⭐ ${getRating(movie.vote_average)}/10 | 📅 ${movie.release_date || "?"} | ⏱️ ${movie.runtime || "?"} min</p>
        <p>${movie.overview || "No description available."}</p>
        <button class="${isFavorite ? 'btn-secondary' : 'btn-red'}" style="margin-top:15px; padding:8px 24px; border-radius:30px; border:none;" onclick="toggleFavoriteFromModal(${movieId})">${isFavorite ? "❤️ Remove from Fav" : "♡ Add to Fav"}</button>
      </div>
    </div>
  `;
}

function toggleFavoriteFromModal(movieId) {
  toggleFavorite(movieId);
  showMovieDetail(movieId); // refresh modal
}

function toggleFavorite(movieId) {
  const index = favorites.indexOf(movieId);
  if (index === -1) {
    favorites.push(movieId);
    alert("Added to favorites! ❤️");
  } else {
    favorites.splice(index, 1);
    alert("Removed from favorites");
  }
  localStorage.setItem(`favs_${currentUser.name}`, JSON.stringify(favorites));
}

// ---------- Page-specific initializers ----------
async function initHome() {
  if (!checkAuth()) return;
  
  // Show admin button & load settings if admin
  const adminBtn = document.getElementById("adminPanelBtn");
  if (currentUser?.role === 'admin') {
    if (adminBtn) adminBtn.style.display = "inline-block";
    loadAdminSettings();   // make sure adminSettings is synced
  } else {
    if (adminBtn) adminBtn.style.display = "none";
  }

  const main = document.getElementById("mainContent");
  main.innerHTML = `<div class="hero"><h1>DISCOVER <span>INDIAN</span> CINEMA</h1><p>Bollywood · Tollywood · Kollywood</p></div><div class="container" id="dynamicContent">${showLoader()}</div>`;
  
  const today = new Date().toISOString().slice(0,10);
  const indiaParams = { with_origin_country: "IN", region: "IN" };
  
  // Build promises based on adminSettings
  let promises = {};
  if (adminSettings.showTrending) {
    promises.trending = fetchData("/discover/movie", { sort_by: "popularity.desc", ...indiaParams });
  }
  if (adminSettings.showTopRated) {
    promises.topRated = fetchData("/discover/movie", { sort_by: "vote_average.desc", "vote_count.gte": 50, ...indiaParams });
  }
  if (adminSettings.showUpcoming) {
    promises.upcoming = fetchData("/discover/movie", { sort_by: "release_date.asc", "primary_release_date.gte": today, ...indiaParams });
  }
  const results = await Promise.all(Object.values(promises));
  const keys = Object.keys(promises);
  let contentHtml = '';
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const data = results[i];
    if (key === 'trending') contentHtml += `<div class="section-title"><span>🔥 Trending in India</span></div>${createMovieGrid(data?.results || [])}`;
    else if (key === 'topRated') contentHtml += `<div class="section-title"><span>⭐ Top Rated Indian Movies</span></div>${createMovieGrid(data?.results || [])}`;
    else if (key === 'upcoming') contentHtml += `<div class="section-title"><span>📅 Upcoming Indian Releases</span></div>${createMovieGrid(data?.results || [])}`;
  }
  if (!adminSettings.showTrending && !adminSettings.showTopRated && !adminSettings.showUpcoming) {
    contentHtml = `<div class="empty-state">Admin has hidden all sections. Go to Admin panel to enable.</div>`;
  }
  document.getElementById("dynamicContent").innerHTML = contentHtml;
}

async function initGenres() {
  if (!checkAuth()) return;
  const genreData = await fetchData("/genre/movie/list", { language: "en-US" });
  const genreList = (genreData?.genres && genreData.genres.length) ? genreData.genres : [
    { id: 28, name: "Action" }, { id: 35, name: "Comedy" }, { id: 18, name: "Drama" }
  ];
  let buttons = '';
  for (const genre of genreList) {
    buttons += `<div class="genre-card" onclick="loadGenreMovies(${genre.id}, '${genre.name}')">${genre.name}</div>`;
  }
  document.getElementById("mainContent").innerHTML = `
    <div class="container" style="text-align:center; padding:45px 0 20px;">
      <h1 style="font-family:'Bebas Neue'; font-size:48px;">Browse <span style="color:var(--red);">Genres</span></h1>
    </div>
    <div class="container">
      <div class="genre-grid">${buttons}</div>
      <div id="genreResult"></div>
    </div>
  `;
  window.loadGenreMovies = async function(genreId, genreName) {
    const resultDiv = document.getElementById("genreResult");
    resultDiv.innerHTML = showLoader();
    const data = await fetchData("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", with_origin_country: "IN", region: "IN" });
    resultDiv.innerHTML = `<div class="section-title"><span>🎬 ${genreName} (Indian)</span></div>${createMovieGrid(data?.results || [])}`;
  };
}

async function initFavorites() {
  if (!checkAuth()) return;
  if (favorites.length === 0) {
    document.getElementById("mainContent").innerHTML = `
      <div class="container" style="text-align:center; padding:80px 20px;">
        <i class="bi bi-heart-broken" style="font-size:60px; color:#3a3a3a;"></i>
        <h3 style="margin:18px 0;">No favorites yet</h3>
        <a href="index.html" class="btn-red" style="display:inline-block; width:auto; padding:10px 30px; text-decoration:none;">Browse Movies</a>
      </div>
    `;
    return;
  }
  document.getElementById("mainContent").innerHTML = `<div class="container">${showLoader()}</div>`;
  const favMovies = [];
  for (const id of favorites) {
    const movie = await fetchData(`/movie/${id}`);
    if (movie) favMovies.push(movie);
  }
  document.getElementById("mainContent").innerHTML = `<div class="container"><div class="section-title"><span>❤️ My Favorites (${favMovies.length})</span></div>${createMovieGrid(favMovies)}</div>`;
}

function initContact() {
  if (!checkAuth()) return;
  document.getElementById("mainContent").innerHTML = `
    <div class="container" style="max-width:580px; padding:45px 0;">
      <div class="info-card">
        <h2 class="text-center" style="font-family:'Bebas Neue'; font-size:34px;">📧 Contact Us</h2>
        <form onsubmit="event.preventDefault(); sendMessage();">
          <input id="cName" class="field-input" placeholder="Your name" required>
          <input id="cEmail" class="field-input" type="email" placeholder="Your email" required>
          <textarea id="cMsg" class="field-textarea" rows="4" placeholder="Message (min 10 characters)" required></textarea>
          <button type="submit" class="contact-submit">Send Message</button>
        </form>
        <div id="msgSuccess" style="display:none;" class="mt-3 bg-success text-center p-2 rounded">✅ Sent!</div>
      </div>
    </div>
  `;
  window.sendMessage = function() {
    const msg = document.getElementById("cMsg")?.value;
    if (!msg || msg.length < 10) { alert("Min 10 chars required"); return; }
    const successDiv = document.getElementById("msgSuccess");
    if (successDiv) successDiv.style.display = "block";
    document.getElementById("cName").value = "";
    document.getElementById("cEmail").value = "";
    document.getElementById("cMsg").value = "";
    setTimeout(() => { if (successDiv) successDiv.style.display = "none"; }, 3000);
  };
}

function initAbout() {
  if (!checkAuth()) return;
  document.getElementById("mainContent").innerHTML = `
    <div class="container" style="max-width:750px; padding:45px 0;">
      <div class="info-card">
        <h2 class="text-center" style="font-family:'Bebas Neue'; font-size:38px;">About <span style="color:var(--red);">MovieVault</span></h2>
        <div class="stat-strip">
          <div class="stat-box"><span class="stat-num">10K+</span><div>Films</div></div>
          <div class="stat-box"><span class="stat-num">5+</span><div>Industries</div></div>
          <div class="stat-box"><span class="stat-num">12+</span><div>Genres</div></div>
        </div>
        <div class="about-grid">
          <div class="about-card">🔥 Trending Indian Movies</div>
          <div class="about-card">🎭 Genre Browsing</div>
          <div class="about-card">🔍 Smart Search</div>
          <div class="about-card">❤️ Save Favorites</div>
          <div class="about-card">📅 Upcoming Indian Releases</div>
        </div>
        <div class="tech-item"><strong>Bootstrap 5 + Multi-page App</strong></div>
      </div>
    </div>
  `;
}

// Global search function (used on all pages)
window.searchMovie = async function() {
  const query = document.getElementById("searchInput")?.value.trim();
  if (!query) { alert("Please type something to search"); return; }
  const main = document.getElementById("mainContent");
  main.innerHTML = `<div class="container">${showLoader()}</div>`;
  const results = await fetchData("/search/movie", { query, region: "IN" });
  main.innerHTML = `<div class="container"><div class="section-title"><span>🔍 "${query}" (Indian results)</span></div>${createMovieGrid(results?.results || [])}</div>`;
};
