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
    [(state) => state.favourites.episodes, 
    (_, props) => props],
    (favourites, props) => 
        favourites.some(fav => fav.episodeId === props.episodeId)
);

const selectSearchedAndSortedFavourites = createSelector( 
    [
        (state) => state.favourites.episodes,
        (state) => state.favourites.sortOption,
        (state) => state.favourites.searchTerm
    ],
    (episodes, sortOption, searchTerm) => {
        let results = [...episodes]
        if (searchTerm) {
            const fuse = initializeFuzzySearch(results);
            results = performFuzzySearch(fuse, searchTerm)
            .map(result => result.item);
        }
        return applySorting(results, sortOption)
    }
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
            const existingIndex = state.episodes.findIndex(fav => fav.episodeId === action.payload.episodeId)
            if (existingIndex === -1) {
                state.episodes.push(action.payload);
            } else {
                state.episodes.splice(existingIndex, 1);
            }
        },
        setFavouriteSortOption(state, action) {
            state.sortOption = action.payload;
        },
        setFavouriteSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        clearFavourites(state, action) {
            state.episodes = action.payload
            state.searchedAndSortedFavourites = action.payload
        }

    }
});

export const { toggleFavourite, setFavouriteSortOption, setFavouriteSearchTerm, clearFavourites } = favouritesSlice.actions;
export { selectIsFavourite, selectSearchedAndSortedFavourites };
export default favouritesSlice.reducer;