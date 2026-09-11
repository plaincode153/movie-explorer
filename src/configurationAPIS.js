
export async function getConfigDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=1442bd967a8ebd3b37723f20d9f1d1ec`)
    return await response.json()
}