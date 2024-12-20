import { createSlice } from "@reduxjs/toolkit";
import { podcastApi } from "../services/podcastApi";

const initialState = {
    genres: [],
    enrichedPodcasts: [],
    loading: false,
    error: null,
}

const podcastSlice = createSlice({
    name: 'podcasts',
    initialState,
    reducers: {},
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
                state.genres = action.payload.genres
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