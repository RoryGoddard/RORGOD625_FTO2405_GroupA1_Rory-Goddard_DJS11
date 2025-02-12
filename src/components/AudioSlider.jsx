import { Box, Slider, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { seekTo } from '../state/audioPlayerSlice';

const AudioSlider = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const duration = useSelector((state) => state.audioPlayer.duration);
    const currentTime = useSelector((state) => state.audioPlayer.currentTime);

    const handleProgressChange = (_, newValue) => {
        const time = (newValue / 100) * duration;
        dispatch(seekTo(time));
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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