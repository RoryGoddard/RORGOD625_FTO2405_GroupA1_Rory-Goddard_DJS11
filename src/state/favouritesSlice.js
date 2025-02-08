import { createSlice, createSelector } from "@reduxjs/toolkit";

const loadFavourites = () => {
    try {
        const favourites = localStorage.getItem("favourites");
        return favourites ? JSON.parse(favourites) : [];
    } catch (error) {
        console.error("Error loading favourites from storage", error)
        return [];
    }
};

const selectIsFavourite = createSelector(
    [
        (state) => state.favourites, 
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
    },
    reducers: {
        toggleFavourite: (state, action) => {
            const existingIndex = state.findIndex(fav => fav.showId === action.payload.showId && fav.seasonNumber === action.payload.seasonNumber && fav.episodeNumber === action.payload.episodeNumber)

            if (existingIndex === -1) {
                state.push(action.payload);
            } else {
                state.splice(existingIndex, 1);
            }
        },
    }
})

export const { toggleFavourite } = favouritesSlice.actions;
export { selectIsFavourite }
export default favouritesSlice.reducer;