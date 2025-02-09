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
        return listenedEpisodes ? JSON.parse(listenedEpisodes) : [];
    } catch (error) {
        console.error("Error loading the listened episodes from storage", error)
        return {}
    }
}

const selectIsListened = createSelector(
    [
        (state) => state.audioPlayer.listenedEpisodes, 
        (_, showId) => showId,
        (_, __, seasonNumber) => seasonNumber, 
        (_, __, ___, episodeNumber) => episodeNumber
    ],
    (listenedEpisodes, showId, seasonNumber, episodeNumber) => 
        listenedEpisodes.some(
            (episode) => 
                episode.showId === showId && 
                episode.seasonNumber === seasonNumber && 
                episode.episodeNumber === episodeNumber
        )
);

const audioPlayerSlice = createSlice({
    name: "audioPlayer",
    initialState: {
        currentEpisode: null,
        playlist: [],
        isPlaying: false,
        playingShow: null,
        volume: 50,
        isMuted: false,
        duration:0,
        currentTime:0,
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
        setIsMuted: (state, action) => {
            state.isMuted = action.payload
        },
        saveTimestamp: (state, action) => {
            const { episodeId, timestamp } = action.payload;
            state.timestamps[episodeId] = timestamp;
        },
        setEpisodeAsListened: (state, action) => {
            const { show, episode } = action.payload
            state.listenedEpisodes[show] = episode
        },
        setPlaylist: (state, action) => {
            state.playlist = action.payload
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload
        },
        setDuration: (state, action) => {
            state.duration = action.payload
        }
    }

})

export const { 
    setCurrentEpisode, 
    setPlaying, 
    setVolume,
    saveTimestamp, 
    setEpisodeAsListened, 
    setCurrentTime, 
    setDuration, 
    setIsMuted, 
    setIsPlaying, 
    setPlaylist
} = audioPlayerSlice.actions;
export { selectIsListened }
export default audioPlayerSlice.reducer;