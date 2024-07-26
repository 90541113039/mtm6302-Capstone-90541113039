// Elements
const pokemonContainer = document.getElementById('pokemon-container');
const loadMoreButton = document.getElementById('load-more');
const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
let offset = 0;
const limit = 20;

// Initial load of Pokémon on page load
document.addEventListener('DOMContentLoaded', loadPokemon);

// Load more Pokémon when the button is clicked
loadMoreButton.addEventListener('click', loadPokemon);

// Fetch Pokémon data from the API
async function loadPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        displayPokemon(data.results);
        offset += limit;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

// Display Pokémon in the container
function displayPokemon(pokemonList) {
    pokemonList.forEach(async (pokemon) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            const card = createPokemonCard(data);
            pokemonContainer.appendChild(card);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    });
}

// Create a Pokémon card element
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <button class="details-btn" data-url="${pokemon.url}">Details</button>
        <button class="catch-btn" data-id="${pokemon.id}">
            ${caughtPokemon.includes(pokemon.id) ? 'Release' : 'Catch'}
        </button>
    `;

    // Event listeners for buttons
    card.querySelector('.details-btn').addEventListener('click', showDetails);
    card.querySelector('.catch-btn').addEventListener('click', toggleCatch);

    return card;
}

// Show Pokémon details in an alert
async function showDetails(event) {
    const url = event.target.dataset.url;
    try {
        const response = await fetch(url);
        const data = await response.json();
        alert(`Name: ${data.name}\nHeight: ${data.height}\nWeight: ${data.weight}`);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

// Toggle Pokémon caught status and update local storage
function toggleCatch(event) {
    const id = parseInt(event.target.dataset.id, 10);
    const index = caughtPokemon.indexOf(id);

    if (index === -1) {
        caughtPokemon.push(id);
        event.target.textContent = 'Release';
        event.target.style.backgroundColor = '#b28d8d'; // Soft pastel pink for caught
    } else {
        caughtPokemon.splice(index, 1);
        event.target.textContent = 'Catch';
        event.target.style.backgroundColor = '#d4a5a5'; // Revert to initial soft pastel pink
    }

    localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
}

// Initial load of Pokémon and style for "caught" status
function initialize() {
    document.querySelectorAll('.catch-btn').forEach(button => {
        const id = parseInt(button.dataset.id, 10);
        if (caughtPokemon.includes(id)) {
            button.textContent = 'Release';
            button.style.backgroundColor = '#b28d8d'; // Soft pastel pink for caught
        }
    });
}
