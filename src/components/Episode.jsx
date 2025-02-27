import {
    Typography,
    ListItem,
    ListItemText,
    IconButton,
    Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavourite } from '../state/favouritesSlice';
import { saveTimestamp, setEpisodeAsListened, selectIsListened, setPlayingShow, playEpisode } from '../state/audioPlayerSlice';
import { selectIsFavourite } from "../state/favouritesSlice";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types'
import { dateAndTime } from '../utils/dateAndTime';

const Episode = ({ episode }) => {
    const isFavourite = useSelector(state => selectIsFavourite(state, episode));
    const isListened = useSelector(state => selectIsListened(state, episode));
    console.log("is listened selector is:", isListened)
    console.log("is favourite selector is:", isFavourite)
    const playingShow = useSelector((state) => state.podcasts.selectedPodcastData);
    const timestamps = useSelector((state) => state.audioPlayer.timestamps);
    const dispatch = useDispatch();

    const handlePlayEpisode = (episodeDetails) => {
        dispatch(playEpisode(episodeDetails))
        dispatch(setPlayingShow(playingShow))
    }

    const handleToggleFavourite = (episode) => {
        const savedEpisode = {...episode, savedAt: dateAndTime()}
        console.log("Episode details are", episode.savedAt)
        dispatch(toggleFavourite(savedEpisode));
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (                             
        <ListItem 
            key={episode.showId + episode.episode} 
            divider
            secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isListened && <CheckCircleIcon color="inherit" />}
                    <IconButton edge="end" aria-label="play" onClick={() => handlePlayEpisode(episode)}>
                        <PlayArrowIcon />
                    </IconButton>
                </Box>
            }
        >
            <IconButton onClick={() => handleToggleFavourite(episode)}>
                { isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <ListItemText
                primary={`Episode ${episode.episode}: ${episode.title}`}
                secondary={
                <>
                    {episode.description}
                    {timestamps[episode.showId] && timestamps[episode.showId][episode.title] && (
                    <Typography variant="caption" display="block">
                        Last played: {formatTime(timestamps[episode.showId][episode.title])}
                    </Typography>
                    )}
                </>
                }
            />
        </ListItem>
    )
}

Episode.propTypes = {
    show: PropTypes.object,
    episode: PropTypes.object,
    selectedSeason: PropTypes.object
};

export default Episode