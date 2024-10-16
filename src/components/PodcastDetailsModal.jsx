import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';

const PodcastDetailsModal = ({ show, open, onClose, onPlayEpisode }) => {
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
                maxHeight: '90%',
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
                        <img 
                            src={selectedSeason ? selectedSeason.image : detailedShow.image} 
                            alt={detailedShow.title} 
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} 
                        />
                        <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
                            {detailedShow.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                            {detailedShow.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 2 }}>Season:</Typography>
                            <Select
                                value={selectedSeason ? selectedSeason.season : ''}
                                onChange={handleSeasonChange}
                                sx={{ minWidth: 120 }}
                            >
                                {detailedShow.seasons.map((season) => (
                                    <MenuItem key={season.season} value={season.season}>
                                        Season {season.season}
                                    </MenuItem>
                                ))}
                            </Select>
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
};

export default PodcastDetailsModal;