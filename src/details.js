import "./details.css";

const body = document.querySelector("body")
const posterElement = document.querySelector(".movie-poster")
const titleElement = document.querySelector(".movie-title")
const overviewElement = document.querySelector(".overview")
const releaseDateElement = document.querySelector(".release-date")
const genresElement = document.querySelector(".genres")
const runtimeElement = document.querySelector(".runtime")
const voteAverageElement = document.querySelector(".vote-average")
const voteCountElement = document.querySelector(".vote-count")
const castMemberElement = document.querySelector(".cast-member")
const movieInfoElement = document.querySelector(".movie-info")


const params = new URLSearchParams(window.location.search)
let mediaID = params.get("id")
let mediaType = params.get("type")


import { getConfigDetails, getMovieTrailers, getTVTrailers, getMediaDetails, getCredits, getCastImages} from "./tmdbAPI.js";

async function render() {
    const data = await getMediaDetails(mediaID, mediaType)
    const credits = await getCredits(mediaID)
    const config = await getConfigDetails()
    console.log(config)

    // backdrop image & movie poster
    let baseUrl = config.images.secure_base_url;
    let backdrop = data.backdrop_path;
    body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url(${baseUrl}original${backdrop})`

    let poster = data.poster_path
    posterElement.src = `${baseUrl}w185${poster})`

    // overview
    let overview = data.overview
    overviewElement.textContent = overview

    // genres
    let genres = ""
    for (let i = 0; i < data.genres.length; i++) {
        genres += data.genres[i].name + " "
    }
    genresElement.textContent = "Genres: " + genres

    // ratings
    let voteAverage = data.vote_average;
    let voteCount = data.vote_count;
    voteAverageElement.textContent = voteAverage;
    voteCountElement.textContent = voteCount

    // cast
    for (let i = 0; i < 10; i++) {

        let castName = credits.cast[i].name

        const castNameElement = document.createElement("p")
        castNameElement.classList.add("cast-name")
        castNameElement.textContent = `${castName}`


        let castId = credits.cast[i].id
        let castImages = await getCastImages(castId)
        let castImage = castImages.profiles[0].file_path

        const castImageElement = document.createElement("img")
        castImageElement.classList.add("cast-photo")
        castImageElement.setAttribute("alt", "Cast member")
        castImageElement.src = baseUrl + "w92" + castImage

        castMemberElement.append(castImageElement)
        castMemberElement.append(castNameElement)
    }

    if (mediaType === "tv") {
        let title = data.original_name
        titleElement.textContent = title

        let releaseDate = data.first_air_date;
        releaseDateElement.textContent = releaseDate

        let seasons = data.number_of_seasons
        let episodes = data.number_of_episodes
        const seasonsElement = document.createElement("p")
        seasonsElement.textContent = seasons + " Seasons • " + episodes + " Episodess"
        movieInfoElement.append(seasonsElement)

        const trailer = getTVTrailers(mediaID)

    }

    if (mediaType === "movie") {
        let title = data.original_title
        titleElement.textContent = title

        let releaseDate = data.release_date;
        releaseDateElement.textContent = releaseDate

        let runtime = data.runtime
        runtimeElement.textContent = runtime + " minutes"

        const trailer = await getMovieTrailers(mediaID)
        console.log(trailer)

    }




}

render()


