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

    // configuration for images and backup for images
    let baseUrl = "https://image.tmdb.org/t/p/"

    try {
        const config = await getConfigDetails()
        baseUrl = config.images.secure_base_url;

    } catch (error) {
        console.error("Error fetching config details:", error)
    }


    try {
        const data = await getMediaDetails(mediaID, mediaType)

        // backdrop image & movie poster
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
        if (data.genres?.length > 0) {
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

        // TV title, release date, seasons, episodes
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
        }

        // MOVIE title, release date, runtime
        if (mediaType === "movie") {

            let title = data.original_title
            if (title) {
                titleElement.textContent = title
            } else {
                titleElement.textContent = "Title unavailable"
            }


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
        }

    } catch (error) {
        console.error("Error fetching details:", error)

        const missingPosterElement = document.createElement("div")
        missingPosterElement.classList.add("movie-poster", "missing-poster")
        missingPosterElement.textContent = "Poster failed to fetch."
        posterElement.replaceWith(missingPosterElement)

        titleElement.textContent = "Title failed to fetch."
        overviewElement.textContent = "Overview failed to fetch."
        releaseDateElement.textContent = "Release date failed to fetch."
        genresElement.textContent = "Genres failed to fetch."
        runtimeElement.textContent = "Runtime failed to fetch."
        voteAverageElement.textContent = "N/A"
        voteCountElement.textContent = "Ratings failed to fetch."
    }

    try {
        // cast information
        let credits

        if (mediaType === "tv") {
            credits = await getTVCredits(mediaID)
        } else {
            credits = await getMovieCredits(mediaID)
        }

        if (credits.cast?.length > 0) {
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

                try {
                    let castImages = await getCastImages(castId)

                    if (castImages.profiles.length > 0) {

                        let castImage = castImages.profiles[0].file_path

                        const castImageElement = document.createElement("img")
                        castImageElement.setAttribute("alt", "Cast member")
                        castImageElement.src = baseUrl + "w92" + castImage
                        castMemberElement.append(castImageElement)
                    } else {
                        const missingCastImageElement = document.createElement("div")
                        missingCastImageElement.classList.add("missing-cast-photo")
                        castMemberElement.append(missingCastImageElement)

                    }
                } catch (error) {
                    console.error("Failed to fetch cast images for cast ID:", castId, error)
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
    } catch (error) {
        console.error("Failed to fetch cast information:", error)
        castMembersElement.textContent = "Failed to fetch cast information."
    }

    try {
        let trailer;

        if (mediaType === "tv") {
            trailer = await getTVTrailers(mediaID)
        }

        if (mediaType === "movie") {
            trailer = await getMovieTrailers(mediaID)
        }

        if (trailer.results?.length > 0) {

            let trailerKey = trailer.results[trailer.results.length - 1].key

            for (let i = 0; i < trailer.results.length; i++) {
                if (
                    trailer.results[i].type === "Trailer" &&
                    trailer.results[i].site === "YouTube" &&
                    trailer.results[i].official === true
                ) {
                    trailerKey = trailer.results[i].key
                    break;
                }
            }
            trailerElement.src = "https://www.youtube-nocookie.com/embed/" + trailerKey
        } else {
            const missingTrailerElement = document.createElement("p")
            missingTrailerElement.classList.add("missing-trailer")
            missingTrailerElement.textContent = "No trailer available."
            trailerElement.replaceWith(missingTrailerElement)
        }
    } catch (error) {
        console.error("Error fetching trailers:", error)
        const missingTrailerElement = document.createElement("p")
        missingTrailerElement.classList.add("missing-trailer")
        missingTrailerElement.textContent = "Trailer failed to fetch."
        trailerElement.replaceWith(missingTrailerElement)
    }
}



render()
