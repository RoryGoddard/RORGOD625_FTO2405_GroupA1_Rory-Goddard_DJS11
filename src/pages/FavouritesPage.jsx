import { Box, Typography, Button, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavourite } from '../state/favouritesSlice';
import React from 'react';
import { generateEpisodeId } from '../utils/episodeIdGenerator';

const FavoritesPage = () => {
    const favouriteEpisodes = useSelector((state) => state.favourites.searchedAndSortedFavourites);
    console.log("favourite episodes are:", favouriteEpisodes)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("favourite episodes from useSelector are:", favouriteEpisodes)

    return (
        <Box sx={{ padding: 2, mt: "4rem", mb: "6rem" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Your Favorite Episodes
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                        Back to Shows
                    </Button>
                </Box>
            </Box>
            <List sx={{ mb: "3rem" }}>
                {favouriteEpisodes.map((fav, index) => (
                    <React.Fragment key={generateEpisodeId(fav)}>
                        <ListItem secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => dispatch(toggleFavourite(fav))}>
                                <DeleteIcon />
                            </IconButton>
                        }>
                            <ListItemText
                                primary={fav.showTitle}
                                secondary={`${fav.seasonTitle} - Episode ${fav.episode} - ${fav.title}`}
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
                            </Box>
                        </ListItem>
                        {index < favouriteEpisodes.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default FavoritesPage;
