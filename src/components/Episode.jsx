import {
    Typography,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material';

const Episode = () => {

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