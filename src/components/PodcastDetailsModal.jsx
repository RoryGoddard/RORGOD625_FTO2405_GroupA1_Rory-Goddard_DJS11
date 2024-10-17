import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';

const PodcastDetailsModal = ({ show, genres, open, onClose, onPlayEpisode }) => {
    const [detailedShow, setDetailedShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(null);

    useEffect(() => {
        if (open && show) {
            setLoading(true);
            fetch(`https://podcast-api.netlify.app/id/${show.id}`)
                .then(response => response.json())
                .then(data => {
                    setDetailedShow(data);
                    setSelectedSeason(data.seasons[0]);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching show details:', error);
                    setLoading(false);
                });
        }
    }, [open, show]);

    const handleSeasonChange = (event) => {
        const season = detailedShow.seasons.find(s => s.season === event.target.value);
        setSelectedSeason(season);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getGenreTitles = () => {
        return show.genres.map(genreId => {
          const genre = genres.find(g => g.id === genreId);
          return genre ? genre.title : 'Unknown Genre';
        });
      };

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
                border: '2px solid #000',
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
                ) : detailedShow ? (
                    <>
                        <Box sx={{ display: 'flex', mb: 2 }}>
                            <Box sx={{ width: '30%', mr: 2 }}>
                                <img 
                                    src={selectedSeason ? selectedSeason.image : detailedShow.image} 
                                    alt={detailedShow.title} 
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                                />
                            </Box>
                            <Box sx={{ width: '70%' }}>
                                <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
                                    {detailedShow.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, maxHeight: '100px', overflow: 'auto' }}>
                                    {detailedShow.description}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {genres && getGenreTitles()
                                    .map((genre, index) => (
                                        <Chip key={index} label={genre} sx={{ mr: 1, mb: 1 }} />
                                    ))}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Updated: {formatDate(detailedShow.updated)}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                }}>
                                    <Select
                                        value={selectedSeason ? selectedSeason.season : ''}
                                        onChange={handleSeasonChange}
                                        sx={{ minWidth: 120, mr: 2 }}
                                    >
                                        {detailedShow.seasons.map((season) => (
                                            <MenuItem key={season.season} value={season.season}>
                                                Season {season.season}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant="body1" component="p">
                                        Episodes: {selectedSeason.episodes.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <List>
                                {selectedSeason && selectedSeason.episodes.map((episode) => (
                                    <ListItem key={episode.episode} divider>
                                        <ListItemText
                                            primary={`Episode ${episode.episode}: ${episode.title}`}
                                            secondary={episode.description}
                                        />
                                        <ListItemSecondaryAction>
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
};

export default PodcastDetailsModal;