import { createSlice } from "@reduxjs/toolkit";
import { podcastApi } from "../services/podcastApi"
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
    searchTerm: '',
    selectedPodcastId: null,
    modalOpen: false,
    selectedPodcastData: null,
    favouriteEpisodes: null,
    listenedEpisodes: null,
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
            let searchResults = state.enrichedPodcasts

            if (state.searchTerm) {
                const fuse = initializeFuzzySearch(searchResults);
                searchResults = performFuzzySearch(fuse, state.searchTerm)
                .map(result => result.item);
            }

            searchResults = applySorting(searchResults, state.sortOption);
            state.sortedAndFilteredEnrichedPodcasts = filterPodcastsByGenre(searchResults, state.filterOption);
        },
        setSelectedPodcastId(state, action) {
            state.selectedPodcastId = action.payload
        },
        setSelectedPodcastData(state, action) {
            state.selectedPodcastData = action.payload
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
        .addMatcher(
            podcastApi.endpoints.getPodcastById.matchPending,
            (state) => {
                state.loading = true;
                state.selectedPodcastData = null;
                state.error = null;
            }
        )
        .addMatcher(
            podcastApi.endpoints.getPodcastById.matchFulfilled,
            (state, action) => {
                state.loading = false;
                state.selectedPodcastData = action.payload;
                state.error = null;
            }
        )
        .addMatcher(
            podcastApi.endpoints.getPodcastById.matchRejected,
            (state, action) => {
                state.loading = false;
                state.selectedPodcastData = null;
                state.error = action.error;
            }
        )
    }
})

export const { setSortOption, setFilterOption, setSearchTerm, setSelectedPodcastId, setModalOpen, setSelectedPodcastData } = podcastSlice.actions;
export default podcastSlice.reducer;