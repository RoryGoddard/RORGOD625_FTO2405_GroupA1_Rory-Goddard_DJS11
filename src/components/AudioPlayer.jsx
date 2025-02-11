import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEpisode, setIsPlaying, skipToNextEpisode, skipToPreviousEpisode, setEpisodeAsListened, setDuration, setCurrentTime, saveTimestamp } from '../state/audioPlayerSlice'
import Volume from './Volume'

const AudioPlayer = ({ onEpisodeComplete, updateEpisodeTimestamp }) => {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef(null);
    const theme = useTheme();

    // Redux
    const dispatch = useDispatch()
    const isPlaying = useSelector((state) => state.audioPlayer.isPlaying)
    const currentEpisode = useSelector((state) => state.audioPlayer.currentEpisode)
    const playingShow = useSelector((state) => state.audioPlayer.playingShow);
    const currentTime = useSelector((state) => state.audioPlayer.currentTime);
    const duration = useSelector((state) => state.audioPlayer.duration);

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
        if (playingShow && currentEpisode) {
          updateEpisodeTimestamp(playingShow.id, currentEpisode.title, Math.floor(audio.currentTime));
        }
      };
  
      audio.addEventListener('timeupdate', handleTimeUpdate);
  
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }, [playingShow, currentEpisode, updateEpisodeTimestamp]);

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

    // Effect to handle episode changes
    useEffect(() => {
        if (currentEpisode && audioRef.current) {
            setIsLoaded(false);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = currentEpisode.file;
            
            audioRef.current.addEventListener('loadeddata', () => {
                setIsLoaded(true);
                // If isPlaying is true, start playing the new episode
                if (isPlaying) {
                    audioRef.current.play().catch(error => 
                        console.error("Playback failed", error)
                    );
                }
            }, { once: true });
        }
    }, [currentEpisode, isPlaying]);

    // Effect to update timestamp in Redux
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleTimeUpdate = () => {
          if (playingShow && currentEpisode) {
              const currentTime = Math.floor(audio.currentTime);
              dispatch(setCurrentTime(currentTime));
              // Update timestamp in Redux/localStorage
              dispatch(saveTimestamp({
                  episodeId: `${playingShow.id}-${currentEpisode.title}`,
                  timestamp: currentTime
              }));
          }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }, [playingShow, currentEpisode, dispatch]);


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

    // Handle episode completion
    const handleEpisodeEnd = () => {
        if (currentEpisode && playingShow) {
            dispatch(setEpisodeAsListened({
                show: playingShow.id,
                episode: {
                  showId: playingShow.id,
                  showTitle: playingShow.title,
                  episodeTitle: currentEpisode.title,
                  listenedAt: new Date().toISOString()
                }
            }));
            dispatch(skipToNextEpisode());
        }
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
          {currentEpisode && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Now Playing: {currentEpisode.title}
              </Typography>
            )}
          </Box> {/* Spacer */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <IconButton onClick={() => dispatch(skipToPreviousEpisode())} sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              <SkipPreviousIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
            <IconButton onClick={() => dispatch(setIsPlaying(!isPlaying))} disabled={!isLoaded}  sx={{ 
              padding: '12px',
              width: '72px',
              height: '72px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              {isPlaying ? <PauseIcon sx={{ fontSize: '3rem' }} /> : <PlayArrowIcon sx={{ fontSize: '3rem' }} />}
            </IconButton>
            <IconButton onClick={() => dispatch(skipToNextEpisode())} sx={{ 
              mt: '12px',
              padding: '8px',
              width: '48px',
              height: '48px',
              '& .MuiIconButton-root': { padding: 0 }
            }}>
              <SkipNextIcon sx={{ fontSize: '2rem' }}/>
            </IconButton>
          </Box>
          <Volume audioRef={audioRef}/>
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