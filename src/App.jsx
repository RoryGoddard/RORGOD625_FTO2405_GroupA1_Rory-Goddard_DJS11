import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import SearchAppBar from './components/SearchAppBar';
import Content from "./pages/Content";
import PlaybackFooter from './components/PlaybackFooter';
import { useState, useEffect } from 'react';
import { sortByTitleAscending, sortByTitleDescending, sortByDateAscending, sortByDateDescending } from "./utils/sortUtils";

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
      // Apply filtering whenever the selected genre changes
      let filteredData = sortedData; // Start with sorted data
    
      if (selectedGenre) {
        filteredData = sortedData.filter((show) => 
          show.genres.includes(selectedGenre.id) // Check if the show includes the selected genre
        );
      }
    
      setFilteredData(filteredData); // Update the state with filtered data
    }, [selectedGenre, sortedData]); // Re-run when selected genre or sorted data changes
    

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleFilterChange = (genre) => {
        setSelectedGenre(genre);
    };

    if (loading || loadingGenres) return <LoadingSpinner />;
    if (error) return <ErrorPage />;

    return (
        <>
            {genres && <SearchAppBar onSortChange={handleSortChange} onFilterChange={handleFilterChange} genres={genres}/>}
            {filteredData && <Content showData={filteredData} genres={genres} />}
            <PlaybackFooter />
        </>
    );
}

export default App;
