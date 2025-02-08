import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import NavBar from './components/NavBar';
import Content from "./pages/Content";
import { useState, useEffect, useCallback } from 'react';
import AudioPlayer from './components/AudioPlayer';
import FavouritesPage from './pages/FavouritesPage';
import { Box } from '@mui/material'
import ResetConfirmationDialog from './components/ResetConfirmationDialog';
import { useGetAllPodcastsEnrichedQuery } from './services/podcastApi'

function App() {
    const { error, isLoading } = useGetAllPodcastsEnrichedQuery(); // Fetch the initial data for the show cards
    const [currentEpisode, setCurrentEpisode] = useState(null); // State used by skip handlers to store current episodes data
    const [isPlaying, setIsPlaying] = useState(false); // Handle play state of episodes
    const [playingShow, setPlayingShow] = useState(null); // Sets the playing show equal to the detail show from the PodcastDetails Modal
    const [favoriteEpisodes, setFavoriteEpisodes] = useState(() => { // Sets favorite episodes equal to the episodes in state, or an empty array if no episodes exist
        const storedFavorites = localStorage.getItem('favoriteEpisodes');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });
    const [showFavorites, setShowFavorites] = useState(false); // State which triggers whether or not we open the favorites view
    const [listenedEpisodes, setListenedEpisodes] = useState(() => { // Checks for listened episodes in local storage and sets itself equal to that, or empty array
        const storedListenedEpisodes = localStorage.getItem('listenedEpisodes');
        return storedListenedEpisodes ? JSON.parse(storedListenedEpisodes) : [];
    });
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false); // State to control whether listening reset dialog is open or closed
    const [episodeTimestamps, setEpisodeTimestamps] = useState(() => { // State which manages tracking of timestamps of episodes played
        const storedTimestamps = localStorage.getItem('episodeTimestamps');
        return storedTimestamps ? JSON.parse(storedTimestamps) : {};
      });

    const updateEpisodeTimestamp = useCallback((showId, episodeTitle, timestamp) => {
    setEpisodeTimestamps(prev => {
        const newTimestamps = {
        ...prev,
        [showId]: {
            ...prev[showId],
            [episodeTitle]: timestamp
        }
        };
        localStorage.setItem('episodeTimestamps', JSON.stringify(newTimestamps));
        return newTimestamps;
    });
    }, []);

    const markEpisodeAsListened = useCallback((episode) => {
        setListenedEpisodes(prev => {
            // Check if this episode is already marked as listened
            const isAlreadyListened = prev.some(
                listened => listened.showId === episode.showId && 
                           listened.episodeTitle === episode.episodeTitle
            );

            if (isAlreadyListened) {
                return prev;
            }

            const newListenedEpisodes = [...prev, episode];
            localStorage.setItem('listenedEpisodes', JSON.stringify(newListenedEpisodes));
            return newListenedEpisodes;
        });
    }, []);

    const handleResetClick = () => {
        setIsResetDialogOpen(true);
    };
    
    const handleResetCancel = () => {
        setIsResetDialogOpen(false);
    };
    
    const handleResetConfirm = () => {
        setListenedEpisodes([]);
        localStorage.removeItem('episodeTimestamps');
        setIsResetDialogOpen(false);
    };

    const handleBackToShows = () => {
        setShowFavorites(false);
    };    

    const handleFavoritesClick = () => {
        setShowFavorites(true); // Set to true when the favorites button is clicked
    };

    const toggleFavorite = useCallback((episode) => {
        setFavoriteEpisodes(prev => {
            const isAlreadyFavorite = prev.some(fav => 
                fav.showId === episode.showId && 
                fav.episodeTitle === episode.episodeTitle && 
                fav.seasonTitle === episode.seasonTitle
            );
    
            let updatedFavorites;
            if (isAlreadyFavorite) {
                updatedFavorites = prev.filter(fav => 
                    !(fav.showId === episode.showId && 
                      fav.episodeTitle === episode.episodeTitle && 
                      fav.seasonTitle === episode.seasonTitle)
                );
            } else {
                const favoriteWithDate = {
                    ...episode,
                    savedAt: new Date().toISOString(),
                };
                updatedFavorites = [...prev, favoriteWithDate];
            }
            localStorage.setItem('favoriteEpisodes', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    }, []);
    

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteEpisodes');
        if (storedFavorites) {
            setFavoriteEpisodes(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          if (isPlaying) {
            event.preventDefault();
            event.returnValue = ''; // This is required for some browsers
          }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [isPlaying]);
  

    const getAllEpisodes = (show) => {
        if (!show || !Array.isArray(show.seasons)) {
            console.error('Invalid show structure:', show);
            return [];
        }
        return show.seasons.flatMap((season, seasonIndex) => {
            if (Array.isArray(season.episodes)) {
                return season.episodes.map(episode => ({
                    ...episode,
                    season: seasonIndex + 1 // Add season number to each episode
                }));
            }
            console.error('Invalid season structure:', season);
            return [];
        });
    };
    
    const findEpisodeIndex = (allEpisodes, currentEpisode) => {
        return allEpisodes.findIndex(e => 
            e.episode === currentEpisode.episode && 
            (e.season === currentEpisode.season || e.season === undefined)
        );
    };

    const handleSkipNext = () => {
        if (detailedShow && currentEpisode) {
            const allEpisodes = getAllEpisodes(detailedShow);
            let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
            // If currentIndex is still -1, assume we're at the first episode
            if (currentIndex === -1) {
                currentIndex = 0;
            }
    
            if (currentIndex < allEpisodes.length - 1) {
                const nextEpisode = allEpisodes[currentIndex + 1];
                setCurrentEpisode(nextEpisode);
                setIsPlaying(true);
            }
        }
    };

    const handleSkipPrevious = () => {
        if (detailedShow && currentEpisode) {
            const allEpisodes = getAllEpisodes(detailedShow);
            let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
            // If currentIndex is still -1, assume we're at the first episode
            if (currentIndex === -1) {
                currentIndex = 0;
            }
    
            if (currentIndex > 0) {
                const previousEpisode = allEpisodes[currentIndex - 1];
                setCurrentEpisode(previousEpisode);
                setIsPlaying(true);
            }
        }
    };

    const handlePlayEpisode = (episode) => {
        const episodeWithSeason = {
            ...episode,
            season: episode.season || 1
        };
        setCurrentEpisode(episodeWithSeason);
        setPlayingShow(detailedShow);
        setIsPlaying(true);
    };

    const handleEpisodeComplete = (episodeData) => {
        markEpisodeAsListened(episodeData);
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
                onFavoritesClick={handleFavoritesClick}
                onResetClick={handleResetClick}
            />
            {!showFavorites && (
                <Content
                    listenedEpisodes={listenedEpisodes}
                />
            )}
            {showFavorites && (
                <FavoritesPage
                    favoriteEpisodes={favoriteEpisodes}
                    toggleFavorite={toggleFavorite}
                    onShowClick={handleShowClick}
                    onBackToShows={handleBackToShows}
                    listenedEpisodes={listenedEpisodes}
                />
            )}
            <AudioPlayer
                episode={currentEpisode}
                isPlaying={isPlaying}
                onPlayPause={(playState) => setIsPlaying(playState)}
                onSkipNext={handleSkipNext}
                onSkipPrevious={handleSkipPrevious}
                playingShow={playingShow}
                onEpisodeComplete={handleEpisodeComplete}
                updateEpisodeTimestamp={updateEpisodeTimestamp}
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
