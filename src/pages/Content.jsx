import ShowCard from "../components/ShowCard"
import { Paper, CardMedia, Typography, Box} from '@mui/material';
import { Grid2 } from '@mui/material'
import PropTypes from "prop-types";

function Content({ previewData }) {
    const [...previewDataSorted] = previewData.sort((a, b) => a.title.localeCompare(b.title))

    return (
        <Grid2 container spacing={{ xs: 2, md: 3 }} 
        sx={{ 
            margin:"1.5rem",
        }}>
        {previewDataSorted.map((showPreview) => (
            <Grid2 key={showPreview.id} size={{ xs: 12, sm: 6, md: 6, lg:4, xl:3 }}>
                <ShowCard                 
                        title={showPreview.title}
                        description={showPreview.description}
                        seasons={showPreview.seasons}
                        image={showPreview.image}
                        genres={showPreview.genres}
                        updated={showPreview.updated} 
                    />
            </Grid2>
        ))}
        </Grid2>
    )
}

// Define Prop Types for previewData array of objects within Content component
Content.propTypes = {
    previewData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            seasons: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            genres: PropTypes.array.isRequired,
            updated: PropTypes.string.isRequired
        })
    )
}

export default Content