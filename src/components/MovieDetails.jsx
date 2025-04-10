/* eslint-disable react/prop-types */
const MovieDetails = ({ movie, onClose }) => {
	if (!movie) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Blur background */}
			<div
				className="absolute inset-0 bg-opacity-70 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal content */}
			<div className="relative z-10 bg-primary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
					&times;
				</button>

				<div className="p-12">
					<div className="flex flex-col md:flex-row gap-6">
						<img
							src={
								movie.poster_path
									? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
									: '/no-poster.png'
							}
							alt={movie.title}
							className="w-full md:w-1/3 rounded-lg"
						/>

						<div className="flex-1">
							<h2 className="text-2xl font-bold text-white mb-2">
								{movie.title}
							</h2>

							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center">
									<img
										src="/rating.svg"
										alt="rating"
										className="w-4 h-4 mr-1"
									/>
									<span className="text-gray-100">
										{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
									</span>
								</div>

								<span className="text-gray-400">|</span>
								<span className="text-gray-100">
									{movie.release_date?.split('-')[0] || 'N/A'}
								</span>
								<span className="text-gray-400">|</span>
								<span className="text-gray-100 uppercase">
									{movie.original_language}
								</span>
							</div>

							<h3 className="text-lg font-semibold text-white mb-2">
								Overview
							</h3>
							<p className="text-gray-300 mb-4">
								{movie.overview || 'No overview available.'}
							</p>

							<div className="grid grid-cols-2 gap-4 mt-6">
								<div>
									<h4 className="text-sm text-gray-400">Popularity</h4>
									<p className="text-white">
										{movie.popularity?.toFixed(0) || 'N/A'}
									</p>
								</div>
								<div>
									<h4 className="text-sm text-gray-400">Vote Count</h4>
									<p className="text-white">{movie.vote_count || 'N/A'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MovieDetails
