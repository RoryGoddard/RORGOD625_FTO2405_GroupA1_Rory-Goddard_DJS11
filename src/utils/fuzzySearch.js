import Fuse from 'fuse.js';

export const initializeFuzzySearch = (shows) => {
  if (!shows || shows.length === 0) {
    return null;
  }

  const options = {
    keys: ['title', 'description'],
    threshold: 1,
    includeScore: true,
    distance: 500, // Increase distance
    minMatchCharLength: 2, // Match shorter parts
  };

  return new Fuse(shows, options);
};

export const performFuzzySearch = (fuse, searchTerm) => {
  if (!fuse) {
    return [];
  }
  return fuse.search(searchTerm);
};