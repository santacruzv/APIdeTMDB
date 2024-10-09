const apiKey = '9e30d523e1b5657cea579bbbb102839d'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(apiUrl + '/movie/popular?api_key=' + apiKey + '&language=es-ES');

        if (!response.ok) {
            throw new Error('No se pudo obtener las películas populares.');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    if (movies.length === 0) {
        const message = document.createElement('li');
        message.textContent = 'No se encontraron películas.';
        movieList.appendChild(message);
        return;
    }
    movies.forEach(movie => {
        const li = document.createElement('li');
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : 'ruta/a/imagen/predeterminada.jpg';

        li.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra los detalles al hacer clic en la pelí
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    selectedMovieId = movieId; // Guarda el ID de la película que se selecciono
    try {
        const response = await fetch(apiUrl + '/movie/' + movieId + '?api_key=' + apiKey + '&language=es-ES');
        if (!response.ok) {
            throw new Error('No se pudo obtener los detalles de la película que quiere.');
        }
        const movie = await response.json();
        detailsContainer.innerHTML = 
        '<h3>' + movie.title + '</h3>' +
        '<img src="https://image.tmdb.org/t/p/w500' + movie.poster_path + '" alt="' + movie.title + '" class="movie-detail-poster">' +
        '<p>' + movie.overview + '</p>' +
        '<p><strong>Rating:</strong> ' + movie.vote_average + '</p>' +
        '<p><strong>Fecha de lanzamiento:</strong> ' + movie.release_date + '</p>' +
        '<p><strong>Duración:</strong> ' + movie.runtime + ' minutos</p>';
    
        
        // Muestra el botón para agregar a los favoritos
        addToFavoritesButton.style.display = 'block'; 
        
        // se asegura de que la sección de detalles se nos muestre
        document.getElementById('movie-details').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(apiUrl + '/search/movie?api_key=' + apiKey + '&language=es-ES&query=' + encodeURIComponent(query));

            if (!response.ok) {
                throw new Error('No se pudo realizar la búsqueda.');
            }
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // gurdara las pelis favoritas
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;

        //  botón para eliminar de los favotirtos
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => removeFavorite(movie.id);

        li.appendChild(deleteButton);
        favoritesList.appendChild(li);
    });
}

// Remove movie from favorites
function removeFavorite(movieId) {
    favoriteMovies = favoriteMovies.filter(movie => movie.id !== movieId); // Filtra las película
    localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Actualiza
    displayFavorites(); // Muestra la lista actualizada de favoritos
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
