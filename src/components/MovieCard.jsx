/* eslint-disable react/prop-types */

const MovieCard = ({
	movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
	return (
		<div className="movie-card">
			<img
				src={
					poster_path
						? `https://image.tmdb.org/t/p/w500/${poster_path}`
						: '/no-poster.png'
				}
				alt={title}
			/>
			<div className="mt-4">
				<li className="text-white">{title}</li>

				<div className="content">
					<div className="rating">
						<img src="/rating.svg" alt="movie rating" />
						<p className="text-gray-100">
							{vote_average ? vote_average.toFixed(1) : 'N/A'}
						</p>
					</div>

					<p className="text-3xl text-gray-100">&middot;</p>
					<p className="lang">{original_language}</p>

					<p className="text-gray-100 text-3xl">&middot;</p>
					<p className="year">
						{release_date ? release_date.split('-')[0] : 'N/A'}
					</p>
				</div>
			</div>
		</div>
	)
}

export default MovieCard
