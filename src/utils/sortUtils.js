export const applySorting = (podcasts, sortOption) => {
  if (podcasts[0]?.episodeId) {
    switch (sortOption) {
      case 'A-Z':
        return [...podcasts].sort((a, b) => a.showTitle.localeCompare(b.showTitle));
      case 'Z-A':
        return [...podcasts].sort((a, b) => b.showTitle.localeCompare(a.showTitle));
      case 'newest':
        return [...podcasts].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      case 'oldest':
        return [...podcasts].sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
      default:
        return podcasts;
    }
  }
  
  switch (sortOption) {
    case 'A-Z':
      return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
    case 'Z-A':
      return [...podcasts].sort((a, b) => b.title.localeCompare(a.title));
    case 'newest':
      return [...podcasts].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    case 'oldest':
      return [...podcasts].sort((a, b) => new Date(a.updated) - new Date(b.updated));
    default:
      return podcasts;
  }
}