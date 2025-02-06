import { Paper, CardMedia, Typography, Box, Chip} from '@mui/material';
import PropTypes from "prop-types";

export default function ShowCard({ title, description, seasons, image, genres, updated, onClick }) {
    
    const seasonText = () => {
        if (seasons > 1) {
            return `${seasons} Seasons`
        } 
        else {
            return `${seasons} Season`
        }   }

    return (
        <Paper onClick={onClick}>
            <CardMedia
                component="img"
                image={image}
                alt={"Show Image for" + {title}}
                sx={{
                height: "100%",
                objectFit: "cover",
                borderRadius: "2%"
                }}
            />
            <Box 
            sx={{
                m: "0.5rem",
            }}>
                <Box 
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: "0.25rem",
                    mb: "0.25rem"
                    }}>
                    <Typography variant="h5" component="h2">
                        {title.replace("&amp;", "&")}
                    </Typography>
                    <Typography variant="susbtitle2" component="p" color="text.secondary" sx={{
                        mt: "0.25rem",
                        ml: "1rem",
                        textWrap: "nowrap"
                    }}>
                        {seasonText()}
                    </Typography>
                </Box>
                <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center", // Ensures vertical alignment
                    mt: "0.25rem",
                    mb: "0.25rem"
                }}
                >
                    <Box
                        sx={{
                        display: "flex", 
                        flexWrap: "wrap", // Allows chips to wrap if needed
                        }}
                    >
                        {genres.map((genre) => (
                        <Chip key={genre.id} label={genre.title} sx={{ mt: "0.25rem", mb: "0.25rem", mr: "0.5rem" }} />
                        ))}
                    </Box>
                    <Typography
                        variant="body2"
                        component="h2"
                        color="text.disabled"
                        sx={{
                        marginLeft: "auto", // Pushes the text to the right
                        whiteSpace: "nowrap" // Prevents the text from wrapping
                        }}
                    >
                        {"Updated: " + new Date(updated).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour12: false,
                                })}
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
    updated: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}
