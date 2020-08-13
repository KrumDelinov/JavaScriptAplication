import { beginRequest, endRequest } from './notification.js';
import API from './api.js';

const endpoints = {
    MOVIES: 'data/movies',
    MOVIE_BY_ID: 'data/movies/'
};

const api = new API(
    'DA252214-8B4D-C81C-FF5B-32DC88FA6600',
    '31AD463A-F965-4911-A466-E945BFAB101B',
    beginRequest,
    endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);



export async function getMovies(search) {


    if (!search) {

        return api.get(endpoints.MOVIES);
    } else {
        return api.get(endpoints.MOVIES + `?where=${escape(`title LIKE '%${search}%'`)}`);
    }

}


export async function getMovieById(id) {

    return api.get(endpoints.MOVIE_BY_ID + id);
 
}

export async function getMovieByOwner() {
    
    const ownerId = localStorage.getItem('userId');

    return api.get(endpoints.MOVIES + `?where=ownerId%3D%27${ownerId}%27`);

}


export async function createMovie(movie) {

    return api.post(endpoints.MOVIES, movie);
}


export async function updateMovie(id, updatedProps) {

    return api.put(endpoints.MOVIE_BY_ID + id, updatedProps);
  
}


export async function deleteMovie(id) {

    return api.delete(endpoints.MOVIE_BY_ID + id);
 
}


export async function likeMovie(movie) {
    const newLike = movie.likes + 1;
    const movieId = movie.objectId;

    return updateMovie(movieId, { likes: newLike });
}