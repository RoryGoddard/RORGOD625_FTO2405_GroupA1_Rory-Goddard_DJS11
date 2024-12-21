// Functions to handle sorting for shows and favorite episodes

export const sortByTitleAscending = (data, titleKey = 'title') => {
  return [...data].sort((a, b) => {
    const titleA = a[titleKey] || a.showTitle || '';
    const titleB = b[titleKey] || b.showTitle || '';
    return titleA.localeCompare(titleB);
  });
};

export const sortByTitleDescending = (data, titleKey = 'title') => {
  return [...data].sort((a, b) => {
    const titleA = a[titleKey] || a.showTitle || '';
    const titleB = b[titleKey] || b.showTitle || '';
    return titleB.localeCompare(titleA);
  });
};

export const sortByDateAscending = (data, dateKey = 'updated') => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateKey] || a.savedAt || 0);
    const dateB = new Date(b[dateKey] || b.savedAt || 0);
    return dateA - dateB;
  });
};

export const sortByDateDescending = (data, dateKey = 'updated') => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateKey] || a.savedAt || 0);
    const dateB = new Date(b[dateKey] || b.savedAt || 0);
    return dateB - dateA;
  });
};

export const applySorting = (podcasts, sortOption) => {
  switch (sortOption) {
    case 'A-Z':
      return sortByTitleAscending(podcasts);
    case 'Z-A':
      return sortByTitleDescending(podcasts);
    case 'newest':
      return sortByDateDescending(podcasts);
    case 'oldest':
      return sortByDateAscending(podcasts);
    default:
      return podcasts;
  }
}