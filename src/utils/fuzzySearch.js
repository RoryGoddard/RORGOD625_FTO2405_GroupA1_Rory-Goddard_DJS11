import Fuse from 'fuse.js';

const favouriteKeys = ['showTitle', 'seasonTitle', 'episodeTitle', 'episodeNumber']
const podcastKeys = ['title', 'description']

export const initializeFuzzySearch = (shows) => {
  if (!shows || shows.length === 0) {
    return null;
  }

  const isPodcastsOrFavourites = shows[0]?.title ? true : false

  const options = {
    keys: isPodcastsOrFavourites ? podcastKeys : favouriteKeys,
    includeScore: true,
    threshold: 0.3
  };

  return new Fuse(shows, options);
};

export const performFuzzySearch = (fuse, searchTerm) => {
  if (!fuse) {
    console.log("NO FUSE!")
    return [];
  }
  return fuse.search(searchTerm);
};