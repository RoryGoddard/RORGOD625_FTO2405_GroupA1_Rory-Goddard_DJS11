import { createSlice, createSelector } from "@reduxjs/toolkit";
import { applySorting } from "../utils/sortUtils";
import { initializeFuzzySearch, performFuzzySearch } from '../utils/fuzzySearch';

const loadFavourites = () => {
    try {
        const favourites = localStorage.getItem("favourites.episodes");
        return favourites ? JSON.parse(favourites) : [];
    } catch (error) {
        console.error("Error loading favourites from storage", error)
        return [];
    }
};

const selectIsFavourite = createSelector(
    [
        (state) => state.favourites.episodes, 
        (_, showId) => showId,
        (_, __, seasonNumber) => seasonNumber, 
        (_, __, ___, episodeNumber) => episodeNumber
    ],
    (favourites, showId, seasonNumber, episodeNumber) => 
        favourites.some(
            (episode) => 
                episode.showId === showId && 
                episode.seasonNumber === seasonNumber && 
                episode.episodeNumber === episodeNumber
        )
);

const favouritesSlice = createSlice({
    name: "favourites",
    initialState: {
        episodes: loadFavourites(),
        sortOption: 'A-Z',
        searchTerm: '',
        searchedAndSortedFavourites: loadFavourites(),
    },
    reducers: {
        toggleFavourite: (state, action) => {
            const existingIndex = state.episodes.findIndex(fav => fav.showId === action.payload.showId && fav.seasonNumber === action.payload.seasonNumber && fav.episodeNumber === action.payload.episodeNumber)

            if (existingIndex === -1) {
                state.searchedAndSortedFavourites.push(action.payload);
                state.episodes.push(action.payload);
            } else {
                state.episodes.splice(existingIndex, 1);
                state.searchedAndSortedFavourites.splice(existingIndex, 1);
            }
        },
        setFavouriteSortOption(state, action) {
            state.sortOption = action.payload;
            const sortedFavourites = applySorting(
                state.episodes,
                action.payload
            );
            state.searchedAndSortedFavourites = sortedFavourites
        },
        setFavouriteSearchTerm(state, action) {
            state.searchTerm = action.payload;
            let searchResults = state.episodes;

            if (state.searchTerm) {
                const fuse = initializeFuzzySearch(searchResults);
                searchResults = performFuzzySearch(fuse, state.searchTerm)
                .map(result => result.item);
            }

            searchResults = applySorting(searchResults, state.sortOption);
            state.searchedAndSortedFavourites = searchResults;
        },

    }
})

export const { toggleFavourite, setFavouriteSortOption, setFavouriteSearchTerm } = favouritesSlice.actions;
export { selectIsFavourite }
export default favouritesSlice.reducer;