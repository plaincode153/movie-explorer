
export async function getSearchResults(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
}

export async function getConfigDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
}

export async function getMediaDetails(mediaID, mediaType) {
    const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaID}?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
}

export async function getMovieCredits(mediaID) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${mediaID}/credits?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export async function getTVCredits(mediaID) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${mediaID}/credits?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export async function getCastImages(personID) {
    const response = await fetch(`https://api.themoviedb.org/3/person/${personID}/images?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export async function getMovieTrailers(mediaID) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${mediaID}/videos?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export async function getTVTrailers(mediaID) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${mediaID}/videos?api_key=${process.env.WEBPACK_TMDB_API_KEY}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

export async function getTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.WEBPACK_TMDB_API_KEY}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json();
}

export async function getTrendingTV() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.WEBPACK_TMDB_API_KEY}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json();
}