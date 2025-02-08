import {
    Typography,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavourite } from '../state/favouritesSlice';
import { saveTimestamp, setEpisodeAsListened, selectIsListened } from '../state/audioPlayerSlice';
import { selectIsFavourite } from "../state/favouritesSlice";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types'

const Episode = ({ show, episode, selectedSeason }) => {
    const isFavourite = useSelector(state => selectIsFavourite(state, show?.id, episode?.episode));
    const isListened = useSelector(state => selectIsListened(state, show?.id, episode.episode));
    const timestamps = useSelector((state) => state.audioPlayer.timestamps);
    const dispatch = useDispatch();

    const handleToggleFavourite = (episode) => {
        dispatch(toggleFavourite({
            showId: show.id,
            showTitle: show.title,
            seasonTitle: selectedSeason.title,
            seasonNumber: selectedSeason.season,
            episodeTitle: episode.title,
            episodeNumber: episode.episode,
            updated: show.updated
            }));
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (                             
        <ListItem key={episode.episode} divider>
            <IconButton onClick={() => handleToggleFavourite(episode)}>
                { isFavourite ? <FavoriteBorderIcon /> : <FavoriteIcon />}
            </IconButton>
            <ListItemText
                primary={`Episode ${episode.episode}: ${episode.title}`}
                secondary={
                <>
                    {episode.description}
                    {timestamps[show.id] && timestamps[show.id][episode.title] && (
                    <Typography variant="caption" display="block">
                        Last played: {formatTime(timestamps[show.id][episode.title])}
                    </Typography>
                    )}
                </>
                }
            />
            <ListItemSecondaryAction>
                {isListened && (<CheckCircleIcon color="primary" sx={{ mr: 1 }} />)}
                <IconButton edge="end" aria-label="play" onClick={() => onPlayEpisode(episode)}>
                <PlayArrowIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

Episode.propTypes = {
    show: PropTypes.object,
    episode: PropTypes.object,
    selectedSeason: PropTypes.object
};

export default Episode