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
    [(state) => state.favourites, (_, showId, seasonNumber, episodeNumber) => ({showId, seasonNumber, episodeNumber})],
    (favourites, { showId, seasonNumber, episodeNumber }) => { if(!showId || !seasonNumber || !episodeNumber) {
        return false;
    } return favourites.some(fav => fav.showId === showId && fav.seasonNumber === seasonNumber && fav.episodeNumber === episodeNumber);
})

const favouritesSlice = createSlice({
    name: "favourites",
    initialState: loadFavourites(),
    reducers: {
        toggleFavourite: (state, action) => {
            const existingIndex = state.findIndex(fav => fav.showId === action.payload.showId && fav.episodeNumber === action.payload.episodeNumber)

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