import { createSelector, createSlice } from "@reduxjs/toolkit";

const loadTimestamps = () => {
    try {
        const timestamps = localStorage.getItem("timestamps");
        return timestamps ? JSON.parse(timestamps) : {};
    } catch (error) {
        console.error("Error loading timestamps from storage", error)
        return {}
    }
}

const loadListenedEpisodes = () => {
    try {
        const listenedEpisodes = localStorage.getItem("listenedEpisodes");
        return listenedEpisodes ? JSON.parse(listenedEpisodes) : {};
    } catch (error) {
        console.error("Error loading the listened episodes from storage", error)
        return {}
    }
}

const selectIsListened = createSelector(
    [(state) => state.audioPlayer.listenedEpisodes, (_, showId, episodeNumber) => ({showId, episodeNumber})],
    (listenedEpisodes, { showId, episodeNumber }) => { if(!showId || !episodeNumber) {
        return false;
    } return listenedEpisodes.some(episode => episode.showId === showId && episode.episodeNumber === episodeNumber);
})


const audioPlayerSlice = createSlice({
    name: "audioPlayer",
    initialState: {
        currentEpisode: null,
        isPlaying: false,
        playingShow: null,
        volume: 50,
        timestamps: loadTimestamps(),
        listenedEpisodes: loadListenedEpisodes()
    },
    reducers: {
        setCurrentEpisode: (state, action) => {
            state.currentEpisode = action.payload
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload
        },
        setVolume: (state, action) => {
            state.volume = action.payload
        },
        saveTimestamp: (state, action) => {
            const { episodeId, timestamp } = action.payload;
            state.timestamps[episodeId] = timestamp;
        },
        setEpisodeAsListened: (state, action) => {
            const { show, episode } = action.payload
            state.listenedEpisodes[show] = episode
        }
    }

})

export const { setCurrentEpisode, setPlaying, setVolume, saveTimestamp, setEpisodeAsListened } = audioPlayerSlice.actions;
export { selectIsListened }
export default audioPlayerSlice.reducer;