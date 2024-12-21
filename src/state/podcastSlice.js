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
    filterOption: null,
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
            },
        setFilterOption(state, action) {
            state.filterOption = action.payload
            console.log(state.filterOption)
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

export const { setSortOption, setFilterOption } = podcastSlice.actions;
export default podcastSlice.reducer;