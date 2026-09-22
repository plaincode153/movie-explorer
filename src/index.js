import "./index.css";
import { getConfigDetails, getTrendingMovies, getTrendingTV, getSearchResults } from "./tmdbAPI.js";

const body = document.querySelector("body")
const searchFormElement = document.querySelector("#search-form")
const searchInputElement = document.querySelector("#search-input")
const mediaResultsElement = document.querySelector("#media-results")
const trendingTVElement = document.querySelector("#trending-tv")
const trendingMoviesElement = document.querySelector("#trending-movies")
const messageElement = document.querySelector("#message")

// SEARCH

let searchId = 0; // track the latest search ID

const baseUrl = `https://api.themoviedb.org/3/search/multi`

const params = new URLSearchParams({
    api_key: process.env.WEBPACK_TMDB_API_KEY,
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

    searchId++
    const currentSearchId = searchId

    params.set("query", `${searchInputElement.value}`)
    try {
        messageElement.textContent = "loading search..."
        const searchResults = await getSearchResults(`${baseUrl}?${params}`)
        let cardsArray = await getCards(searchResults)
        messageElement.textContent = ""

        if (currentSearchId !== searchId) {
            return
        }


        if (cardsArray.length === 0) {
            messageElement.textContent = "No movies or TV shows found."
        } else {
            messageElement.textContent = ""
        }

        mediaResultsElement.replaceChildren(...cardsArray)


    } catch (error) {

        if (currentSearchId !== searchId) {
            return
        }
        console.error("Error fetching search results:", error)
        messageElement.textContent = "An error occurred while fetching search results."
    }
}

// GET CARDS ARRAY & RENDER IN EVENT LISTENER

async function getCards(data) {

    // configuration for images and backup for images
    let baseUrl = "https://image.tmdb.org/t/p/"

    try {
        const config = await getConfigDetails()
        baseUrl = config.images.secure_base_url;

    } catch (error) {
        console.error("Error fetching config details:", error)
    }

    let cards = []

    data.results.forEach((Each) => {

        if (Each.media_type === "person") {
            return;
        }

        let mediaCardElement = document.createElement("a")
        mediaCardElement.href = `details.html?id=${Each.id}&type=${Each.media_type}`
        mediaCardElement.classList.add("media-card")


        // title
        let mediaName;

        if (Each.media_type === "tv") {
            if (Each.name) {
                mediaName = Each.name
                let mediaTitleElement = document.createElement("h3")
                mediaTitleElement.textContent = mediaName;
                mediaCardElement.append(mediaTitleElement)
            }
        }

        if (Each.media_type === "movie") {
            if (Each.title) {
                mediaName = Each.title
                let mediaTitleElement = document.createElement("h3")
                mediaTitleElement.textContent = mediaName;
                mediaCardElement.append(mediaTitleElement)
            }
        }

        // poster
        if (Each.poster_path) {
            let mediaImageElement = document.createElement("img")
            mediaImageElement.classList.add("media-poster")
            mediaImageElement.alt = ""
            mediaImageElement.src = baseUrl + "w185" + Each.poster_path

            mediaCardElement.append(mediaImageElement)
        } else {
            const missingPosterElement = document.createElement("div")
            missingPosterElement.classList.add("missing-poster")
            missingPosterElement.textContent = "No poster available"
            mediaCardElement.append(missingPosterElement)
        }

        cards.push(mediaCardElement)

        return;
    });
    return cards;
}

// TRENDING

async function trendingTV() {
    try {
        trendingTVElement.textContent = "loading trending shows..."
        let trendingTV = await getTrendingTV()

        if (trendingTV.results.length === 0) {
            trendingTVElement.textContent = "No trending TV shows available."
        } else {
            let cardsArrayTV = await getCards(trendingTV)
            trendingTVElement.textContent = ""
            trendingTVElement.append(...cardsArrayTV)
        }
    } catch (error) {
        console.error("Error fetching trending TV data:", error)
        trendingTVElement.textContent = "An error occurred while fetching trending TV shows."
    }
}

async function trendingMovies() {

    try {
        trendingMoviesElement.textContent = "loading trending shows..."
        let trendingMovies = await getTrendingMovies();

        if (trendingMovies.results.length === 0) {
            trendingMoviesElement.textContent = "No trending movies available."
        } else {
            let cardsArrayMovie = await getCards(trendingMovies)
            trendingMoviesElement.textContent = ""
            trendingMoviesElement.append(...cardsArrayMovie)
        }
    } catch (error) {
        console.error("Error fetching trending movies data:", error)
        trendingMoviesElement.textContent = "An error occurred while fetching trending movies."
    }
}

async function renderTrending() {
    Promise.allSettled([
        trendingMovies(),
        trendingTV()
    ])
}

renderTrending()




