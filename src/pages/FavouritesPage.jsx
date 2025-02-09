import { Box, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavourite } from '../state/favouritesSlice';

const FavoritesPage = () => {
    const favouriteEpisodes = useSelector((state) => state.favourites.searchedAndSortedFavourites);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                    <>
                        <ListItem key={`${fav.showId}-${fav.episodeTitle}`}>
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
                                    <IconButton edge="end" aria-label="delete" onClick={() => dispatch(toggleFavourite(fav))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </Box>
                        </ListItem>
                        {index < favouriteEpisodes.length - 1 && <Divider />}
                    </>
                ))}
            </List>
        </Box>
    );
};

export default FavoritesPage;
