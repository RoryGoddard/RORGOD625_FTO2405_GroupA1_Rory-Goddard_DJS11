// Functions to handle sorting for shows

export const sortByTitleAscending = (data) => {
    return [...data].sort((a, b) => a.title.localeCompare(b.title));
  };
  
export const sortByTitleDescending = (data) => {
    return [...data].sort((a, b) => b.title.localeCompare(a.title));
  };

export const sortByDateAscending = (data) => {
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

export const sortByDateDescending = (data) => {
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

