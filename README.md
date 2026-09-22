# Movie Explorer

A movie and TV search app built with vanilla JavaScript, HTML, CSS, and Webpack. It uses the TMDB API to show trending titles, search results, and detailed information about individual movies and shows.

I built this project to practise working with APIs and strengthen my JavaScript fundamentals. My focus was on turning API responses into a usable interface, handling missing data and failed requests, and understanding how asynchronous code affects what appears on the page.

## Features

- Search for movies and TV shows.
- Browse separate trending movie and TV sections.
- Open a details page with an overview, genres, release date, ratings, and cast.
- Display runtime for movies and season and episode counts for TV shows.
- Watch an official YouTube trailer when one is available.
- Show loading messages, empty results, and fallbacks for unavailable information.
- Browse horizontally scrolling trending cards on desktop and mobile.

## What I learned

### Fetching and using API data

I practised using `fetch`, `async`/`await`, and JSON responses to retrieve data from multiple API endpoints. I learned to check `response.ok` because an HTTP error response does not automatically cause `fetch` to reject.

### Handling missing data and failed requests

I learned the difference between a successful request that returns no useful data and a request that fails. I use conditional checks for missing posters, empty cast lists, and unavailable trailers, and `try`/`catch` for request failures.

### Working with asynchronous code

The details, cast, and trailer sections load independently, so a failure in one section does not stop the others from rendering. I also practised tracking search requests with an ID so an older response cannot replace the results of a newer search.

### Building the interface with JavaScript

I used `createElement`, `textContent`, `append`, and `replaceChildren` to build cards and update the page. I also used `URLSearchParams` to build search queries and pass a title's ID and media type to the details page.

### Organising the project

I separated API request functions from page rendering with JavaScript modules. I configured Webpack with separate entry points and HTML templates for the home and details pages, along with loaders for CSS. I also set up separate development and production configurations and used an environment variable for the TMDB API key.

### Responsive design and accessibility

I practised CSS Grid, Flexbox, and media queries, including how a flex container's direction affects card sizing. I also worked on labelled form controls, native links, visible keyboard focus, image alternative text, and live announcements for search messages.

## Built with

- JavaScript (ES modules)
- HTML and CSS
- Webpack and webpack-dev-server
- TMDB API
- YouTube embeds

## Run locally

Install Node.js and npm, then run these commands from the project folder:

```bash
npm install
```

Copy `.env.example` to `.env` in the project root and replace the placeholder with your own TMDB API key:

```env
WEBPACK_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
```

Start the development server:

```bash
npm start
```

Open the local address printed in the terminal, normally `http://localhost:8080`.

The app requires an internet connection to load TMDB data, images, and YouTube trailers. Restart the development server after changing `.env`.

This is a frontend-only portfolio project. `.env` is ignored by Git, but Webpack includes the API key in the browser bundle, so it is visible to visitors.

## Build

```bash
npm run build
```

Webpack uses `webpack.prod.js` to generate a minified production build in `dist/`. The API key must be configured before building; rebuild after changing it.

To test the production build locally:

```bash
npx http-server dist
```

Open the URL printed in the terminal. Use `http-server` for this preview so the `details.html?id=...&type=...` links retain their query parameters.

Publish the contents of `dist/` to a static hosting service.

## Project structure

```text
src/
  index.html       Home page and search form
  index.css        Home page and card styles
  index.js         Search, trending sections, and card rendering
  details.html     Details page structure
  details.css      Details page styles
  details.js       Details, cast, and trailer rendering
  tmdbAPI.js       API request functions
webpack.dev.js     Development build and server configuration
webpack.prod.js    Production build configuration
.env.example       Template for the local API key configuration
```

## Next steps

- Improve image loading fallbacks for cases where an image path exists but the image fails to load.
- Reduce repeated API configuration requests and improve loading performance.
- Add additional filtering or sorting options for search results.
- Continue improving accessibility and responsive design.

## Credits

Movie and TV data and images are provided by [TMDB](https://www.themoviedb.org/). Trailers are embedded from YouTube.

This product uses the TMDB API but is not endorsed or certified by TMDB.
