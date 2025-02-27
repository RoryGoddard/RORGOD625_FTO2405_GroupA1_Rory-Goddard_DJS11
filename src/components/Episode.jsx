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
import { selectIsListened, setPlayingShow, playEpisode } from '../state/audioPlayerSlice';
import { selectIsFavourite } from "../state/favouritesSlice";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types'
import { dateAndTime } from '../utils/dateAndTime';

const Episode = ({ episode }) => {
    const isFavourite = useSelector(state => selectIsFavourite(state, episode));
    const isListened = useSelector(state => selectIsListened(state, episode));
    const playingShow = useSelector((state) => state.podcasts.selectedPodcastData);
    const timestamps = useSelector((state) => state.audioPlayer.timestamps);
    const dispatch = useDispatch();

    const handlePlayEpisode = (episodeDetails) => {
        dispatch(playEpisode(episodeDetails))
        dispatch(setPlayingShow(playingShow))
    }

    const handleToggleFavourite = (episode) => {
        const savedEpisode = {...episode, savedAt: dateAndTime()}
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
                    {timestamps.some(ep => ep.episodeId === episode.episodeId) && (
                        <Typography variant="caption" display="block">
                            Last played: {formatTime(
                            timestamps.find(prevEpisode => prevEpisode.episodeId === episode.episodeId)?.timestamp || 0
                            )}
                        </Typography>
                        )}
                </>
                }
            />
        </ListItem>
    )
}

Episode.propTypes = {
    episode: PropTypes.object,
};

export default Episode