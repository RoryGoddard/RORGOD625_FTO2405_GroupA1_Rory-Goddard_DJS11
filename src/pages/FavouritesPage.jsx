import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "../utils/sortUtils";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const FavoritesPage = ({ toggleFavorite, onBackToShows, searchQuery }) => {
    const favoriteEpisodes = useSelector((state) => state.favourites)

    const [sortedFavorites, setSortedFavorites] = useState([]);

    useEffect(() => {
        let filtered = favoriteEpisodes.filter((fav) =>
            fav.showTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fav.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase())
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
                sorted = sortByDateDescending(filtered, 'updated'); // Change to 'updated'
                break;
            case 'oldest':
                sorted = sortByDateAscending(filtered, 'updated'); // Change to 'updated'
                break;
            default:
                sorted = filtered;
        }

        setSortedFavorites(sorted);
    }, [favoriteEpisodes, searchQuery, sortOption]);

    const handleRemoveFavorite = (episode) => {
        toggleFavorite(episode);
    };

    return (
        <Box sx={{ padding: 2, mt: "4rem", mb: "6rem" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Your Favorite Episodes
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="outlined" onClick={onBackToShows}>
                        Back to Shows
                    </Button>
                </Box>
            </Box>
            <List sx={{ mb: "3rem" }}>
                {sortedFavorites.map((fav, index) => (
                    <React.Fragment key={`${fav.showId}-${fav.episodeTitle}`}>
                        <ListItem>
                            <ListItemText
                                primary={fav.showTitle}
                                secondary={`${fav.seasonTitle} - Episode ${fav.episodeNumber} - ${fav.episodeTitle}`}
                            />
                            <Box sx={{display: "flex", flexDirection:'column', justifyContent:'center', alignItems: "center", textAlign: "end", whiteSpace: "nowrap"}}>
                                <ListItemText sx={{ mr: "2rem" }} secondary={"Added: " + ((new Date(fav.savedAt)).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                    textAlign: "end"
                                }))} />
                                <ListItemText sx={{ mr: "2rem" }} secondary={"Updated: " + ((new Date(fav.updated)).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                    textAlign: "end"
                                }))} />
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

// FavoritesPage.propTypes = {
//     favoriteEpisodes: PropTypes.arrayOf(
//         PropTypes.shape({
//             showId: PropTypes.string.isRequired,
//             showTitle: PropTypes.string.isRequired,
//             seasonTitle: PropTypes.string.isRequired,
//             episodeTitle: PropTypes.string.isRequired,
//             episodeNumber: PropTypes.number.isRequired,
//             savedAt: PropTypes.string.isRequired,
//             updated: PropTypes.string.isRequired, // Ensure updated is included
//         })
//     ).isRequired,
//     toggleFavorite: PropTypes.func.isRequired,
//     onBackToShows: PropTypes.func.isRequired,
//     searchQuery: PropTypes.string.isRequired,
//     sortOption: PropTypes.oneOf(['A-Z', 'Z-A', 'newest', 'oldest']).isRequired,
// };

export default FavoritesPage;
