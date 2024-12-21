import { createSlice } from "@reduxjs/toolkit";
import { podcastApi } from "../services/podcastApi";
import { applySorting } from "../utils/sortUtils";

const initialState = {
    genres: [],
    enrichedPodcasts: [],
    sortedAndFilteredEnrichedPodcasts: [],
    loading: false,
    error: null,
    sortOption: 'A-Z',
}

const podcastSlice = createSlice({
    name: 'podcasts',
    initialState,
    reducers: {
        setSortOption(state, action) {
            state.sortOption = action.payload;
            state.sortedAndFilteredEnrichedPodcasts = applySorting(
                state.enrichedPodcasts,
                action.payload
            );
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
                state.enrichedPodcasts = action.payload.sortedAndFilteredEnrichedPodcasts;
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

export default podcastSlice.reducer;