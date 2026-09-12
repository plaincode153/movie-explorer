import "./index.css";


const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const movieResults = document.querySelector("#movie-results")


// SEARCH

const baseUrl = `https://api.themoviedb.org/3/search/multi`

const params = new URLSearchParams({
    api_key: "1442bd967a8ebd3b37723f20d9f1d1ec",
    query: "",
    include_adult: false,
    language: `en-US`,
    page: 1,
})

function urlUpdater() {
    return `${baseUrl}?${params}`
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault()
    params.set("query", `${searchInput.value}`)
    handleSearch()

})

async function handleSearch() {
    const movieData = await getMovieData()
    const configurationDetails = await getConfigDetails()

    renderMovies(movieData, configurationDetails)
}

async function getMovieData() {
    const response = await fetch(urlUpdater())
    return await response.json()
}

// cofig imports
import { getConfigDetails } from "./tmdbAPI.js";


function renderMovies(data, details) {

    data.results.forEach((array) => {

        if (array.media_type === "person") {
            return;
        }

        let movieContainer = document.createElement("div")
        let movieTitleElement = document.createElement("p");
        let movieImageElement = document.createElement("img")

        // image 
        movieImageElement.src = details.images.secure_base_url + "w185" + array.poster_path

        // id + class
        movieContainer.setAttribute("id", array.id)
        movieContainer.classList.add("movie-container")

        // title + TV/MOVIE class
        if (array.media_type === "tv") {
            movieTitleElement.textContent = array.name;
            movieContainer.classList.add("tv")
        }

        if (array.media_type === "movie") {
            movieTitleElement.textContent = array.title;
            movieContainer.classList.add("movie")
        }

        movieContainer.append(movieTitleElement);
        movieContainer.append(movieImageElement)

        movieResults.append(movieContainer);
    });
    return;
}


// REDIRECTING TO DETAILS.HTML WITH CLICKED MOVIE

movieResults.addEventListener("click", (event) => {
    let movieContainer = event.target.closest(".movie-container")

    if (movieContainer) {

        // seperating media type
        if (movieContainer.classList.contains("tv")) {
            window.location.href = `details.html?id=${movieContainer.id}&type=tv`
        }

        if (movieContainer.classList.contains("movie")) {
            window.location.href = `details.html?id=${movieContainer.id}&type=movie`
        }
    }
})







