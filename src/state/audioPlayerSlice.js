import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getAllEpisodes, findEpisodeIndex } from "../utils/episodeUtils";
import { audioService } from "../services/AudioService";

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
        currentIndex: 0,
        playlist: null,
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
        },
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload
        }
    }

})

export const togglePlayPause = () => (dispatch, getState) => {
    const { isPlaying } = getState().audioPlayer;
    
    if (isPlaying) {
        audioService.pause();
    } else {
        audioService.play();
    }
    dispatch(setIsPlaying(!isPlaying));
};

export const playEpisode = (episode) => async (dispatch) => {
    try {
        audioService.setSource(episode.file);
        audioService.play();
        dispatch(setCurrentEpisode(episode));
        dispatch(setIsPlaying(true));
        dispatch(generatePlaylist())
    } catch (error) {
        console.error('Failed to play episode:', error);
    }
};

export const seekTo = (time) => (dispatch) => {
    audioService.setCurrentTime(time);
    dispatch(setCurrentTime(time));
};

export const generatePlaylist = () => (dispatch, getState) => {
    const { playingShow, currentEpisode } = getState().audioPlayer;

    if (playingShow && currentEpisode) {
        const allEpisodes = getAllEpisodes(playingShow);
        let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        dispatch(setPlaylist(allEpisodes))
        dispatch(setCurrentIndex(currentIndex))
    }
}

export const skipToNextEpisode = () => (dispatch, getState) => {
    const { playingShow, currentEpisode, playlist, currentIndex } = getState().audioPlayer;

    if (playingShow && currentEpisode && playlist) {
        if (currentIndex < playlist.length - 1) {
            console.log("Just checkign that this evaluates to true")
            const nextEpisode = playlist[currentIndex + 1];
            console.log(nextEpisode)
            dispatch(playEpisode(nextEpisode));
            dispatch(setIsPlaying(true));
            dispatch(setCurrentIndex(currentIndex + 1))
        }
    }
};

export const skipToPreviousEpisode = () => (dispatch, getState) => {
    const { playingShow, currentEpisode, playlist, currentIndex } = getState().audioPlayer;

    if (playingShow && currentEpisode && playlist) {
        if (currentIndex > 0) {
            console.log("Just checkign that this evaluates to true")
            const nextEpisode = playlist[currentIndex - 1];
            console.log(nextEpisode)
            dispatch(playEpisode(nextEpisode));
            dispatch(setIsPlaying(true));
            dispatch(setCurrentIndex(currentIndex - 1))
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
    setCurrentIndex
} = audioPlayerSlice.actions;
export { selectIsListened }
export default audioPlayerSlice.reducer;