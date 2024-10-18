import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import SearchAppBar from './components/SearchAppBar';
import Content from "./pages/Content";
import { useState, useEffect } from 'react';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "./utils/sortUtils";
import AudioPlayer from './components/AudioPlayer';
import PodcastDetailsModal from './components/PodcastDetailsModal';
import { Box } from '@mui/material'

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
    // const [selectedShow, setSelectedShow] = useState(null);
    const [detailedShow, setDetailedShow] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [playingShow, setPlayingShow] = useState(null);

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

    // Sorting effect
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
    };

    const handleShowClick = async (show) => {
        if (playingShow && playingShow.id === show.id) {
            setModalOpen(true); // Open modal immediately if the same show is clicked
            return; // Don't fetch details again if it's the same show
        }
    
        setModalOpen(true); // Open modal immediately for user feedback
        setLoadingShow(true); // Indicate that the modal is still loading full details
        try {
            const response = await fetch(`${SHOW_URL}${show.id}`);
            const data = await response.json();
            setDetailedShow(data);
            setPlayingShow(data); // Track the newly loaded show as the playing show
        } catch (error) {
            console.error('Error fetching show details:', error);
        } finally {
            setLoadingShow(false); // Stop the loading spinner once fetching completes
        }
    };
    

  const handleCloseModal = () => {
      setModalOpen(false);
    //   setDetailedShow(null);
  };

  const handlePlayEpisode = (episode) => {
    // Ensure the episode object has a season property
    const episodeWithSeason = {
        ...episode,
        season: episode.season || 1 // Default to season 1 if not specified
    };
    setCurrentEpisode(episodeWithSeason);
    setPlayingShow(detailedShow);
    setIsPlaying(true);
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
    

  if (loading || loadingGenres) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <LoadingSpinner />
    </Box>
    )
  if (error) return <ErrorPage />;


  return (
      <>
          {genres && <SearchAppBar onSortChange={handleSortChange} onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} genres={genres}/>}
          {filteredData && <Content showData={filteredData} genres={genres} onShowClick={handleShowClick} />}
          <AudioPlayer
            episode={currentEpisode}
            isPlaying={isPlaying}
            onPlayPause={(playState) => setIsPlaying(playState)}
            onSkipNext={handleSkipNext}
            onSkipPrevious={handleSkipPrevious}
            playingShow={playingShow} // Pass the playing show to AudioPlayer
        />
          {detailedShow && modalOpen && (
            <PodcastDetailsModal
                show={detailedShow}
                loading={loadingShow}
                open={modalOpen}
                onClose={handleCloseModal}
                onPlayEpisode={handlePlayEpisode}
                genres={genres}
            />
        )}

      </>
  );
}

export default App;