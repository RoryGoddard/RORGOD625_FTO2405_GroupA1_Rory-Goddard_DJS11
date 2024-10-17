import ShowCard from "../components/ShowCard";
import { Grid2 } from '@mui/material';
import PropTypes from "prop-types";

function Content({ showData, genres, onShowClick }) {
    return (
        <Grid2 container spacing={{ xs: 2, md: 3 }} 
        sx={{ 
            margin:"1.5rem",
        }}>
        {showData.map((showPreview) => (
            <Grid2 key={showPreview.id} size={{ xs: 12, sm: 6, md: 6, lg:4, xl:3 }} sx={{borderRadius: "2%"}}>
                <ShowCard                 
                    title={showPreview.title}
                    description={showPreview.description}
                    seasons={showPreview.seasons}
                    image={showPreview.image}
                    genresArray={genres}
                    showsGenre={showPreview.genres}
                    updated={showPreview.updated}
                    onClick={() => onShowClick(showPreview)}
                />
            </Grid2>
        ))}
        </Grid2>
    );
}

// Define Prop Types for previewData array of objects and for genres array of objects
Content.propTypes = {
    showData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            seasons: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            genres: PropTypes.array.isRequired,
            updated: PropTypes.string.isRequired
        })
    ).isRequired,
    genres: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            shows: PropTypes.array
        })
    ).isRequired,
    onShowClick: PropTypes.func.isRequired,
}


export default Content