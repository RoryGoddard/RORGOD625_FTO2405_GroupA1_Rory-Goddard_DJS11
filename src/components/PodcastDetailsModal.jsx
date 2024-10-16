import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PodcastDetailsModal = ({ show, genres, open, onClose, onPlayEpisode, loading, toggleFavorite, favoriteEpisodes, listenedEpisodes, episodeTimestamps }) => {
    const [selectedSeason, setSelectedSeason] = useState(null);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      };

    useEffect(() => {
        if (show && show.seasons && Array.isArray(show.seasons)) {
            setSelectedSeason(show.seasons[0]);
        }
    }, [show]);

    const handleToggleFavorite = (episode) => {
        toggleFavorite({
            showId: show.id,
            showTitle: show.title,
            seasonTitle: selectedSeason.title,
            episodeTitle: episode.title,
            episodeNumber: episode.episode,
            updated: show.updated
        });
    };

    const isFavorite = (episode) => {
        return favoriteEpisodes.some(fav => 
            fav.showId === show.id && 
            fav.episodeTitle === episode.title && 
            fav.seasonTitle === selectedSeason.title
        );
    };

    const isListened = (episode) => {
        return listenedEpisodes.some(listened => 
            listened.showId === show.id && 
            listened.episodeTitle === episode.title
        );
    };

    const handleSeasonChange = (event) => {
        const season = show.seasons.find(s => s.season === event.target.value);
        setSelectedSeason(season);
    };

    const showGenres = genres.filter(genre =>
        genre.shows.includes(show.id)
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="podcast-details-modal"
            aria-describedby="podcast-details-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 800,
                maxHeight: '90vh',
                bgcolor: 'background.paper',
                border: '2px solid #000000',
                borderRadius: "2%",
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : show ? (
                    <>
                        <Box sx={{ display: 'flex', mb: 2 }}>
                            <Box sx={{ width: '30%', mr: 2 }}>
                                <img
                                    src={selectedSeason ? selectedSeason.image : show.image}
                                    alt={show.title}
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                />
                            </Box>
                            <Box sx={{ width: '70%' }}>
                                <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
                                    {show.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, maxHeight: '100px', overflow: 'auto' }}>
                                    {show.description}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {showGenres.length > 0 ? (
                                        showGenres.map((genre) => (
                                            <Chip key={genre.id} label={genre.title} sx={{ mr: 1, mb: 1 }} />
                                        ))
                                    ) : (
                                        <Typography>No genres available</Typography>
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Updated: {(new Date(show.updated)).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour12: false,
                                })}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                }}>
                                    {Array.isArray(show.seasons) && (
                                        <Select
                                            value={selectedSeason ? selectedSeason.season : ''}
                                            onChange={handleSeasonChange}
                                            sx={{ minWidth: 120, mr: 2 }}
                                        >
                                            {show.seasons.map((season) => (
                                                <MenuItem key={season.season} value={season.season}>
                                                    Season {season.season}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                    <Box>
                                        {Array.isArray(selectedSeason?.episodes) ? (
                                            <Typography variant="body1" component="p">
                                                Episodes: {selectedSeason.episodes.length}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1" component="p">
                                                No episodes available
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                        <List>
                            {selectedSeason && selectedSeason.episodes.map((episode) => (
                                <ListItem key={episode.episode} divider>
                                <IconButton onClick={() => handleToggleFavorite(episode)}>
                                    {isFavorite(episode) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                                <ListItemText
                                    primary={`Episode ${episode.episode}: ${episode.title}`}
                                    secondary={
                                    <>
                                        {episode.description}
                                        {episodeTimestamps[show.id] && episodeTimestamps[show.id][episode.title] && (
                                        <Typography variant="caption" display="block">
                                            Last played: {formatTime(episodeTimestamps[show.id][episode.title])}
                                        </Typography>
                                        )}
                                    </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    {isListened(episode) && (
                                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                                    )}
                                    <IconButton edge="end" aria-label="play" onClick={() => onPlayEpisode(episode)}>
                                    <PlayArrowIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            </List>
                        </Box>
                        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
                    </>
                ) : (
                    <Typography>Failed to load show details.</Typography>
                )}
            </Box>
        </Modal>
    );
};

PodcastDetailsModal.propTypes = {
    show: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPlayEpisode: PropTypes.func.isRequired,
    genres: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    })).isRequired,
    loading: PropTypes.bool.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    favoriteEpisodes: PropTypes.array.isRequired,
    listenedEpisodes: PropTypes.array.isRequired,
    episodeTimestamps: PropTypes.object.isRequired,
};

export default PodcastDetailsModal;
