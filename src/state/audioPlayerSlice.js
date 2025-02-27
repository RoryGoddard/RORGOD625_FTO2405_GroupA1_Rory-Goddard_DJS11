import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getAllEpisodes, findEpisodeIndex } from "../utils/episodeUtils";
import { audioService } from "../services/AudioService";

const loadTimestamps = () => {
    try {
        const timestamps = localStorage.getItem("timestamps");
        return timestamps ? JSON.parse(timestamps) : [];
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

export const selectIsListened = createSelector(
    [(state) => state.audioPlayer.listenedEpisodes,
    (_, props) => props],
    (listenedEpisodes, props) => 
        listenedEpisodes.some(oldEpisode => oldEpisode.episodeId === props.episodeId)
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
        },
        setEpisodeListened: (state, action) => {
            state.listenedEpisodes = action.payload
        }
    }

})

export const playEpisode = (episode) => async (dispatch) => {
    try {
        const duration = await audioService.setSource(episode.file);
        await audioService.play();
        dispatch(setCurrentEpisode(episode));
        dispatch(setIsPlaying(true));
        dispatch(generatePlaylist());
        dispatch(setDuration(duration));

        if (audioService.endedListener) {
            audioService.endedListener();
        };

        audioService.endedListener = audioService.onEnded(() => {
            dispatch(setEpisodeAsListened(episode))
            dispatch(skipToNextEpisode())
        });

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
        console.log(allEpisodes)
    }
}

export const skipToNextEpisode = () => (dispatch, getState) => {
    const { playingShow, currentEpisode, playlist, currentIndex } = getState().audioPlayer;

    if (playingShow && currentEpisode && playlist) {
        if (currentIndex < playlist.length - 1) {
            const nextEpisode = playlist[currentIndex + 1];
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
            const nextEpisode = playlist[currentIndex - 1];
            dispatch(playEpisode(nextEpisode));
            dispatch(setIsPlaying(true));
            dispatch(setCurrentIndex(currentIndex - 1))
        }
    }
};

export const setEpisodeAsListened = (newEpisode) => (dispatch, getState) => {
    console.log("This is what the actions payload is:", newEpisode)
    const { listenedEpisodes } = getState().audioPlayer;
    const isInArray = listenedEpisodes.some(episode => episode.episodeId === newEpisode.episodeId)
    if (!isInArray) {
        const listenedEpisodesArray = [...listenedEpisodes, newEpisode]
        dispatch(setEpisodeListened(listenedEpisodesArray))
    }
    console.log("listenedEpisodes are:", listenedEpisodes)
};

export const saveEpisodesTimestamp = (episode) => (dispatch, getState) => {
   const elapsedTime =  audioService.getCurrentTime()
   if (elapsedTime > 5) {
    const episodeDetails = {...episode, timestamp: elapsedTime}
    const timestamps = getState().audioPlayer.timestamps
    timestamps.push(episodeDetails)
    dispatch(saveTimestamp(timestamps))
   }
}

export const { 
    setCurrentEpisode,  
    setVolume,
    saveTimestamp, 
    setCurrentTime, 
    setDuration, 
    setIsMuted, 
    setIsPlaying,
    setPlayingShow,
    setPlaylist,
    setCurrentIndex,
    setEpisodeListened
} = audioPlayerSlice.actions;
export default audioPlayerSlice.reducer;