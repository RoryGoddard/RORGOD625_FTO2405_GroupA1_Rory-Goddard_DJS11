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
    const { data: previewData, loading, error } = useFetchData(PREVIEW_URL); // Grab the data, loading, and error values from the useFetchData helper
    const [genres, setGenres] = useState([]); 
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [sortOption, setSortOption] = useState("A-Z"); // State to track the sort option
    const [sortedData, setSortedData] = useState(previewData || []); // State for sorted data

    useEffect(() => {
        if (!previewData) return;

        const fetchGenres = async () => {
            try {
                // Create a set consisting of unique genre ID's from previewData by using flatMap to flatten each array of ID's to one array of ID's
                const genreIds = new Set(previewData.flatMap(show => show.genres));
                
                // Fetch genres asynchronously, returning response genre object and saving it within an array
                const genrePromises = Array.from(genreIds).map(async (id) => {
                    const response = await fetch(`${GENRE_URL}${id}`);
                    return await response.json(); // Store the whole object
                });
                // Save the array of genre objects to state
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
      // Apply the sorting function whenever the sort option or previewData changes
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

    const handleSortChange = (option) => {
      setSortOption(option);
    };

    if (loading || loadingGenres) return <LoadingSpinner />;
    if (error) return <ErrorPage />;

    return (
        <>
            <SearchAppBar onSortChange={handleSortChange} />
            {sortedData && <Content showData={sortedData} genres={genres} />}
            <PlaybackFooter />
        </>
    );
}

export default App;
