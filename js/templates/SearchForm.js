class SearchForm {
    constructor(Movies) {
        this.Movies = Movies
        this.isSearchingByActor = false

        this.MovieNameSearch = new MovieNameSearch(Movies)
        this.ActorNameSearch = new ActorNameSearch(Movies)

        this.$wrapper = document.createElement('div')
        this.$searchFormWrapper = document.querySelector('.search-form-wrapper')
        this.$moviesWrapper = document.querySelector('.movies-wrapper')

        // WishLib Pub/sub
        this.WishlistSubject = new WishlistSubject()
        this.WhishListCounter = new WhishListCounter()
        this.WishlistSubject.subscribe(this.WhishListCounter)
    }

    

    search(query) {

        let SearchedMovies = null
        
        if (this.isSearchingByActor) {
            SearchedMovies = this.ActorNameSearch.search(query)
        }else{
            SearchedMovies = this.MovieNameSearch.search(query)
        }

        if (SearchedMovies && SearchedMovies.length > 0) {
            this.displayMovies(SearchedMovies)
        } else {
            this.displayNoResultsMessage()
        }
        
    }

    clearMoviesWrapper() {
        this.$moviesWrapper.innerHTML = ""
    }

    displayMovies(Movies) {
        this.clearMoviesWrapper()

        Movies.forEach(Movie => {
            const Template = movieCardWithPlayer(
                new MovieCard(Movie, this.WishlistSubject)
            )
            this.$moviesWrapper.appendChild(Template.createMovieCard())
        })
    }

    displayNoResultsMessage() {
        this.clearMoviesWrapper()

        const message = document.createElement('p')
        message.textContent = "Aucun film trouvé."
        this.$moviesWrapper.appendChild(message)
    }

    onSearch() {
        this.$wrapper
            .querySelector('form')
            .addEventListener('keyup', e => {
                const query = e.target.value

                if (query.length >= 3) {
                    this.search(query)
                } else if (query.length === 0) {
                    this.displayMovies(this.Movies)
                }
            })
    }

    onChangeSearch() {
        this.$wrapper
            .querySelector('.search-checkbox')
            .addEventListener('change', e => {
                this.isSearchingByActor = e.target.checked
            })
    }

    render() {
        const searchForm = `
            <form action="#" method="POST">
                <div class="search-input">
                    <label for="search">Rechercher : </label> 
                    <input id="search" type="text">
                </div>
                <div class="search-checkbox">
                    <label for="actor">Rechercher par acteur</label>
                    <input id="actor" type="checkbox" />
                    <span class="info-bull">Entrer le nom de l'acteur pour voir ces films</span>
                </div>
            </form>
        `

        this.$wrapper.innerHTML = searchForm

        this.onSearch()
        this.onChangeSearch()

        this.$searchFormWrapper.appendChild(this.$wrapper)
    }
}