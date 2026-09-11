import "./details.css";

const params = new URLSearchParams(window.location.search)
let movieId = params.get("id")

async function getMovieDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1442bd967a8ebd3b37723f20d9f1d1ec`)
    return await response.json()
}

    import { getConfigDetails } from "./configurationAPIS.js";

async function handleMovie() {
    const movieData = await getMovieDetails()
    const configDetails = await getConfigDetails()
    
    render(movieData, configDetails)

}

const body = document.querySelector("body")

function render(data, config) {
    let baseUrl = config.images.secure_base_url;
    let image = data.backdrop_path;

    console.log(config)

    body.style.backgroundImage = `url(${baseUrl}original${image})`
    
    
}

handleMovie()


