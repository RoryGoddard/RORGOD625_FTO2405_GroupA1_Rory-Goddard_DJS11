import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "../utils/sortUtils";
import PropTypes from 'prop-types';

const FavoritesPage = ({ favoriteEpisodes, toggleFavorite, onShowClick, onBackToShows, searchTerm, sortOption, filterOption }) => {
    const [sortedFavorites, setSortedFavorites] = useState([]);

    useEffect(() => {
        let filtered = favoriteEpisodes.filter((fav) =>
            fav.showTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fav.episodeTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let sorted;
        switch (sortOption) {
            case 'A-Z':
                sorted = sortByTitleAscending(filtered, 'showTitle');
                break;
            case 'Z-A':
                sorted = sortByTitleDescending(filtered, 'showTitle');
                break;
            case 'newest':
                sorted = sortByDateDescending(filtered, 'savedAt');
                break;
            case 'oldest':
                sorted = sortByDateAscending(filtered, 'savedAt');
                break;
            default:
                sorted = filtered;
        }

        setSortedFavorites(sorted);
    }, [favoriteEpisodes, searchTerm, sortOption]);

    const handleRemoveFavorite = (episode) => {
        toggleFavorite(episode);
    };

    return (
        <Box sx={{ padding: 2, mb:"160px"}}>
            <Typography variant="h4" gutterBottom>
                Your Favorite Episodes
            </Typography>
            <Button variant="outlined" onClick={onBackToShows} sx={{ mb: 2 }}>
                Back to Shows
            </Button>
            <List>
                {sortedFavorites.map((fav, index) => (
                    <React.Fragment key={`${fav.showId}-${fav.episodeTitle}`}>
                        <ListItem>
                            <ListItemText
                                primary={fav.showTitle}
                                secondary={`${fav.seasonTitle} - Episode ${fav.episodeNumber} - ${fav.episodeTitle}`}
                            />
                            <Box>
                                <ListItemText sx={{mr:"2rem"}} secondary={"Added: " + ((new Date(fav.savedAt)).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                }))}/>
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFavorite(fav)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </Box>
                        </ListItem>
                        {index < sortedFavorites.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

FavoritesPage.propTypes = {
    favoriteEpisodes: PropTypes.arrayOf(
      PropTypes.shape({
        showId: PropTypes.string.isRequired,
        showTitle: PropTypes.string.isRequired,
        seasonTitle: PropTypes.string.isRequired,
        episodeTitle: PropTypes.string.isRequired,
        episodeNumber: PropTypes.number.isRequired,
        savedAt: PropTypes.string.isRequired,
      })
    ).isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    onShowClick: PropTypes.func.isRequired,
    onBackToShows: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    sortOption: PropTypes.oneOf(['A-Z', 'Z-A', 'newest', 'oldest']).isRequired,
    filterOption: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  };
  

export default FavoritesPage;