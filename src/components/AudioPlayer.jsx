import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const AudioPlayer = ({ episode, isPlaying, onPlayPause, onSkipNext, onSkipPrevious, playingShow }) => {
  const theme = useTheme();
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (episode && audioRef.current) {
      console.log('Loading episode:', episode);
      audioRef.current.src = episode.file;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error('Error playing audio:', err));
      }
    }
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  const handlePlayPause = () => {
    console.log(episode)
    onPlayPause(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  const handleProgressChange = (event, newValue) => {
    const newTime = (newValue / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleSkipNext = () => {
    console.log("In handle skip next")
    onSkipNext();
  };

  const handleSkipPrevious = () => {
    console.log("In handle skip previous")
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      onSkipPrevious();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.5rem',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ mr: 1, fontSize: '1.2rem'}}>
          {formatTime(currentTime)}
        </Typography>
        <Slider
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
          aria-labelledby="continuous-slider"
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
      
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100px' }} /> {/* Spacer */}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <IconButton 
            color="inherit" 
            onClick={handleSkipPrevious} 
            sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}
          >
            <SkipPreviousIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={handlePlayPause} 
            sx={{ 
              padding: '12px',
              width: '72px',
              height: '72px',
              '& .MuiIconButton-root': { padding: 0 }
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: '3rem' }} /> : <PlayArrowIcon sx={{ fontSize: '3rem' }} />}
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={handleSkipNext} 
            sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}
          >
            <SkipNextIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '140px', mr: "0.5rem" }}>
          <IconButton 
            color="inherit" 
            onClick={() => handleVolumeChange(null, volume === 0 ? 100 : 0)}
            sx={{ 
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}
          >
            {volume === 0 ? <VolumeOffIcon sx={{ fontSize: '2rem' }} /> : <VolumeUpIcon sx={{ fontSize: '2rem' }} />}
          </IconButton>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            min={0}
            max={100}
            sx={{
              width: 100,
              color: theme.palette.audioPlayer.slider,
            }}
          />
        </Box>
      </Box>

      <audio ref={audioRef} />
    </Box>
  );
};

// Define prop types
AudioPlayer.propTypes = {
  episode: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      episode: PropTypes.number.isRequired,
      file: PropTypes.string.isRequired,
  }),
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onSkipNext: PropTypes.func.isRequired,
  onSkipPrevious: PropTypes.func.isRequired,
  playingShow: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      genres: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.string)
      ]),
      seasons: PropTypes.arrayOf(PropTypes.shape({
          episodes: PropTypes.arrayOf(PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string,
              episode: PropTypes.number.isRequired,
              file: PropTypes.string.isRequired,
          }))
      }))
  }),
};


export default AudioPlayer;