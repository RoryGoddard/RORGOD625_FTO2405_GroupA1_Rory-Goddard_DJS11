import { useState, useRef } from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const AudioPlayer = () => {
    const theme = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100; // Convert to 0-1 range for HTML audio
  };

  const handleSkipNext = () => {
    // Handle skipping to the next track
  };

  const handleSkipPrevious = () => {
    // Handle skipping to the previous track 
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.audioPlayer.background,
        color: theme.palette.audioPlayer.color,
        width: '100%',
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem',
      }}
    >
      <IconButton color="inherit" onClick={handleSkipPrevious}>
        <SkipPreviousIcon />
      </IconButton>
      <IconButton color="inherit" onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton color="inherit" onClick={handleSkipNext}>
        <SkipNextIcon />
      </IconButton>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="inherit">
          {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          aria-labelledby="continuous-slider"
          min={0}
          max={100}
          sx={{
            width: 100,
            color: theme.palette.audioPlayer.slider, // Apply black color for the slider
          }}
        />
      </Box>

      {/* Replace 'your-audio-file.mp3' with the URL of the current audio track */}
      <audio ref={audioRef} src="Your audio here" />
    </Box>
  );
};

export default AudioPlayer;
