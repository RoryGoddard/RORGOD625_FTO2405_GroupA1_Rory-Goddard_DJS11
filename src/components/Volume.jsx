import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import { useState } from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { audioService } from '../services/AudioService';

const Volume = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const theme = useTheme();

    const changeVolume = (volume) => {
        audioService.setVolume(volume);
        setVolume(volume);
    }

    const toggleMute = () => {
        setIsMuted((prevIsMuted) => {
            const newIsMuted = !prevIsMuted;
            const newVolume = newIsMuted? 0 : 0.5;
            changeVolume(newVolume);
            return newIsMuted;
        });
    };
  
    const handleVolumeChange = (_, newValue) => {
        changeVolume(newValue);
        setIsMuted(newValue === 0);
    };

    return (<Box sx={{ display: 'flex', alignItems: 'center', width: '140px', mr: "0.5rem" }}>
        <IconButton onClick={toggleMute} sx={{ 
        padding: '8px',
        width: '48px',
        height: '48px',
        '& .MuiIconButton-root': { padding: 0 }
        }}>
        {isMuted ? <VolumeMuteIcon sx={{ fontSize: '2rem' }} /> : volume > 0.5 ? <VolumeUpIcon sx={{ fontSize: '2rem' }} /> : <VolumeDownIcon  sx={{ fontSize: '2rem' }}/>}
        </IconButton>
        <Slider
        value={volume}
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
    )
}

export default Volume