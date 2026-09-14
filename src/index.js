import "./index.css";
import { getConfigDetails, getTrendingMovies, getTrendingTV, getSearchResults } from "./tmdbAPI.js";

const body = document.querySelector("body")
const searchFormElement = document.querySelector("#search-form")
const searchInputElement = document.querySelector("#search-input")
const movieResultsElement = document.querySelector("#movie-results")
const trendingTVElement = document.querySelector("#trending-tv")
const trendingMoviesElement = document.querySelector("#trending-movies")

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
    params.set("query", `${searchInputElement.value}`)
    handleSearch()
})

async function handleSearch() {
    const searchResults = await getSearchResults(`${baseUrl}?${params}`)
    let cardsArray = await getCards(searchResults)
    movieResultsElement.append(...cardsArray)
}

// GET CARDS ARRAY & RENDER IN EVENT LISTENER

async function getCards(data) {

    const config = await getConfigDetails()
    let cards = []

    data.results.forEach((array) => {

        if (array.media_type === "person") {
            return;
        }

        let movieCardElement = document.createElement("div")
        let movieTitleElement = document.createElement("p");
        let movieImageElement = document.createElement("img")

        // image 
        movieImageElement.src = config.images.secure_base_url + "w185" + array.poster_path

        // id + class
        movieCardElement.setAttribute("id", array.id)
        movieCardElement.classList.add("movie-card")

        // title + TV/MOVIE class
        if (array.media_type === "tv") {
            movieTitleElement.textContent = array.name;
            movieCardElement.classList.add("tv")
        }

        if (array.media_type === "movie") {
            movieTitleElement.textContent = array.title;
            movieCardElement.classList.add("movie")
        }

        movieCardElement.append(movieTitleElement);
        movieCardElement.append(movieImageElement)

        cards.push(movieCardElement)

        return;
    });
    return cards;
}

// TRENDING

async function trending() {
    let trendingMovies = await getTrendingMovies();
    let trendingTV = await getTrendingTV()

    let cardsArrayTV = await getCards(trendingTV)
    trendingTVElement.append(...cardsArrayTV)

    let cardsArrayMovie = await getCards(trendingMovies)
    trendingMoviesElement.append(...cardsArrayMovie)
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







