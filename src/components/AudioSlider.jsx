import { Box, Slider, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// import { seekTo } from '../state/audioPlayerSlice';
import { audioService } from '../services/AudioService';
import { useEffect, useState } from 'react';
// import { setCurrentTime } from '../state/audioPlayerSlice';

const AudioSlider = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const episodeIndex = useSelector((state) => state.audioPlayer.currentIndex) 

    useEffect(() => {
      const handleMetadataLoaded = () => {
        setDuration(audioService.getDuration())
      }

      audioService.audio.addEventListener("loadedmetadata", handleMetadataLoaded)
      
      const unsubscribe = audioService.onTimeUpdate(setCurrentTime)

      return () => {
        audioService.audio.removeEventListener("loadedmetadata", handleMetadataLoaded)
        unsubscribe()
      }
    }, [episodeIndex])

    const handleProgressChange = (_, newValue) => {
        const time = (newValue / 100) * duration;
        seekTo(time);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const seekTo = (time) => {
      audioService.setCurrentTime(time);
      setCurrentTime(time);
    };


    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ mr: 1, fontSize: '1.2rem'}}>
          {formatTime(currentTime)}
        </Typography>
        <Slider
          value={progress}
          onChange={handleProgressChange}
          aria-labelledby="progress-slider"
          sx={{
            flexGrow: 1,
            mx: 2,
            color: theme.palette.audioPlayer.slider,
          }}
        />
        <Typography variant="body1" sx={{ ml: 1, fontSize: '1.2rem'}}>
          {formatTime(duration)}
        </Typography>
      </Box>
    )
}

export default AudioSlider