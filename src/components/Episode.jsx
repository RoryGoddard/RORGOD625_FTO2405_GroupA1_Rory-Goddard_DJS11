import {
    Typography,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavourite } from '../state/favouritesSlice';
import { saveTimestamp, setEpisodeAsListened } from '../state/audioPlayerSlice';
import { selectIsFavourite } from "../state/favouritesSlice";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Episode = () => {
    const dispatch = useDispatch()
    const favourites = useSelector((state) => state.favourites)

    const timestamps = useSelector((state) => state.audioPlayer.timestamps)
    const listenedEpisodes = useSelector((state) => state.audioPlayer.listenedEpisodes)

    const handleToggleFavourite = (episode) => {
        dispatch(toggleFavourite({
            showId: show.id,
            showTitle: show.title,
            seasonTitle: selectedSeason.title,
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
        <>                                      
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
                {/* {listenedEpisodes.indexOf({
                                    showId: show.id,
                                    showTitle: show.title,
                                    seasonTitle: selectedSeason.title,
                                    episodeTitle: episode.title,
                                    episodeNumber: episode.episode,
                                    updated: show.updated
                                    }) !== -1 && (
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                )} */}
                <IconButton edge="end" aria-label="play" onClick={() => onPlayEpisode(episode)}>
                <PlayArrowIcon />
                </IconButton>
            </ListItemSecondaryAction>
            </ListItem>
        </>
    )
}

export default Episode