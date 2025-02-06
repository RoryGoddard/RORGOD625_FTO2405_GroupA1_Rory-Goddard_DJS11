import ShowCard from "../components/ShowCard";
import { Grid2 } from '@mui/material';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react";
import { useGetPodcastByIdQuery } from '../services/podcastApi'
import { setSelectedPodcastId, setModalOpen, setSelectedPodcastData } from '../state/podcastSlice';
import PodcastDetailsModal from '../components/PodcastDetailsModal';


function Content() {
    const sortedPodcasts = useSelector((state) => state.podcasts.sortedAndFilteredEnrichedPodcasts);
    const [selectedPodcastId, setSelectedPodcastId] = useState(null)

    const { data: selectedPodcastData, isLoading, isError } = useGetPodcastByIdQuery(selectedPodcastId, {
        skip: !selectedPodcastId
    });

    return (
        <>
            <PodcastDetailsModal
                show={selectedPodcastData}
                loading={isLoading}
                error={isError}
                open={!!selectedPodcastId}
                onClose={() => setSelectedPodcastId(null)}
                // onPlayEpisode={handlePlayEpisode}
                // toggleFavorite={toggleFavorite}
                // favoriteEpisodes={favoriteEpisodes}
                // listenedEpisodes={listenedEpisodes}
                // episodeTimestamps={episodeTimestamps}
            />
            <Grid2 container spacing={{ xs: 2, md: 3 }} 
            sx={{ 
                margin:"1.5rem",
                marginTop:"5rem"
            }}>
            {sortedPodcasts.map((podcast) => (
                <Grid2 key={podcast.id} size={{ xs: 12, sm: 6, md: 6, lg:4, xl:3 }} sx={{borderRadius: "2%"}}>
                    <ShowCard                 
                        title={podcast.title}
                        description={podcast.description}
                        seasons={podcast.seasons}
                        image={podcast.image}
                        genres={podcast.genres}
                        updated={podcast.updated}
                        onClick={() => setSelectedPodcastId(podcast.id)}
                    />
                </Grid2>
            ))}
            </Grid2>
        </>
    );
}

// Define Prop Types for previewData array of objects and for genres array of objects
Content.propTypes = {
    onShowClick: PropTypes.func.isRequired,
}


export default Content