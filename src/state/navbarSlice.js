import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSortMenuOpen: false,
    isFilterMenuOpen: false,
    isSettingsMenuOpen: false,
    sortAnchorEl: null,
    filterAnchorEl: null,
    settingsAnchorEl: null,
};

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        toggleSortMenu: (state) => {
            state.isSortMenuOpen = !state.isSortMenuOpen
        },
        toggleFilterMenu: (state) => {
            state.isFilterMenuOpen = !state.isFilterMenuOpen
        },
        toggleSettingsMenu: (state) => {
            state.isSettingsMenuOpen = !state.isSettingsMenuOpen
        },
    }
});

export const { toggleSortMenu } = navbarSlice.actions
export default navbarSlice.reducer;
