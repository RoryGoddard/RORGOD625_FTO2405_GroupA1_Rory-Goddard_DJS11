import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import NavBar from './components/NavBar';
import Content from "./pages/Content";
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import FavouritesPage from './pages/FavouritesPage';
import { Box } from '@mui/material'
import ResetConfirmationDialog from './components/ResetConfirmationDialog';
import { useGetAllPodcastsEnrichedQuery } from './services/podcastApi'
import { useDispatch } from "react-redux";
import { clearFavourites } from "./state/favouritesSlice";
import { clearListenedEpisodes, clearTimestamps } from "./state/audioPlayerSlice";

function App() {
    const { error, isLoading } = useGetAllPodcastsEnrichedQuery(); // Fetch the initial data for the show cards
    const dispatch = useDispatch()
    // const [isPlaying, setIsPlaying] = useState(false); // Handle play state of episodes
    // const [playingShow, setPlayingShow] = useState(null); // Sets the playing show equal to the detail show from the PodcastDetails Modal
    // const [listenedEpisodes, setListenedEpisodes] = useState(() => { // Checks for listened episodes in local storage and sets itself equal to that, or empty array
    //     const storedListenedEpisodes = localStorage.getItem('listenedEpisodes');
    //     return storedListenedEpisodes ? JSON.parse(storedListenedEpisodes) : [];
    // });
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false); // State to control whether listening reset dialog is open or closed
    // const [episodeTimestamps, setEpisodeTimestamps] = useState(() => { // State which manages tracking of timestamps of episodes played
    //     const storedTimestamps = localStorage.getItem('episodeTimestamps');
    //     return storedTimestamps ? JSON.parse(storedTimestamps) : {};
    //   });

    // const updateEpisodeTimestamp = useCallback((showId, episodeTitle, timestamp) => {
    // setEpisodeTimestamps(prev => {
    //     const newTimestamps = {
    //     ...prev,
    //     [showId]: {
    //         ...prev[showId],
    //         [episodeTitle]: timestamp
    //     }
    //     };
    //     localStorage.setItem('episodeTimestamps', JSON.stringify(newTimestamps));
    //     return newTimestamps;
    // });
    // }, []);

    // const markEpisodeAsListened = useCallback((episode) => {
    //     setListenedEpisodes(prev => {
    //         // Check if this episode is already marked as listened
    //         const isAlreadyListened = prev.some(
    //             listened => listened.showId === episode.showId && 
    //                        listened.episodeTitle === episode.episodeTitle
    //         );

    //         if (isAlreadyListened) {
    //             return prev;
    //         }

    //         const newListenedEpisodes = [...prev, episode];
    //         localStorage.setItem('listenedEpisodes', JSON.stringify(newListenedEpisodes));
    //         return newListenedEpisodes;
    //     });
    // }, []);

    const handleResetClick = () => {
        setIsResetDialogOpen(true);
    };
    
    const handleResetCancel = () => {
        setIsResetDialogOpen(false);
    };
    
    const handleResetConfirm = () => {
        const clearArray = []
        localStorage.removeItem('timestamps');
        localStorage.removeItem('favourites');
        localStorage.removeItem('listenedEpisodes');
        dispatch(clearFavourites(clearArray))
        dispatch(clearListenedEpisodes(clearArray))
        dispatch(clearTimestamps(clearArray))
        setIsResetDialogOpen(false);
    };   

  
    // const handleSkipNext = () => {
    //     if (detailedShow && currentEpisode) {
    //         const allEpisodes = getAllEpisodes(detailedShow);
    //         let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
    //         // If currentIndex is still -1, assume we're at the first episode
    //         if (currentIndex === -1) {
    //             currentIndex = 0;
    //         }
    
    //         if (currentIndex < allEpisodes.length - 1) {
    //             const nextEpisode = allEpisodes[currentIndex + 1];
    //             setCurrentEpisode(nextEpisode);
    //             setIsPlaying(true);
    //         }
    //     }
    // };

    // const handleSkipPrevious = () => {
    //     if (detailedShow && currentEpisode) {
    //         const allEpisodes = getAllEpisodes(detailedShow);
    //         let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
    //         // If currentIndex is still -1, assume we're at the first episode
    //         if (currentIndex === -1) {
    //             currentIndex = 0;
    //         }
    
    //         if (currentIndex > 0) {
    //             const previousEpisode = allEpisodes[currentIndex - 1];
    //             setCurrentEpisode(previousEpisode);
    //             setIsPlaying(true);
    //         }
    //     }
    // };

    // const handlePlayEpisode = (episode) => {
    //     const episodeWithSeason = {
    //         ...episode,
    //         season: episode.season || 1
    //     };
    //     setCurrentEpisode(episodeWithSeason);
    //     setPlayingShow(detailedShow);
    //     setIsPlaying(true);
    // };

    // const handleEpisodeComplete = (episodeData) => {
    //     markEpisodeAsListened(episodeData);
    // };


    if (isLoading) return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <LoadingSpinner />
        </Box>
    );
    if (error) return <ErrorPage />;

    return (
        <>
            <NavBar
                onResetClick={handleResetClick}
            />
            <Routes>
                <Route path="/" element={<Content />}>
                </Route>
                <Route path="/favourites" element={
                    <FavouritesPage
                            // listenedEpisodes={listenedEpisodes}
                    />
                }
                >
                </Route>
            </Routes>
            <AudioPlayer
                // isPlaying={isPlaying}
                // playingShow={playingShow}
                // onEpisodeComplete={handleEpisodeComplete}
                // updateEpisodeTimestamp={updateEpisodeTimestamp}
            />
            <ResetConfirmationDialog
                open={isResetDialogOpen}
                onClose={handleResetCancel}
                onConfirm={handleResetConfirm}
            />
        </>
    );
}

export default App;
