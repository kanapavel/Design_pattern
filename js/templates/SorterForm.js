class SorterForm {
    constructor(Movies) {
        this.Movies = Movies

        this.$wrapper = document.createElement('div')
        this.$sorterFormWrapper = document.querySelector('.sorter-form-wrapper')
        this.$moviesWrapper = document.querySelector('.movies-wrapper')

        this.ProxyRatingSorter = new ProxyRatingSorter()

        // WishLib Pub/sub
        this.WishlistSubject = new WishlistSubject()
        this.WhishListCounter = new WhishListCounter()
        this.WishlistSubject.subscribe(this.WhishListCounter)
    }

    async sorterMovies(sorter) {
        this.clearMoviesWrapper()

        if (!!sorter) {

            const sortedData = await this.ProxyRatingSorter.sorter(this.Movies, sorter)


            const SortedMovies = sortedData.data 

            SortedMovies.forEach(Movie => {
                const Template = movieCardWithPlayer(
                    new MovieCard(Movie, this.WishlistSubject)
                )
                this.$moviesWrapper.appendChild(Template.createMovieCard())
            })
        } else {
            this.Movies.forEach(Movie => {
                const Template = movieCardWithPlayer(
                    new MovieCard(Movie, this.WishlistSubject)
                )
                this.$moviesWrapper.appendChild(Template.createMovieCard())
            })
        }
    }

    onChangeSorter() {
        this.$wrapper
            .querySelector('form')
            .addEventListener('change', e => {
                const sorter = e.target.value
                this.sorterMovies(sorter)
            })
    }

    clearMoviesWrapper() {
        this.$moviesWrapper.innerHTML = ""
    }

    render() {
        const sorterForm = `
            <form action="#" method="POST" class="sorter-form">
                <label for="sorter-select">Triez par date de sortie : </label>
                <select name="sorter-select" id="sorter-select">
                    <option value="">Aucun tri</option>
                    <option value="ASC">Croissante</option>
                    <option value="DESC">Décroissante</option>
                </select>
            </form>
        `

        this.$wrapper.innerHTML = sorterForm
        this.onChangeSorter()

        this.$sorterFormWrapper.appendChild(this.$wrapper)
    }
}