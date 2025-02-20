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
        (_, __, season) => season, 
        (_, __, ___, episode) => episode
    ],
    (favourites, showId, season, episode) => 
        favourites.some(
            (episode) => 
                episode.showId === showId && 
                episode.season === season && 
                episode.episode === episode
        )
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
            console.log("Here is the episode passed to toggle:", action.payload)
            const existingIndex = state.episodes.findIndex(fav => fav.showId === action.payload.showId && fav.season === action.payload.season && fav.episode === action.payload.episode)
            console.log("Checking existing index:", existingIndex)
            if (existingIndex === -1) {
                console.log("Spoiler alert: its -1")
                state.searchedAndSortedFavourites.push(action.payload);
                state.episodes.push(action.payload);
            } else {
                console.log("its not -1, jk this console log will never print")
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
export { selectIsFavourite, selectSearchedAndSortedFavourites }
export default favouritesSlice.reducer;