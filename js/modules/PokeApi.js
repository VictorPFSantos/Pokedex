export function getAllPokemons() {
    return fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100000')
        .then(response => response.json())
}

export function getPokemonDetails(pokemonURL) {
    return fetch(pokemonURL)
        .then(response => response.json())
}

export function getSpeciesDetails(speciesURL) {
    return fetch(speciesURL)
        .then(response => response.json())
}