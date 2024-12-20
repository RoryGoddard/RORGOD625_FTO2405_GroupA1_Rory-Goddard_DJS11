import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import SearchAppBar from './components/NavBar';
import Content from "./pages/Content";
import { useState, useEffect, useCallback } from 'react';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "./utils/sortUtils";
import AudioPlayer from './components/AudioPlayer';
import PodcastDetailsModal from './components/PodcastDetailsModal';
import FavoritesPage from './pages/FavoritesPage';
import { Box } from '@mui/material'
import ResetConfirmationDialog from './components/ResetConfirmationDialog';
import { initializeFuzzySearch, performFuzzySearch } from './utils/fuzzySearch';
import { useGetAllPodcastsQuery, useGetPodcastByIdQuery, useGetGenreByGenreIdQuery, useGetAllPodcastsEnrichedQuery } from './services/podcastApi'


const GENRE_URL = "https://podcast-api.netlify.app/genre/";
const SHOW_URL = "https://podcast-api.netlify.app/id/";

function App() {
    const { data, isError } = useGetAllPodcastsEnrichedQuery()

    const { data: allPodcastsData, error, isLoading } = useGetAllPodcastsQuery(); // Fetch the initial data for the show cards
    const [genres, setGenres] = useState([]); // Iterate over unique genre ID's and generate array of fetched genre objects
    const [loadingGenres, setLoadingGenres] = useState(true); // State to manage when we are fetching the genre objects and crated the above array
    const [sortOption, setSortOption] = useState("A-Z"); // Manage the sort option defined by the user, defaults to A-Z
    const [selectedGenre, setSelectedGenre] = useState(null); // Manages the user defined selected genre for filtering shows, defaults to null for all shows
    const [sortedData, setSortedData] = useState(allPodcastsData); // State array of sorted allPodcastsData
    const [filteredData, setFilteredData] = useState(allPodcastsData); // Filtered version of sortedData array
    const [searchQuery, setSearchQuery] = useState(''); // Search field text input saved to state
    const [modalOpen, setModalOpen] = useState(false); // State to manage the PodcastDetails Modal being open or closed based on boolean
    const [detailedShow, setDetailedShow] = useState(null); // When a show card is clicked, a get request is done and the shows detailed data is stored here
    const [currentEpisode, setCurrentEpisode] = useState(null); // State used by skip handlers to store current episodes data
    const [isPlaying, setIsPlaying] = useState(false); // Handle play state of episodes
    const [loadingShow, setLoadingShow] = useState(false); // Handle loading state when a show is clicked on
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
    const [fuse, setFuse] = useState(null); 

    useEffect(() => {
        if (allPodcastsData && allPodcastsData.length > 0) {
          setFuse(initializeFuzzySearch(allPodcastsData));
        }
      }, [allPodcastsData]);

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

    // TODO
    // CONVERT THIS USE EFFECT TO REDUX
    // Iterates over the allPodcastsData, grabbing genre id's, making a set of the unique ID's, and then fetches each genres information from the genre endpoint
    // We then save an array of genre objects to state with setGenres - The dependency array is our allPodcastsData 
    useEffect(() => {
        if (!allPodcastsData) return;

        const fetchGenres = async () => {
            try {
                const genreIds = new Set(allPodcastsData.flatMap(show => show.genres));
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
    }, [allPodcastsData]);

    // Process user defined sort option and array show cards as such
    useEffect(() => {
        if (allPodcastsData) {
            let sorted;
            switch (sortOption) {
                case 'A-Z':
                    sorted = sortByTitleAscending(allPodcastsData);
                    break;
                case 'Z-A':
                    sorted = sortByTitleDescending(allPodcastsData);
                    break;
                case 'newest':
                    sorted = sortByDateDescending(allPodcastsData);
                    break;
                case 'oldest':
                    sorted = sortByDateAscending(allPodcastsData);
                    break;
                default:
                    sorted = allPodcastsData;
            }
            setSortedData(sorted);
        }
    }, [sortOption, allPodcastsData]);

    // Iterates over shows, filtering for shows with genre ID's that match the selected genres ID
    // Then filters additionally for a text search query if there is one
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
    
    // Click handler to set new sorting option
    const handleSortChange = (option) => {
        setSortOption(option);
    };

    // Click handler to set the selected genre 
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


    if (isLoading || loadingGenres) return (
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
