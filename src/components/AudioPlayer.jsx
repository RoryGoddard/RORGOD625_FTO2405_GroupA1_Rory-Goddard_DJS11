import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEpisode, setIsPlaying, setEpisodeAsListened, setDuration, setCurrentTime } from '../state/audioPlayerSlice'

const AudioPlayer = ({ episode, isPlaying, onPlayPause, onSkipNext, onSkipPrevious, playingShow, onEpisodeComplete, updateEpisodeTimestamp }) => {
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const dispatch = useDispatch()

    const toggleMute = () => {
      setIsMuted(!isMuted);
    };

    const handleVolumeChange = (event, newValue) => {
      setVolume(newValue);
      setIsMuted(newValue === 0);
  };


    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef(null);
    const theme = useTheme();




    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

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

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
  
      const handleTimeUpdate = () => {
        if (playingShow && episode) {
          updateEpisodeTimestamp(playingShow.id, episode.title, Math.floor(audio.currentTime));
        }
      };
  
      audio.addEventListener('timeupdate', handleTimeUpdate);
  
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }, [playingShow, episode, updateEpisodeTimestamp]);

    // Handle play/pause
    useEffect(() => {
        if (audioRef.current && isLoaded) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("Playback failed", error));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isLoaded]);

    // Handle episode change
    useEffect(() => {
        if (episode && audioRef.current) {
            setIsLoaded(false);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = episode.file;
            
            // Wait for audio to be loaded before attempting to play
            audioRef.current.addEventListener('loadeddata', () => {
                setIsLoaded(true);
            }, { once: true });
        }
    }, [episode]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
            setProgress(currentProgress);
        }
    };

    const handleProgressChange = (event, newValue) => {
        if (audioRef.current) {
            const time = (newValue / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
        setProgress(newValue);
    };

    const handleEpisodeEnd = () => {
        if (episode && playingShow) {
            onEpisodeComplete({
                showId: playingShow.id,
                showTitle: playingShow.title,
                episodeTitle: episode.title,
                listenedAt: new Date().toISOString()
            });
        }
        onSkipNext();
    };

    return (
      <Box     sx={{
        backgroundColor: theme.palette.audioPlayer.background,
        color: theme.palette.audioPlayer.color,
        width: '100%',
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.5rem',
      }}>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEpisodeEnd}
        />
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

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ width: '140px', ml: "0.5rem" }}>
          {episode && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Now Playing: {episode.title}
              </Typography>
            )}
          </Box> {/* Spacer */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <IconButton onClick={onSkipPrevious} sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              <SkipPreviousIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
            <IconButton onClick={() => onPlayPause(!isPlaying)} disabled={!isLoaded}  sx={{ 
              padding: '12px',
              width: '72px',
              height: '72px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              {isPlaying ? <PauseIcon sx={{ fontSize: '3rem' }} /> : <PlayArrowIcon sx={{ fontSize: '3rem' }} />}
            </IconButton>
            <IconButton onClick={onSkipNext} sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              <SkipNextIcon sx={{ fontSize: '2rem' }}/>
            </IconButton>
          </Box>
          {/* Volume Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '140px', mr: "0.5rem" }}>
            <IconButton onClick={toggleMute} sx={{ 
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              {isMuted ? <VolumeMuteIcon sx={{ fontSize: '2rem' }} /> : volume > 0.5 ? <VolumeUpIcon sx={{ fontSize: '2rem' }} /> : <VolumeDownIcon  sx={{ fontSize: '2rem' }}/>}
            </IconButton>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-labelledby="volume-slider"
              min={0}
              max={1}
              step={0.01}
              sx={{
                width: 100,
                color: theme.palette.audioPlayer.slider,
              }}
            />
          </Box>
        </Box>
      </Box>
    );
}

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
    onEpisodeComplete: PropTypes.func.isRequired,
    updateEpisodeTimestamp: PropTypes.func.isRequired
};

export default AudioPlayer;