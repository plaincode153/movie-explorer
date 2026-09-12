import "./details.css";

const body = document.querySelector("body")


const params = new URLSearchParams(window.location.search)
let movieId = params.get("id")
let mediaType = params.get("type")


    import { getConfigDetails } from "./tmdbAPI.js";
    import { getMediaDetails } from "./tmdbAPI.js";

async function handleMovie() {
    const mediaData = await getMediaDetails(movieId, mediaType)
    const configDetails = await getConfigDetails()
    
    render(mediaData, configDetails)
}

function render(data, config) {
    let baseUrl = config.images.secure_base_url;
    let image = data.backdrop_path;
    console.log(baseUrl);

    body.style.backgroundImage = `url(${baseUrl}original${image})`
}

handleMovie()


