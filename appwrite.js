// Import required modules from the Appwrite SDK
import { Client, Databases, ID, Query } from 'appwrite'

// Appwrite project configuration
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID // Appwrite project ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID // Database ID in Appwrite
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID // Collection ID in Appwrite

// Initialize the Appwrite client and configure it with the project and endpoint
const client = new Client()
	.setEndpoint('https://cloud.appwrite.io/v1') // Appwrite cloud endpoint
	.setProject(PROJECT_ID) // Set the project ID

// Initialize the database instance using the Appwrite client
const database = new Databases(client)

/**
 * Updates the search count for a given search term in the database.
 * - If the search term exists, its `count` is incremented by 1.
 * - If it does not exist, a new document is created with the search term, count initialized to 1,
 *   and details about the associated movie.
 *
 * @param {string} searchTerm - The term entered by the user in the search bar.
 * @param {object} movie - The movie object containing details about the searched movie.
 */
export const updateSearchCount = async (searchTerm, movie) => {
	try {
		// Check if a document for the given search term already exists in the collection
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.equal('searchTerm', searchTerm), // Query for documents matching the searchTerm
		])

		if (result.documents.length > 0) {
			// If a document exists, update its count
			const doc = result.documents[0]
			await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
				count: doc.count + 1, // Increment the count
			})
		} else {
			// If no document exists, create a new one
			await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
				searchTerm, // Store the search term
				count: 1, // Initialize count to 1
				movie_id: movie.id, // Store the movie ID
				poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // Store the movie poster URL
			})
		}
	} catch (error) {
		console.error(error) // Log any errors encountered during the operation
	}
}

/**
 * Retrieves the top 5 trending movies from the database.
 * Trending movies are determined by the highest search count.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of trending movie documents.
 * @throws {Error} - Throws an error if the operation fails.
 */
export const getTrendingMovies = async () => {
	try {
		// Query the database to fetch the top 5 documents ordered by descending count
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.limit(5), // Limit the number of documents to 5
			Query.orderDesc('count'), // Sort by count in descending order
		])

		return result.documents // Return the array of trending movie documents
	} catch (error) {
		console.error(error) // Log any errors encountered during the operation
		throw new Error(`Failed to retrieve trending movies from the database`) // Throw an error for the calling function
	}
}
