import Fuse from 'fuse.js';

export const initializeFuzzySearch = (shows) => {
  if (!shows || shows.length === 0) {
    return null;
  }

  const options = {
    keys: ['title', 'description'],
    includeScore: true,
    threshold: 0.45
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