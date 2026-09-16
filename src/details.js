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
const castMembersElement = document.querySelector(".cast-members")
const movieInfoElement = document.querySelector(".movie-info")
const trailerElement = document.querySelector(".trailer")


const params = new URLSearchParams(window.location.search)
let mediaID = params.get("id")
let mediaType = params.get("type")


import {
    getConfigDetails,
    getMovieTrailers,
    getTVTrailers,
    getMediaDetails,
    getMovieCredits,
    getTVCredits,
    getCastImages
} from "./tmdbAPI.js";

async function render() {
    const data = await getMediaDetails(mediaID, mediaType)
    const config = await getConfigDetails()

    // backdrop image & movie poster
    let baseUrl = config.images.secure_base_url;
    let backdrop = data.backdrop_path;

    if (backdrop) {
        body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65)), url(${baseUrl}original${backdrop})`
    } else {
        body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.65))`
    }

    let poster = data.poster_path

    if (poster) {
        posterElement.src = `${baseUrl}w185${poster}`
    } else {
        const missingPosterElement = document.createElement("div")
        missingPosterElement.classList.add("movie-poster", "missing-poster")
        missingPosterElement.textContent = "No poster available"

        posterElement.replaceWith(missingPosterElement)
    }

    // overview
    let overview = data.overview

    if (overview) {
        overviewElement.textContent = overview
    } else {
        overviewElement.textContent = "No overview available."
    }

    // genres
    let genres = ""

    if (data.genres.length > 0) {
        for (let i = 0; i < data.genres.length; i++) {
            genres += data.genres[i].name + " "
        }

        genresElement.textContent = "Genres: " + genres
    } else {
        genresElement.textContent = "Genres: Not available"
    }

    // ratings
    let voteAverage = data.vote_average;
    let voteCount = data.vote_count;

    if (voteCount > 0) {
        voteAverageElement.textContent = voteAverage;
        voteCountElement.textContent = voteCount;
    } else {
        voteAverageElement.textContent = "Not rated";
        voteCountElement.textContent = "0";
    }

    // cast
    let credits

    if (mediaType === "tv") {
        credits = await getTVCredits(mediaID)
    } else {
        credits = await getMovieCredits(mediaID)
    }

    if (credits.cast.length > 0) {
        for (let i = 0; i < credits.cast.length; i++) {

            if (i === 10) {
                break
            }

            let castName = credits.cast[i].name

            const castMemberElement = document.createElement("div")
            castMemberElement.classList.add("cast-person")

            const castNameElement = document.createElement("p")
            castNameElement.classList.add("cast-name")
            castNameElement.textContent = `${castName}`
            castMemberElement.append(castNameElement)


            let castId = credits.cast[i].id
            let castImages = await getCastImages(castId)

            if (castImages.profiles.length > 0) {

                let castImage = castImages.profiles[0].file_path

                const castImageElement = document.createElement("img")
                castImageElement.setAttribute("alt", "Cast member")
                castImageElement.src = baseUrl + "w92" + castImage
                castMemberElement.append(castImageElement)
            }
            else {
                const missingCastImageElement = document.createElement("div")
                missingCastImageElement.classList.add("missing-cast-photo")
                castMemberElement.append(missingCastImageElement)
            }
            castMembersElement.append(castMemberElement)
        }
    } else {
        const missingCastElement = document.createElement("p")
        missingCastElement.textContent = "No cast information available."
        castMembersElement.append(missingCastElement)
    }

    // tv title, release date, seasons, episodes & trailer
    if (mediaType === "tv") {
        let title = data.original_name
        titleElement.textContent = title

        let releaseDate = data.first_air_date;

        if (releaseDate) {
            releaseDateElement.textContent = releaseDate
        } else {
            releaseDateElement.textContent = "Release date unavailable"
        }

        let seasons = data.number_of_seasons
        let episodes = data.number_of_episodes
        const seasonsElement = document.createElement("p")

        if (seasons != null) {
            seasonsElement.textContent = seasons + " Seasons"
        } else {
            seasonsElement.textContent = "Seasons unavailable"
        }

        if (episodes != null) {
            seasonsElement.textContent += " • " + episodes + " Episodes"
        } else {
            seasonsElement.textContent += " • Episodes unavailable"
        }
        movieInfoElement.append(seasonsElement)

        const trailer = await getTVTrailers(mediaID)
        if (trailer.results.length > 0) {
            trailerElement.src = "https://www.youtube-nocookie.com/embed/" + trailer.results[trailer.results.length - 1].key
        }
    }

    // movie title, release date, runtime & trailer
    if (mediaType === "movie") {
        let title = data.original_title
        titleElement.textContent = title

        let releaseDate = data.release_date;

        if (releaseDate) {
            releaseDateElement.textContent = releaseDate
        } else {
            releaseDateElement.textContent = "Release date unavailable"
        }

        let runtime = data.runtime

        if (runtime > 0) {
            runtimeElement.textContent = runtime + " minutes"
        } else {
            runtimeElement.textContent = "Runtime unavailable"
        }

        const trailer = await getMovieTrailers(mediaID)
        if (trailer.results.length > 0) {
            trailerElement.src = "https://www.youtube-nocookie.com/embed/" + trailer.results[trailer.results.length - 1].key
        }
    }

}

render()