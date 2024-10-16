import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const PodcastDetailsModal = ({ show, open, onClose }) => {
    const [detailedShow, setDetailedShow] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && show) {
            setLoading(true);
            // Replace this with your actual API call
            fetch(`https://podcast-api.netlify.app/id/${show.id}`)
                .then(response => response.json())
                .then(data => {
                    setDetailedShow(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching show details:', error);
                    setLoading(false);
                });
        }
    }, [open, show]);

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
                width: '80%',
                maxWidth: 600,
                maxHeight: '80%',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : detailedShow ? (
                    <Box sx={{ width: '100%', maxHeight: '100%', overflow: 'auto' }}>
                        <Typography id="podcast-details-modal" variant="h5" component="h2">
                            {detailedShow.title}
                        </Typography>
                        <img src={detailedShow.image} alt={detailedShow.title} style={{ width: '100%', marginTop: 16 }} />
                        <Typography id="podcast-details-description" sx={{ mt: 2 }}>
                            {detailedShow.description}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Seasons: {detailedShow.seasons.length}
                        </Typography>
                        {/* Add more details as needed */}
                        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
                    </Box>
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
};

export default PodcastDetailsModal;