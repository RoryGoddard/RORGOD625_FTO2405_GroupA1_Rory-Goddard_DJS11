import { createSlice } from "@reduxjs/toolkit";

const loadFavourites = () => {
    try {
        const favourites = localStorage.getItem("favourites");
        return favourites ? JSON.parse(favourites) : [];
    } catch (error) {
        console.error("Error loading favourites from storage", error)
        return [];
    }
};

const favouritesSlice = createSlice({
    name: "favourites",
    initialState: loadFavourites(),
    reducers: {
        toggleFavourite: (state, action) => {
            if(!state.includes(action.payload)) {
                state.push(action.payload)
                return state
            } else {
                return state.filter(fav => fav !== action.payload)
            }
        },
    }
})

export const { toggleFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;