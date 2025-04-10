// Import necessary React hooks and dependencies
import { useState, useEffect } from 'react' // React hooks for state and side-effects
import { useDebounce } from 'react-use' // Utility hook for debouncing
import './index.css' // Import main CSS styles
import Search from './components/Search' // Search component for user input
import Spinner from './components/Spinner' // Spinner component for loading state
import MovieCard from './components/MovieCard' // MovieCard component to display individual movies
import { getTrendingMovies, updateSearchCount } from '../appwrite' // Custom functions for interacting with Appwrite backend
import MovieDetails from './components/MovieDetails'

// Base API URL for The Movie Database (TMDb)
const BASE_URL = `https://api.themoviedb.org/3`

// API key for authentication (stored in environment variables for security)
const API_KEY = import.meta.env.VITE_TMDB_API_Key

// Common API request options
const API_OPTIONS = {
	method: 'GET',
	headers: {
		accept: 'application/json', // Specify JSON response format
		authorization: `Bearer ${API_KEY}`, // API authorization using Bearer token
	},
}

// Main App component
const App = () => {
	// Define state variables
	const [searchTerm, setSearchTerm] = useState('') // User search input
	const [movieList, setMovieList] = useState([]) // List of movies based on search
	const [trendingMovies, setTrendingMovies] = useState([]) // List of trending movies
	const [selectedMovie, setSelectedMovie] = useState(null)
	const [isLoading, setIsLoading] = useState(false) // Loading state for API requests
	const [errorMessage, setErrorMessage] = useState('') // Error message for failed requests
	const [debounceSearchTerm, setDebounceSearchTerm] = useState('') // Debounced search term for API efficiency

	// Debounce the search term to reduce API requests (500ms delay)
	useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

	/**
	 * Fetches movies from the TMDb API.
	 * If a query is provided, it searches for movies; otherwise, it fetches popular movies.
	 */
	const fetchMovies = async (query = '') => {
		setIsLoading(true)
		setErrorMessage('')
		try {
			// Construct API endpoint based on query
			const endpoint = query
				? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${BASE_URL}/discover/movie?sort_by=popularity.desc`

			// Fetch data from the API
			const response = await fetch(endpoint, API_OPTIONS)

			// Handle non-successful responses
			if (!response.ok) {
				throw new Error('Failed to fetch movies')
			}

			const data = await response.json() // Parse JSON response
			if (data.Response === 'False') {
				setErrorMessage(data.Error || 'Failed to fetch movies')
				setMovieList([])
				return
			}

			// Update state with movie results
			setMovieList(data.results || [])

			// Optionally update search count in the backend if movies are found
			if (query && data.results.length > 0) {
				await updateSearchCount(query, data.results[0])
			}
		} catch (error) {
			console.log(`Error fetching movies: ${error}`)
			setErrorMessage('Error fetching movies, please try again')
		} finally {
			setIsLoading(false) // Reset loading state
		}
	}

	/**
	 * Fetches trending movies from the backend.
	 * This leverages the Appwrite function to retrieve trending data.
	 */
	const loadTrendingMovies = async () => {
		try {
			const movies = await getTrendingMovies()
			setTrendingMovies(movies)
		} catch (error) {
			console.log(`Error fetching trending movies`, error)
		}
	}

	// Fetch movies whenever the debounced search term changes
	useEffect(() => {
		fetchMovies(debounceSearchTerm)
	}, [debounceSearchTerm])

	// Load trending movies on initial component mount
	useEffect(() => {
		loadTrendingMovies()
	}, [])

	return (
		<main className="relative min-h-screen bg-primary overflow-hidden">
			{/* Background pattern */}
			<div className="pattern" />
			<div className="wrapper">
				{/* Header section */}
				<header className="mt-10">
					<img src="./hero.png" alt="Hero Banner" />
					<h1>
						Find <span className="text-gradient">Movies</span> you&apos;ll Enjoy
						Without the Hassle
					</h1>
					{/* Search bar */}
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>

				{/* Trending movies section */}
				{trendingMovies.length > 0 && (
					<section className="trending">
						<h2>Trending Movies</h2>
						<ul>
							{trendingMovies.map((movie, index) => (
								<li key={movie.$id}>
									<p>{index + 1}</p>
									<img src={movie.poster_url} alt={movie.title} />
								</li>
							))}
						</ul>
					</section>
				)}

				{/* All movies section */}
				<section className="all-movies">
					<h2>All Movies</h2>
					{isLoading ? (
						<Spinner /> // Show spinner during loading
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p> // Display error message
					) : (
						<ul>
							{movieList.map(movie => (
								<MovieCard
									key={movie.id}
									movie={movie}
									onClick={setSelectedMovie}
								/> // Render each movie card
							))}
						</ul>
					)}
				</section>
			</div>
			{selectedMovie && (
				<MovieDetails
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</main>
	)
}

export default App
