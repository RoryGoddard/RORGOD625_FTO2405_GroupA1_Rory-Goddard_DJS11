import { Box, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const AudioSlider = () => {
    const theme = useTheme();
    const [progress, setProgress] = useState(0);
    const duration = useSelector((state) => state.audioPlayer.duration);
    const currentTime = useSelector((state) => state.audioPlayer.currentTime);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressChange = (event, newValue) => {
        if (audioRef.current) {
            const time = (newValue / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            console.log("current time state is", currentTime)
        }
        setProgress(newValue);
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