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

const AudioPlayer = ({ episode, isPlaying, onPlayPause, onSkipNext, onSkipPrevious, playingShow, onEpisodeComplete }) => {
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(error => console.error("Playback failed", error));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (episode) {
            audioRef.current.src = episode.file;
            if (isPlaying) {
                audioRef.current.play().catch(error => console.error("Playback failed", error));
            }
        }
    }, [episode, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        }
    };

    const handleProgressChange = (event, newValue) => {
        const time = (newValue / 100) * (audioRef.current.duration || 0);
        audioRef.current.currentTime = time;
        setProgress(newValue);
    };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        setIsMuted(newValue === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
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
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', p: 2 }}>
            <audio 
                ref={audioRef} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEpisodeEnd}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton onClick={onSkipPrevious}>
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton onClick={() => onPlayPause(!isPlaying)}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={onSkipNext}>
                    <SkipNextIcon />
                </IconButton>
                <Box sx={{ width: '100%', ml: 2, mr: 2 }}>
                    <Slider
                        value={progress}
                        onChange={handleProgressChange}
                        aria-labelledby="progress-slider"
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '150px' }}>
                    <IconButton onClick={toggleMute}>
                        {isMuted ? <VolumeMuteIcon /> : volume > 0.5 ? <VolumeUpIcon /> : <VolumeDownIcon />}
                    </IconButton>
                    <Slider
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        aria-labelledby="volume-slider"
                        min={0}
                        max={1}
                        step={0.01}
                        sx={{ ml: 1 }}
                    />
                </Box>
            </Box>
            {episode && (
                <Typography variant="body2" color="text.secondary">
                    Now Playing: {episode.title}
                </Typography>
            )}
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
  onEpisodeComplete: PropTypes.func.isRequired,
};


export default AudioPlayer;