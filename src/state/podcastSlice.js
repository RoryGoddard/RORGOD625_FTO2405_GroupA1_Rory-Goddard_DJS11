import { createSlice } from "@reduxjs/toolkit";
import { podcastApi } from "../services/podcastApi";
import { applySorting } from "../utils/sortUtils";
import { filterPodcastsByGenre } from "../utils/filterUtils";
import { initializeFuzzySearch, performFuzzySearch } from '../utils/fuzzySearch';

const initialState = {
    genres: [],
    enrichedPodcasts: [],
    sortedAndFilteredEnrichedPodcasts: [],
    loading: false,
    error: null,
    sortOption: 'A-Z',
    filterOption: null,
    searchTerm: ''
}

const podcastSlice = createSlice({
    name: 'podcasts',
    initialState,
    reducers: {
        setSortOption(state, action) {
            state.sortOption = action.payload;
            const sortedPodcasts = applySorting(
                state.enrichedPodcasts,
                action.payload
            );
            state.sortedAndFilteredEnrichedPodcasts = filterPodcastsByGenre(sortedPodcasts, state.filterOption)
            },
        setFilterOption(state, action) {
            state.filterOption = action.payload;
            const filteredPodcasts = filterPodcastsByGenre(
                state.enrichedPodcasts, 
                action.payload
            );
            state.sortedAndFilteredEnrichedPodcasts = applySorting(filteredPodcasts, state.sortOption);
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
            if (state.searchTerm === '') {
                state.sortedAndFilteredEnrichedPodcasts = state.enrichedPodcasts
                console.log(state.sortedAndFilteredEnrichedPodcasts)
            }
            else {
                const fuse = initializeFuzzySearch(state.enrichedPodcasts)
                console.log(" I am console logging the search term in the podcast slice")
                console.log(state.searchTerm)
                const results = performFuzzySearch(fuse, state.searchTerm);
                console.log("Have defined results and will now console log")
                console.log(results)
                state.sortedAndFilteredEnrichedPodcasts = results.map(result => result.item)
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(
            podcastApi.endpoints.getAllPodcastsEnriched.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        )
        .addMatcher(
            podcastApi.endpoints.getAllPodcastsEnriched.matchFulfilled,
            (state, action) => {
                state.loading = false;
                state.enrichedPodcasts = action.payload.enrichedPodcasts;
                state.sortedAndFilteredEnrichedPodcasts = applySorting(
                    state.enrichedPodcasts,
                    state.sortOption
                )
                state.genres = action.payload.genres;
            }
        )
        .addMatcher(
            podcastApi.endpoints.getAllPodcastsEnriched.matchRejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error;
            }
        )
    }
})

export const { setSortOption, setFilterOption, setSearchTerm } = podcastSlice.actions;
export default podcastSlice.reducer;