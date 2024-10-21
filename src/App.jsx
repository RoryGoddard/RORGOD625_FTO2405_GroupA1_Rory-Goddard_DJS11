import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import SearchAppBar from './components/SearchAppBar';
import Content from "./pages/Content";
import { useState, useEffect, useCallback } from 'react';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "./utils/sortUtils";
import AudioPlayer from './components/AudioPlayer';
import PodcastDetailsModal from './components/PodcastDetailsModal';
import FavoritesPage from './pages/FavoritesPage';
import { Box } from '@mui/material'
import ResetConfirmationDialog from './components/ResetConfirmationDialog';
import { initializeFuzzySearch, performFuzzySearch } from './utils/fuzzySearch';

const PREVIEW_URL = "https://podcast-api.netlify.app";
const GENRE_URL = "https://podcast-api.netlify.app/genre/";
const SHOW_URL = "https://podcast-api.netlify.app/id/";

function App() {
    const { data: previewData, loading, error } = useFetchData(PREVIEW_URL);
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [sortOption, setSortOption] = useState("A-Z");
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [sortedData, setSortedData] = useState(previewData);
    const [filteredData, setFilteredData] = useState(previewData);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailedShow, setDetailedShow] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [playingShow, setPlayingShow] = useState(null);
    const [favoriteEpisodes, setFavoriteEpisodes] = useState(() => {
        const storedFavorites = localStorage.getItem('favoriteEpisodes');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [filterOption, setFilterOption] = useState(null);
    const [listenedEpisodes, setListenedEpisodes] = useState(() => {
        const storedListenedEpisodes = localStorage.getItem('listenedEpisodes');
        return storedListenedEpisodes ? JSON.parse(storedListenedEpisodes) : [];
    });
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [episodeTimestamps, setEpisodeTimestamps] = useState(() => {
        const storedTimestamps = localStorage.getItem('episodeTimestamps');
        return storedTimestamps ? JSON.parse(storedTimestamps) : {};
      });
    const [fuse, setFuse] = useState(null);

    useEffect(() => {
        if (previewData && previewData.length > 0) {
          setFuse(initializeFuzzySearch(previewData));
        }
      }, [previewData]);

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
        localStorage.removeItem('listenedEpisodes');
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

    useEffect(() => {
        if (!previewData) return;

        const fetchGenres = async () => {
            try {
                const genreIds = new Set(previewData.flatMap(show => show.genres));
                const genrePromises = Array.from(genreIds).map(async (id) => {
                    const response = await fetch(`${GENRE_URL}${id}`);
                    return await response.json();
                });
                const fetchedGenres = await Promise.all(genrePromises);
                setGenres(fetchedGenres);
            } catch (err) {
                console.error("Error fetching genres:", err);
            } finally {
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, [previewData]);

    useEffect(() => {
        if (previewData) {
            let sorted;
            switch (sortOption) {
                case 'A-Z':
                    sorted = sortByTitleAscending(previewData);
                    break;
                case 'Z-A':
                    sorted = sortByTitleDescending(previewData);
                    break;
                case 'newest':
                    sorted = sortByDateDescending(previewData);
                    break;
                case 'oldest':
                    sorted = sortByDateAscending(previewData);
                    break;
                default:
                    sorted = previewData;
            }
            setSortedData(sorted);
        }
    }, [sortOption, previewData]);

    useEffect(() => {
      let filteredData = sortedData;
    
      if (selectedGenre) {
        filteredData = sortedData.filter((show) =>
          show.genres.includes(selectedGenre.id)
        );
      }
    
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter((show) =>
          show.title.toLowerCase().includes(lowerCaseQuery)
        );
      }
    
      setFilteredData(filteredData);
    }, [selectedGenre, sortedData, searchQuery]);    
    
    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleFilterChange = (genre) => {
      setSelectedGenre(genre);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query && fuse) {
          const results = performFuzzySearch(fuse, query);
          setFilteredData(results.map(result => result.item));
        } else {
          setFilteredData(sortedData);
        }
      };

    const handleShowClick = async (show) => {
        if (playingShow && playingShow.id === show.id) {
            setModalOpen(true);
            return;
        }
    
        setModalOpen(true);
        setLoadingShow(true);
        try {
            const response = await fetch(`${SHOW_URL}${show.id}`);
            const data = await response.json();
            setDetailedShow(data);
            setPlayingShow(data);
        } catch (error) {
            console.error('Error fetching show details:', error);
        } finally {
            setLoadingShow(false);
        }
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
    };

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
        console.log("HANDLE SKIP NEXT ENGAGED");
        console.log("CURRENT EPISODE:", currentEpisode);
    
        if (detailedShow && currentEpisode) {
            const allEpisodes = getAllEpisodes(detailedShow);
            let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
            console.log('Current Index:', currentIndex);
            console.log('All Episodes:', allEpisodes);
    
            // If currentIndex is still -1, assume we're at the first episode
            if (currentIndex === -1) {
                currentIndex = 0;
            }
    
            if (currentIndex < allEpisodes.length - 1) {
                const nextEpisode = allEpisodes[currentIndex + 1];
                setCurrentEpisode(nextEpisode);
                setIsPlaying(true);
                console.log("Loading next episode:", nextEpisode);
            } else {
                console.log("Reached the end of all episodes.");
            }
        } else {
            console.log("No detailed show or current episode found.");
        }
    };

    const handleSkipPrevious = () => {
        console.log("HANDLE SKIP PREVIOUS ENGAGED");
        console.log("CURRENT EPISODE:", currentEpisode);
    
        if (detailedShow && currentEpisode) {
            const allEpisodes = getAllEpisodes(detailedShow);
            let currentIndex = findEpisodeIndex(allEpisodes, currentEpisode);
    
            console.log('Current Index:', currentIndex);
            console.log('All Episodes:', allEpisodes);
    
            // If currentIndex is still -1, assume we're at the first episode
            if (currentIndex === -1) {
                currentIndex = 0;
            }
    
            if (currentIndex > 0) {
                const previousEpisode = allEpisodes[currentIndex - 1];
                setCurrentEpisode(previousEpisode);
                setIsPlaying(true);
                console.log("Loading previous episode:", previousEpisode);
            } else {
                console.log("Already at the first episode.");
            }
        } else {
            console.log("No detailed show or current episode found.");
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
        // Remove the immediate marking as listened here
    };

    const handleEpisodeComplete = (episodeData) => {
        markEpisodeAsListened(episodeData);
    };


    if (loading || loadingGenres) return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <LoadingSpinner />
        </Box>
    );
    if (error) return <ErrorPage />;

    return (
        <>
            <SearchAppBar
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                onFavoritesClick={handleFavoritesClick}
                genres={genres}
                onResetClick={handleResetClick}
            />
            {!showFavorites && filteredData && (
                <Content 
                    showData={filteredData} 
                    genres={genres} 
                    onShowClick={handleShowClick}
                    listenedEpisodes={listenedEpisodes}
                />
            )}
            {showFavorites && (
                <FavoritesPage
                    favoriteEpisodes={favoriteEpisodes}
                    toggleFavorite={toggleFavorite}
                    onShowClick={handleShowClick}
                    onBackToShows={handleBackToShows}
                    searchQuery={searchQuery}
                    sortOption={sortOption}
                    filterOption={filterOption}
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
            {detailedShow && modalOpen && (
                <PodcastDetailsModal
                    show={detailedShow}
                    loading={loadingShow}
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onPlayEpisode={handlePlayEpisode}
                    genres={genres}
                    toggleFavorite={toggleFavorite}
                    favoriteEpisodes={favoriteEpisodes}
                    listenedEpisodes={listenedEpisodes}
                    episodeTimestamps={episodeTimestamps}
                />
            )}
            <ResetConfirmationDialog
                open={isResetDialogOpen}
                onClose={handleResetCancel}
                onConfirm={handleResetConfirm}
            />
        </>
    );
}

export default App;
