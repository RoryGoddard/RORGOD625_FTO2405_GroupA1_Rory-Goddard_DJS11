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
    Chip,
} from '@mui/material';
import PropTypes from 'prop-types';
import LoadingSpinner from '../pages/LoadingSpinner';
import ErrorPage from '../pages/ErrorPage';
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavourite } from '../state/favouritesSlice';


const PodcastDetailsModal = ({ show, open, onClose, onPlayEpisode, loading, fetching, error, toggleFavorite, favoriteEpisodes, episodeTimestamps }) => {
    const dispatch = useDispatch()
    const favourites = useSelector((state) => state.favourites)

    const timestamps = useSelector((state) => state.audioPlayer.timestamps)
    const listenedEpisodes = useSelector((state) => state.audioPlayer.listenedEpisodes)
    const [ selectedSeason, setSelectedSeason ] = useState(null)
    const [imageLoading, setImageLoading] = useState(true)

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

    useEffect(() => {
        setImageLoading(true);
    }, [selectedSeason, show]);

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

    // const isFavorite = (episode) => {
    //     return favoriteEpisodes.some(fav => 
    //         fav.showId === show.id && 
    //         fav.episodeTitle === episode.title && 
    //         fav.seasonTitle === selectedSeason.title
    //     );
    // };

    // const isListened = (episode) => {
    //     return listenedEpisodes.some(listened => 
    //         listened.showId === show.id && 
    //         listened.episodeTitle === episode.title
    //     );
    // };

    const handleSeasonChange = (event) => {
        const season = show.seasons.find(s => s.season === event.target.value);
        setSelectedSeason(season);
    };

    return (
        <>
            {error && <ErrorPage />}
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
                    {(loading || fetching) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : show ? (
                        <>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                                <Box sx={{ width: '30%', mr: 2, position: 'relative' }}>
                                    {imageLoading && <LoadingSpinner/>}
                                    <img
                                        src={selectedSeason ? selectedSeason.image : show.image}
                                        alt={show.title}
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            objectFit: 'contain',
                                            display: imageLoading ? 'none' : 'block' 
                                        }}
                                        onLoad={() => setImageLoading(false)}
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
                                        {show.genres.length > 0 ? (
                                            show.genres.map((genre, index) => (
                                                <Chip key={index} label={genre.title} sx={{ mr: 1, mb: 1 }} />
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
                                   
                                </List>
                            </Box>
                            <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
                        </>
                    ) : (
                        <Typography>Failed to load show details.</Typography>
                    )}
                </Box>
            </Modal>
        </>
    );
};

PodcastDetailsModal.propTypes = {
    show: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // onPlayEpisode: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    // toggleFavorite: PropTypes.func.isRequired,
    // favoriteEpisodes: PropTypes.array.isRequired,
    // listenedEpisodes: PropTypes.array.isRequired,
    // episodeTimestamps: PropTypes.object.isRequired,
};

export default PodcastDetailsModal;
