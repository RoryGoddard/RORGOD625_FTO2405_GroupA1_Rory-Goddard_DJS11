import { createSlice } from "@reduxjs/toolkit";

const loadTimestamps = () => {
    try {
        const timestamps = localStorage.getItem("timestamps");
        return timestamps ? JSON.parse(timestamps) : {};
    } catch (error) {
        console.error("Error loading timestamps from storage", error)
        return {}
    }
}


const audioPlayerSlice = createSlice({
    name: "audioPlayer",
    initialState: {
        currentEpisode: null,
        isPlaying: false,
        playingShow: null,
        volume: 50,
        timestamps: loadTimestamps(),
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
        }
    }

})

export const { setCurrentEpisode, setPlaying, setVolume, saveTimestamp } = audioPlayerSlice.actions;
export default audioPlayerSlice.reducer;