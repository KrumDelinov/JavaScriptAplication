import {getMovies} from '../data.js'

export default async function home() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        movie: await this.load('./templates/movie/movie.hbs')
    };

    const search = this.params.search || '';

    const movies = await getMovies(search);
    this.app.userData.movies = movies;
    const context = Object.assign({ origin: encodeURIComponent('#/catalog'), search }, this.app.userData);

    //this.partial('./templates/movie/catalog.hbs', context);

    this.partial('./templates/home.hbs', context);
}