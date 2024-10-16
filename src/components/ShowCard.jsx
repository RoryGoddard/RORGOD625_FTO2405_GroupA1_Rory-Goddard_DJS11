import { Paper, CardMedia, Typography, Box} from '@mui/material';
import PropTypes from "prop-types";

export default function ShowCard({ title, description, seasons, image, genres, updated }) {
    return (
        <Paper>
            <CardMedia
                component="img"
                image={image}
                alt={"Show Image for" + {title}}
                sx={{
                height: "100%", // You can set fixed height, or use width depending on your needs
                objectFit: 'cover',
                }}
            />
            <Box 
            sx={{
                m: "0.5rem"
            }}>
                <Box 
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: "0.25rem",
                    mb: "0.25rem"
                    }}>
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography variant="susbtitle2" component="p" color="text.secondary" sx={{
                        mt: "0.25rem",
                        ml: "1rem",
                        textWrap: "nowrap"
                    }}>
                        {seasons} Seasons
                    </Typography>
                </Box>
                <Box 
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: "0.25rem",
                    mb: "0.25rem"
                    }}>
                    <Typography variant="body2" component="h2" color="text.disabled">
                        {genres}
                    </Typography>
                    <Typography variant="body2" component="h2" color="text.disabled">
                        {"Updated: " + new Date(updated).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box 
                sx={{
                    paddingTop: "0.5rem",
                    paddingBottom: "1rem",
                }}>
                    <Typography variant="body2" color="text.secondary" 
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3, // Number of lines of description shown before elipses
                    }}>
                        {description}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}



// Define Prop Types for ShowCard component
ShowCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    seasons: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    genres: PropTypes.array.isRequired,
    updated: PropTypes.string.isRequired
}
