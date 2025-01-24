import Fuse from 'fuse.js';

export const initializeFuzzySearch = (shows) => {
  console.log("INITIALISING THE FUZZY SEARCH")
  console.log(shows)
  if (!shows || shows.length === 0) {
    return null;
  }

  const options = {
    keys: ['title', 'description'],
    includeScore: true,
    minMatchCharLength: 2, // Match shorter parts
  };

  return new Fuse(shows, options);
};

export const performFuzzySearch = (fuse, searchTerm) => {
  console.log("WE ARE IN THE PERFORM FUZZY SEARCH FUNCTION")
  if (!fuse) {
    console.log("NO FUSE!")
    return [];
  }
  console.log("ABOUT TO RETURN FUSE SEARCH SEARCH TERM")
  console.log(fuse)
  console.log(searchTerm)
  return fuse.search(searchTerm);
};