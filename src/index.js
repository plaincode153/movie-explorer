import "./index.css";
import { getConfigDetails, getTrendingMovies, getTrendingTV, getSearchResults } from "./tmdbAPI.js";

const body = document.querySelector("body")
const searchFormElement = document.querySelector("#search-form")
const searchInputElement = document.querySelector("#search-input")
const movieResultsElement = document.querySelector("#movie-results")
const trendingTVElement = document.querySelector("#trending-tv")
const trendingMoviesElement = document.querySelector("#trending-movies")
const messageElement = document.querySelector("#message")

// SEARCH

const baseUrl = `https://api.themoviedb.org/3/search/multi`

const params = new URLSearchParams({
    api_key: "1442bd967a8ebd3b37723f20d9f1d1ec",
    query: "",
    include_adult: false,
    language: `en-US`,
    page: 1,
})

searchFormElement.addEventListener("submit", function (event) {
    event.preventDefault()
    handleSearch()
})

async function handleSearch() {
    params.set("query", `${searchInputElement.value}`)
    const searchResults = await getSearchResults(`${baseUrl}?${params}`)
    let cardsArray = await getCards(searchResults)
    movieResultsElement.replaceChildren(...cardsArray)

    if (cardsArray.length === 0) {
        messageElement.textContent = "No movies or TV shows found."
    } else {
        messageElement.textContent = ""
    }
}

// GET CARDS ARRAY & RENDER IN EVENT LISTENER

async function getCards(data) {

    const config = await getConfigDetails()
    let cards = []

    data.results.forEach((Each) => {

        if (Each.media_type === "person") {
            return;
        }

        let movieCardElement = document.createElement("div")
        let movieTitleElement = document.createElement("p");
        let movieImageElement = document.createElement("img")

        // image 
        if (Each.poster_path) {
            movieImageElement.src = config.images.secure_base_url + "w185" + Each.poster_path
        }

        // id + class
        movieCardElement.setAttribute("id", Each.id)
        movieCardElement.classList.add("movie-card")

        // title + TV/MOVIE class
        if (Each.media_type === "tv") {
            movieTitleElement.textContent = Each.name;
            movieCardElement.classList.add("tv")
        }

        if (Each.media_type === "movie") {
            movieTitleElement.textContent = Each.title;
            movieCardElement.classList.add("movie")
        }

        movieCardElement.append(movieTitleElement);

        if (Each.poster_path) {
            movieCardElement.append(movieImageElement)
        } else {
            const missingPosterElement = document.createElement("div")
            missingPosterElement.classList.add("missing-poster")
            missingPosterElement.textContent = "No poster available"
            movieCardElement.append(missingPosterElement)
        }

        cards.push(movieCardElement)

        return;
    });
    return cards;
}

// TRENDING

async function trending() {
    let trendingMovies = await getTrendingMovies();
    let trendingTV = await getTrendingTV()

    if (trendingTV.results.length === 0) {
        const messageElement = document.createElement("p")
        messageElement.textContent = "No trending TV shows available."
        trendingTVElement.append(messageElement)
    } else {
        let cardsArrayTV = await getCards(trendingTV)
        trendingTVElement.append(...cardsArrayTV)
    }

    if (trendingMovies.results.length === 0) {
        const messageElement = document.createElement("p")
        messageElement.textContent = "No trending movies available."
        trendingMoviesElement.append(messageElement)
    } else {
        let cardsArrayMovie = await getCards(trendingMovies)
        trendingMoviesElement.append(...cardsArrayMovie)
    }
}

trending()


// REDIRECTING TO DETAILS.HTML WITH CLICKED MOVIE

body.addEventListener("click", (event) => {
    let movieCard = event.target.closest(".movie-card")

    if (movieCard) {

        if (movieCard.classList.contains("tv")) {
            window.location.href = `details.html?id=${movieCard.id}&type=tv`
        }

        if (movieCard.classList.contains("movie")) {
            window.location.href = `details.html?id=${movieCard.id}&type=movie`
        }
    }
})




