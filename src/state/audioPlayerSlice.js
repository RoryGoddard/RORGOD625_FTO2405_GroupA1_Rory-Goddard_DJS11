import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getAllEpisodes, findEpisodeIndex } from "../utils/episodeUtils";

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
        },
        setPlayingShow: (state, action) => {
            state.playingShow = action.payload
        }
    }

})

export const skipToNextEpisode = () => (dispatch, getState) => {
    const { playingShow, currentEpisode } = getState().audioPlayer;

    if (playingShow && currentEpisode) {
        const allEpisodes = getAllEpisodes(playingShow);
        let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);

        if (currentIndex === -1) {
            currentIndex = 0;
        }

        if (currentIndex < allEpisodes.length - 1) {
            const nextEpisode = allEpisodes[currentIndex + 1];
            dispatch(setCurrentEpisode(nextEpisode));
            dispatch(setIsPlaying(true));
        }
    }
};

export const skipToPreviousEpisode = () => (dispatch, getState) => {
    const { playingShow, currentEpisode } = getState().audioPlayer
    if (playingShow && currentEpisode) {
        const allEpisodes = getAllEpisodes(playingShow);
        let currentIndex = findEpisodeIndex(currentEpisode);

        if (currentIndex === -1) {
            currentIndex = 0;
        }

        if (currentIndex > 0) {
            const previousEpisode = allEpisodes[currentIndex - 1];
            dispatch(setCurrentEpisode(previousEpisode));
            dispatch(setIsPlaying(true));
        }
    }
};

export const { 
    setCurrentEpisode,  
    setVolume,
    saveTimestamp, 
    setEpisodeAsListened, 
    setCurrentTime, 
    setDuration, 
    setIsMuted, 
    setIsPlaying,
    setPlayingShow,
    setPlaylist,
} = audioPlayerSlice.actions;
export { selectIsListened }
export default audioPlayerSlice.reducer;