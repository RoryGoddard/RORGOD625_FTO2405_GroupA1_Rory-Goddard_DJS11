// Functions to handle sorting for shows

export const sortByTitleAscending = (data) => {
    return [...data].sort((a, b) => a.title.localeCompare(b.title));
  };
  
export const sortByTitleDescending = (data) => {
    return [...data].sort((a, b) => b.title.localeCompare(a.title));
  };

export const sortByDateAscending = (data) => {
    return [...data].sort((a, b) => new Date(a.updated) - new Date(b.updated));
  };

export const sortByDateDescending = (data) => {
    return [...data].sort((a, b) => new Date(b.updated) - new Date(a.updated));
  };

