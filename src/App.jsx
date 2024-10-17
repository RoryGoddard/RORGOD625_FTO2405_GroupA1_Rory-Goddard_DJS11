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

function App() {
    const { data: previewData, loading, error } = useFetchData(PREVIEW_URL);
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [sortOption, setSortOption] = useState("A-Z"); // Default sort option
    const [selectedGenre, setSelectedGenre] = useState(null); // State for selected genre
    const [sortedData, setSortedData] = useState(previewData); // State for sorted data
    const [filteredData, setFilteredData] = useState(previewData); // State for filtered data
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

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

    const handlePlayEpisode = (episode) => {
      // Implement your logic to play the episode
      console.log('Playing episode:', episode);
  };
  

    // New handler for opening the modal
    const handleShowClick = (show) => {
        setSelectedShow(show);
        setModalOpen(true);
    };

      // New handler for closing the modal
    const handleCloseModal = () => {
        setModalOpen(false);
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
          <AudioPlayer />
          {selectedShow && (
              <PodcastDetailsModal
                  show={selectedShow}
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
