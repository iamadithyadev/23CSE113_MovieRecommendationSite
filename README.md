# 23CSE113_MovieRecommendationSite
# MovieVault – Indian Cinema Discovery Platform

## Group Project Members

Developed by:

- **Adithyadev**
- **Pranav VNG**
- **Dhanesh S**
- **Charan Raj**

## Project Overview

MovieVault is a movie discovery and recommendation web application focused on Indian cinema (Bollywood, Tollywood, Kollywood). It was developed as an academic group project.

The platform allows users to:

- log in securely with predefined credentials
- browse trending, top‑rated, and upcoming Indian movies
- search for movies by title
- filter movies by genre
- view detailed movie information (poster, rating, release date, overview)
- save favorite movies to a personal list
- explore team member portfolios
- contact the team (optional)

Content Managers (Admins) can:

- toggle the visibility of the Trending, Top Rated, and Upcoming sections on the home page
- save these preferences persistently

All movie data is fetched in real time from **The Movie Database (TMDb) API**, ensuring up‑to‑date information.

## Folder Structure
MovieVault/
│
├── index.html (Home page + login)
├── genres.html (Browse movies by genre)
├── favorites.html (User's saved favorite movies)
├── contact.html (Team portfolio page)
├── about.html (About the project)
│
├── shared.css (Global styles)
├── shared.js (Shared authentication, API, favorites logic)
│
├── surya.jpg (Banner image – optional)
│
└── README.md


## Features

### User Authentication
- Login with username and password (stored in `localStorage` for demo)
- Two default accounts:
  - **Admin**: `admin` / `admin123`
  - **User**: `user` / `user123`
- Session persistence across all pages
- Logout clears the session and redirects to the login page

### Content Manager (Admin) Features
- Admin‑only “Admin” button appears in the navbar
- Open a modal to toggle the visibility of:
  - 🔥 Trending in India section
  - ⭐ Top Rated Indian Movies section
  - 📅 Upcoming Indian Releases section
- Settings are saved in `localStorage` and persist across sessions
- Home page updates immediately when settings are applied

### Movie Browsing & Discovery
- **Home page**: shows three dynamic sections (Trending, Top Rated, Upcoming) – each can be hidden by the admin
- **Search**: find movies by title (biased toward Indian cinema)
- **Genres page**: browse movies by genre (e.g., Action, Comedy, Drama) – all movies filtered to Indian origin
- **Movie details modal**: displays poster, rating, release date, runtime, and full overview
- **Favorites**: users can add/remove movies to a personal favorites list (stored in `localStorage`)

### Team Portfolio Page
- Static page showcasing the four team members
- Each member has a button linking to their personal portfolio website
- Styled consistently with the rest of the application

### About Page
- Project statistics (10K+ films, 5+ industries, 12+ genres)
- List of key features
- Technology stack used

### Persistent Storage
- `localStorage` is used to store:
  - Registered users (default: admin & user)
  - Current user session
  - User’s favorite movie IDs
  - Admin section visibility settings

## Technologies Used

### Frontend
- **HTML5** – page structure, forms, layouts
- **CSS3** – custom styling, responsive design, animations (with Bootstrap 5)
- **Bootstrap 5** – modal dialogs, layout utilities, icons (Bootstrap Icons)
- **Vanilla JavaScript** – authentication, API calls, DOM manipulation, favorites logic, admin toggles

### External APIs
- **The Movie Database (TMDb) API** – provides movie data (posters, ratings, descriptions, release dates, genres)

### Additional Libraries
- **Google Fonts** – Bebas Neue & DM Sans fonts
- **Bootstrap Icons** – heart, search, and other interface icons

## Important Implementation Highlights

- **No page reloads** – content is dynamically updated via JavaScript functions (`showHome()`, `showGenres()`, etc.)
- **Single shared CSS & JS** – all pages share the same styles and logic, ensuring consistency
- **Conditional admin UI** – the admin button and toggles only appear for users with role `admin`
- **Indian movie bias** – all API requests include `with_origin_country: IN` and `region: IN`
- **Fallback genres** – if the genre API fails, a hardcoded list ensures the genre page still works
- **Responsive movie grid** – uses CSS Grid to adapt to any screen size
- **Static banner image** – a permanent banner below the navbar (you can replace `surya.jpg` with your own image)

## How to Run the Project

1. **Clone or download** all files into a single folder.
2. **Replace the banner image** (optional): place your own `surya.jpg` in the same folder, or change the `src` in every HTML file.
3. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge).
4. **Login** with:
   - Admin: `admin` / `admin123`
   - User: `user` / `user123`
5. **Explore** the platform:
   - Browse movies on the home page
   - Search for movies using the search bar
   - Click on a movie card to see details
   - Add movies to your favorites (Fav page)
   - As admin, click the **Admin** button to hide/show sections

## API Key Note

The project uses a public TMDb API key (`a44d005848365ef66c0f555328109508`).  
If you plan to deploy this project, please replace it with your own key from [TMDb](https://www.themoviedb.org/signup).

## Future Enhancements (Optional)

- Replace `localStorage` with a real backend (Node.js + database) for cross‑device login
- Add user ratings and reviews
- Add movie trailers (YouTube integration)
- Implement infinite scrolling for movie lists
- Add language filters (Hindi, Tamil, Telugu, etc.)

## Credits

- **TMDb** for providing the movie data API.
- **Bootstrap** for the modal and icon components.
- All team members for their contributions.

---

*MovieVault – Discover Indian Cinema, One Movie at a Time.*
