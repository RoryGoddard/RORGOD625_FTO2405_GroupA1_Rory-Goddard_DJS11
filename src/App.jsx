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
    const [selectedShow, setSelectedShow] = useState(null);
    const [detailedShow, setDetailedShow] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);

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
      setSelectedShow(show);
      setModalOpen(true);
      setLoadingShow(true);
      try {
          const response = await fetch(`${SHOW_URL}${show.id}`);
          const data = await response.json();
          setDetailedShow(data);
      } catch (error) {
          console.error('Error fetching show details:', error);
      } finally {
          setLoadingShow(false);
      }
  };

  const handleCloseModal = () => {
      setModalOpen(false);
      setDetailedShow(null);
  };

  const handlePlayEpisode = (episode) => {
      setCurrentEpisode(episode);
      setIsPlaying(true);
  };

  const getAllEpisodes = (show) => {
      if (!show || !Array.isArray(show.seasons)) {
          console.error('Invalid show structure:', show);
          return [];
      }
      return show.seasons.reduce((allEpisodes, season) => {
          if (Array.isArray(season.episodes)) {
              return allEpisodes.concat(season.episodes);
          }
          console.error('Invalid season structure:', season);
          return allEpisodes;
      }, []);
  };

  const handleSkipNext = () => {
      if (detailedShow && currentEpisode) {
          const allEpisodes = getAllEpisodes(detailedShow);
          const currentIndex = allEpisodes.findIndex(e => e.file === currentEpisode.file);
          const nextEpisode = allEpisodes[currentIndex + 1];
          if (nextEpisode) {
              setCurrentEpisode(nextEpisode);
              setIsPlaying(true);
          }
      }
  };

  const handleSkipPrevious = () => {
      if (detailedShow && currentEpisode) {
          const allEpisodes = getAllEpisodes(detailedShow);
          const currentIndex = allEpisodes.findIndex(e => e.file === currentEpisode.file);
          const previousEpisode = allEpisodes[currentIndex - 1];
          if (previousEpisode) {
              setCurrentEpisode(previousEpisode);
              setIsPlaying(true);
          }
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
          />
          {selectedShow && (
              <PodcastDetailsModal
                  show={detailedShow || selectedShow}
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