import { showInfo, showError } from '../notification.js';
import { createMovie, getMovies, likeMovie as apiLike, getMovieById, getMovieByOwner, updateMovie, deleteMovie as apiDelete } from '../data.js';


export default async function catalog() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        movie: await this.load('./templates/movie/movie.hbs')
    };

    const search = this.params.search || '';

    const movies = await getMovies(search);

    console.log(search);
    console.log(movies);
    this.app.userData.movies = movies;
    const context = Object.assign({ origin: encodeURIComponent('#/catalog'), search }, this.app.userData);

    this.partial('./templates/movie/catalog.hbs', context);
}



export async function create() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    this.partial('./templates/movie/create.hbs', this.app.userData);
}

export async function createPost() {
    try {
        if (this.params.title.length === 0) {
            throw new Error('Title is required');
        }
        if (this.params.description.length === 0) {
            throw new Error('Description is required');
        }
        if (this.params.imageUrl.length === 0) {
            throw new Error('Image is required');
        }

        const movie = {
            title: this.params.title,
            description: this.params.description,
            imageUrl: this.params.imageUrl,

        };

        const result = await createMovie(movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Movie created');
        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function myMovies() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        movie: await this.load('./templates/movie/movie.hbs'),
        ownMovie: await this.load('./templates/movie/ownMovie.hbs')
    };

    const movies = await getMovieByOwner();
    this.app.userData.movies = movies;

    const context = Object.assign({ myMovies: true, origin: encodeURIComponent('#/my_movies') }, this.app.userData);

    this.partial('./templates/movie/catalog.hbs', context);
}

export async function details() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    const movieId = this.params.id;
    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }

    if (movie.ownerId === this.app.userData.userId) {
        movie.isMine = true;
    }
    const context = Object.assign({ movie, origin: encodeURIComponent('#/details/' + movieId) }, this.app.userData);

    this.partial('./templates/movie/details.hbs', context);
}

export async function edit() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }
    const context = Object.assign({ movie }, this.app.userData);

    this.partial('./templates/movie/edit.hbs', context);
}

export async function editPost() {
    const movieId = this.params.id;

    try {
        if (this.params.title.length === 0) {
            throw new Error('Title is required');
        }
        if (this.params.description.length === 0) {
            throw new Error('Description is required');
        }
        if (this.params.imageUrl.length === 0) {
            throw new Error('Image is required');
        }

        const movie = {
            title: this.params.title,
            description: this.params.description,
            imageUrl: this.params.imageUrl,

        };

        const result = await updateMovie(movieId, movie);


        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        
        this.redirect('#/details/' + result.objectId);

        showInfo('Movie edited');

    } catch (err) {
        console.error(err);
        showError(err.message);
    }


}

export async function likeMovie() {
    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }

    try {
        const result = await apiLike(movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo(`Like ${movie.title}`);

        this.redirect("#/details/" + movieId);
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function deleteMovie() {
    if (confirm('Are you sure you want to delete this movie?') == false) {
        return this.redirect('#/home');
    }

    const movieId = this.params.id;

    try {
        const result = await apiDelete(movieId);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Move deleted');

        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}