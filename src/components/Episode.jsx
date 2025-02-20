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
import { saveTimestamp, setEpisodeAsListened, selectIsListened, setCurrentEpisode, setIsPlaying, setPlayingShow, generatePlaylist, playEpisode } from '../state/audioPlayerSlice';
import { selectIsFavourite } from "../state/favouritesSlice";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types'
import { dateAndTime } from '../utils/dateAndTime';

const Episode = ({ show, episode, selectedSeason }) => {
    const isFavourite = useSelector(state => selectIsFavourite(state, show.id, selectedSeason.season, episode.episode));
    const isListened = useSelector(state => selectIsListened(state, show.id, selectedSeason.season, episode.episode));
    const playingShow = useSelector((state) => state.podcasts.selectedPodcastData);
    const timestamps = useSelector((state) => state.audioPlayer.timestamps);
    const dispatch = useDispatch();

    const handlePlayEpisode = (episodeDetails) => {
        dispatch(playEpisode(episodeDetails))
        dispatch(setPlayingShow(playingShow))
    }

    const episodeDetails = {
        showId: show.id,
        showTitle: show.title,
        seasonTitle: selectedSeason.title,
        season: selectedSeason.season,
        title: episode.title,
        episode: episode.episode,
        file: episode.file,
        updated: show.updated,
        savedAt: dateAndTime()
    }

    const handleToggleFavourite = () => {
        console.log("Episode details are", episodeDetails.savedAt)
        dispatch(toggleFavourite(episodeDetails));
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (                             
        <ListItem key={show.id + episode.episode} divider>
            <IconButton onClick={() => handleToggleFavourite(episode)}>
                { isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
                <IconButton edge="end" aria-label="play" onClick={() => handlePlayEpisode(episodeDetails)}>
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