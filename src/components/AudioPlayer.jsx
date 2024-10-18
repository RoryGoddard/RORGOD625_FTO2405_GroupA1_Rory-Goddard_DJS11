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
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef(null);

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
        }
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
    console.log(episode)

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
                <IconButton onClick={() => onPlayPause(!isPlaying)} disabled={!isLoaded}>
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