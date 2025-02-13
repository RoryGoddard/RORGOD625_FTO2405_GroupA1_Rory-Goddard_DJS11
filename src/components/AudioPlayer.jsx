import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { playEpisode, generatePlaylist, togglePlayPause, skipToNextEpisode, skipToPreviousEpisode, setCurrentTime } from '../state/audioPlayerSlice'
import Volume from './Volume'
import AudioSlider from './AudioSlider';
import { audioService } from '../services/AudioService';

const AudioPlayer = () => {
    const theme = useTheme();

    // Redux
    const dispatch = useDispatch()
    const isPlaying = useSelector((state) => state.audioPlayer.isPlaying)
    const currentEpisode = useSelector((state) => state.audioPlayer.currentEpisode)

    useEffect(() => {
      // Set up one-time event listeners
      audioService.onTimeUpdate(() => {
          dispatch(setCurrentTime(audioService.getCurrentTime()));
      });
      
      audioService.onEnded(() => {
          dispatch(skipToNextEpisode());
      });
    }, [dispatch]);  

    const handlePlayPause = () => {
      console.log("currentEpisode is:", currentEpisode)
      // If no episode is playing yet but we have a currentEpisode selected
      if (!isPlaying && currentEpisode) {
          dispatch(playEpisode(currentEpisode));
      } 
      // If we're already playing or paused
      else {
          dispatch(togglePlayPause());
      }
  
      // Generate playlist if needed
      // if (!playlistExists) {
      //     dispatch(generatePlaylist());
      // }
    }

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
        <AudioSlider />
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
            <IconButton onClick={() => handlePlayPause()} disabled={!currentEpisode}  sx={{ 
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
          <Volume />
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