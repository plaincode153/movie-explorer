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
    try {
        const searchResults = await getSearchResults(`${baseUrl}?${params}`)
        let cardsArray = await getCards(searchResults)
        mediaResultsElement.replaceChildren(...cardsArray)

        if (cardsArray.length === 0) {
            messageElement.textContent = "No movies or TV shows found."
        } else {
            messageElement.textContent = ""
        }

    } catch (error) {
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

        let mediaCardElement = document.createElement("div")

        // id + class
        mediaCardElement.setAttribute("id", Each.id)
        mediaCardElement.classList.add("media-card")

        // title + TV/MOVIE class
        if (Each.media_type === "tv") {
            if (Each.name) {
                let mediaTitleElement = document.createElement("h3")
                mediaTitleElement.textContent = Each.name;
                mediaCardElement.append(mediaTitleElement)
            }
            mediaCardElement.classList.add("tv")
        }

        if (Each.media_type === "movie") {
            if (Each.title) {
                let mediaTitleElement = document.createElement("h3")
                mediaTitleElement.textContent = Each.title;
                mediaCardElement.append(mediaTitleElement)
            }
            mediaCardElement.classList.add("movie")
        }

        // poster
        if (Each.poster_path) {
            let mediaImageElement = document.createElement("img")
            mediaImageElement.classList.add("media-poster")
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

async function trending() {
    try {
        let trendingTV = await getTrendingTV()

        if (trendingTV.results.length === 0) {
            const messageElement = document.createElement("p")
            messageElement.textContent = "No trending TV shows available."
            trendingTVElement.append(messageElement)
        } else {
            let cardsArrayTV = await getCards(trendingTV)
            trendingTVElement.append(...cardsArrayTV)
        }
    } catch (error) {
        console.error("Error fetching trending TV data:", error)
        const trendingMessageElement = document.createElement("p")
        trendingMessageElement.textContent = "An error occurred while fetching trending TV shows."
        trendingTVElement.append(trendingMessageElement)
    }

    try {
        let trendingMovies = await getTrendingMovies();

        if (trendingMovies.results.length === 0) {
            const messageElement = document.createElement("p")
            messageElement.textContent = "No trending movies available."
            trendingMoviesElement.append(messageElement)
        } else {
            let cardsArrayMovie = await getCards(trendingMovies)
            trendingMoviesElement.append(...cardsArrayMovie)
        }
    } catch (error) {
        console.error("Error fetching trending movies data:", error)
        const trendingMessageElement = document.createElement("p")
        trendingMessageElement.textContent = "An error occurred while fetching trending movies."
        trendingMoviesElement.append(trendingMessageElement)
    }
}

trending()


// REDIRECTING TO DETAILS.HTML WITH CLICKED MOVIE

body.addEventListener("click", (event) => {
    let mediaCard = event.target.closest(".media-card")

    if (mediaCard) {

        if (mediaCard.classList.contains("tv")) {
            window.location.href = `details.html?id=${mediaCard.id}&type=tv`
        }

        if (mediaCard.classList.contains("movie")) {
            window.location.href = `details.html?id=${mediaCard.id}&type=movie`
        }
    }
})




