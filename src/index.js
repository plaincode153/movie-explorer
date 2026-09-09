import "./styles.css";

// Search

const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const movieResults = document.querySelector("#movie-results")

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

    fetch(urlUpdater())
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            renderMovieResults(data)
            return data;
        })
        
})

function renderMovieResults(data) {

    data.results.forEach((array) => {

        if (array.media_type === "person") {
            return;
        }

        let movieTitleElement = document.createElement("p")

        if (array.media_type === "tv") {
            movieTitleElement.textContent = array.name
        }
        if (array.media_type === "movie") {
            movieTitleElement.textContent = array.title
        }

        movieResults.append(movieTitleElement)
    })

    return 

}





