document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'qdcJlxrzF1bbRhaJ2SchKpebudmMMfWz5tfI0MGE';
    const form = document.getElementById('date-form');
    const apodContainer = document.getElementById('apod-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const apodTitle = document.getElementById('apod-title');
    const apodDate = document.getElementById('apod-date');
    const apodImage = document.getElementById('apod-image');
    const apodExplanation = document.getElementById('apod-explanation');
    const saveFavoriteButton = document.getElementById('save-favorite');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const date = document.getElementById('date').value;
        await fetchAPOD(date);
    });

    apodImage.addEventListener('click', () => {
        if (apodImage.src) {
            window.open(apodImage.dataset.hdurl, '_blank');
        }
    });

    saveFavoriteButton.addEventListener('click', saveFavorite);

    async function fetchAPOD(date) {
        const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayAPOD(data);
        } catch (error) {
            console.error('Error fetching APOD:', error);
        }
    }

    function displayAPOD(data) {
        if (data.media_type !== 'image') {
            apodContainer.style.display = 'none';
            return;
        }
        apodContainer.style.display = 'block';
        apodTitle.textContent = data.title;
        apodDate.textContent = data.date;
        apodImage.src = data.url;
        apodImage.dataset.hdurl = data.hdurl || data.url;
        apodExplanation.textContent = data.explanation;
    }

    function saveFavorite() {
        const favorite = {
            title: apodTitle.textContent,
            date: apodDate.textContent,
            url: apodImage.src,
            hdurl: apodImage.dataset.hdurl,
            explanation: apodExplanation.textContent
        };
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(favorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }

    function displayFavorites() {
        favoritesContainer.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach((favorite, index) => {
            const favoriteDiv = document.createElement('div');
            favoriteDiv.classList.add('favorite');
            favoriteDiv.innerHTML = `
                <h3>${favorite.title}</h3>
                <p>${favorite.date}</p>
                <img src="${favorite.url}" data-hdurl="${favorite.hdurl}" alt="${favorite.title}">
                <button onclick="removeFavorite(${index})">Remove</button>
            `;
            favoritesContainer.appendChild(favoriteDiv);
        });
    }

    window.removeFavorite = function(index) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }

    displayFavorites();
});
