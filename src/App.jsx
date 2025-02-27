import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import NavBar from './components/NavBar';
import Content from "./pages/Content";
import { useState } from 'react';
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
    const dispatch = useDispatch()
    const { error, isLoading } = useGetAllPodcastsEnrichedQuery(); // Fetch the initial data for the show cards
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false); // State to control whether listening reset dialog is open or closed

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
                    <FavouritesPage />
                }
                >
                </Route>
            </Routes>
            <AudioPlayer />
            <ResetConfirmationDialog
                open={isResetDialogOpen}
                onClose={handleResetCancel}
                onConfirm={handleResetConfirm}
            />
        </>
    );
}

export default App;
