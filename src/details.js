import "./index.css";

const params = new URLSearchParams(window.location.search)
let movieId = params.get("id")

async function getMovieDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1442bd967a8ebd3b37723f20d9f1d1ec`)
    return await response.json()
}

async function handleMovie() {
    let movieData = await getMovieDetails()
    render(movieData)

}

function render(movieData) {
    console.log(movieData)
}

handleMovie()


