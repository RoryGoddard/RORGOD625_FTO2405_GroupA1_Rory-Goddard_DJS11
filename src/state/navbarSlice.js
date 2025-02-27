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
        setSortAnchorEl(state, action) {
            state.sortAnchorEl = action.payload
        },
        setFilterAnchorEl(state, action) {
            state.filterAnchorEl = action.payload
        },
        setSettingsAnchorEl(state, action) {
            state.settingsAnchorEl = action.payload
        },
        clearSortAnchorEl(state) {
            state.sortAnchorEl = null
        },
        clearFilterAnchorEl(state) {
            state.filterAnchorEl = null
        },
        clearSettingsAnchorEl(state) {
            state.settingsAnchorEl = null
        },
    }
});

export const { 
    setSortAnchorEl, 
    setFilterAnchorEl, 
    setSettingsAnchorEl, 
    clearSortAnchorEl, 
    clearFilterAnchorEl, 
    clearSettingsAnchorEl 
} = navbarSlice.actions

export default navbarSlice.reducer;
