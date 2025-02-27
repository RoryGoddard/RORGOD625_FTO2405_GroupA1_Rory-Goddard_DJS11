export const filterPodcastsByGenre = (podcasts, genre) => {
  if (!genre) {
    // If no genre is selected, return the full list
    return podcasts;
  }

  // Filter podcasts based on the genre ID
  return podcasts.filter((podcast) => 
    podcast.genres.some((podcastGenre) => podcastGenre.id === genre.id)
  );
};