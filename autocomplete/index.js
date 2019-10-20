
const Model = {
	animals: [
		{ name: "Aardvark" },
		{ name: "Bullfrog" },
		{ name: "Camel" }, 
		{ name: "Dingo" },
		{ name: "Emu" },
		{ name: "Flounder" },
		{ name: "Gila Monster" },
		{ name: "Hedgehog" },
		{ name: "Ibex" },
		{ name: "Bandicoot" },
		{ name: "Albatross" },
		{ name: "Chinchilla" },
		{ name: "Gopher" },
		{ name: "Iguana" },
		{ name: "Koala" },
		{ name: "Yak" },
		{ name: "Wombat" },
		{ name: "Vulture" },
		{ name: "Stoat" },
		{ name: "Tapir" },
		{ name: "Panda" },
		{ name: "Red Panda" },
		{ name: "Jellyfish" }
	],
	movies: [
		{ id: 0, meta: { title: "Princess Bride, The" } },
		{ id: 1, meta: { title: "Scarface" } },
		{ id: 2, meta: { title: "On Golden Pond" } },
		{ id: 3, meta: { title: "Henry: Portrait of a Serial Killer" } },
		{ id: 4, meta: { title: "Toy Story" } },
		{ id: 5, meta: { title: "Irreversible" } },
		{ id: 6, meta: { title: "Artist, The" } },
		{ id: 7, meta: { title: "Hills Have Eyes 2, The" } },
		{ id: 8, meta: { title: "Madness of King George, The" } },
		{ id: 9, meta: { title: "Centipede" } }
	],
	currentAnimal: null,
	currentMovie: null,
  selectAnimal: animal => {	Model.currentAnimal = animal },
  selectMovie: movie => {	Model.currentMovie = Model.movies.find(aMovie => aMovie.id === movie.id) },
  movieMapFunc: movie => ({ id: movie.id, name: movie.meta.title })
}

const Box = {
    view: ({ attrs }) =>
        m('.box',
            m('i', attrs.collection.map(a => a.name || a.meta.title).join(', ')),
            m('h3', 'Selected: ' + (Model[attrs.current] ? Model[attrs.current].name || Model[attrs.current].meta.title : 'none')),
            m(Typeahead, {
                collection: attrs.collection,
                onchange: attrs.onchange,
                placeholder: attrs.placeholder,
                mapFunc: attrs.mapFunc,
                maxResults: attrs.maxResults
            })
        )
}

const App = {
    view: () => {
        return m('#app',
            m(Box, {
                collection: Model.animals,
                current: 'currentAnimal',
                onchange: Model.selectAnimal,
                placeholder: 'Search Animals'
            }),
            m(Box, {
                collection: Model.movies,
                current: 'currentMovie',
                onchange: Model.selectMovie,
                mapFunc: Model.movieMapFunc,
                maxResults: '5',
                placeholder: 'Search Movies'
            })
        )
    }
}

export default App 