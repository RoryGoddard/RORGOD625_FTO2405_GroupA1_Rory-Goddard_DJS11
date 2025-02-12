import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlayPause, setCurrentEpisode, setIsPlaying, skipToNextEpisode, skipToPreviousEpisode, setEpisodeAsListened, setDuration, setCurrentTime, saveTimestamp, generatePlaylist } from '../state/audioPlayerSlice'
import Volume from './Volume'
import AudioSlider from './AudioSlider';

const AudioPlayer = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef(null);
    const theme = useTheme();

    // Redux
    const dispatch = useDispatch()
    const isPlaying = useSelector((state) => state.audioPlayer.isPlaying)
    const currentEpisode = useSelector((state) => state.audioPlayer.currentEpisode)
    const playingShow = useSelector((state) => state.audioPlayer.playingShow);
    const playlistExists = useSelector((state) => state.audioPlayer.playlist)

    // Handle play/pause
    useEffect(() => {
        if (audioRef.current && isLoaded) {
            if (isPlaying) {
                dispatch(setDuration(audioRef.current.duration))
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("Playback failed", error));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isLoaded, dispatch]);

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
                  episodeId: `${playingShow.id}-${currentEpisode.episodeTitle}`,
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
            console.log("current progress state is", currentProgress)
        }
    };


    // Handle episode completion
    const handleEpisodeEnd = () => {
        if (currentEpisode && playingShow) {
          console.log("This is playing show", playingShow)
            dispatch(setEpisodeAsListened({
                show: playingShow.id,
                episode: {
                  showId: playingShow.id,
                  showTitle: playingShow.title,
                  episodeTitle: currentEpisode.episodeTitle,
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
        <AudioSlider audio={audioRef}/>
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
            <IconButton onClick={() => dispatch(togglePlayPause())} disabled={!isLoaded}  sx={{ 
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