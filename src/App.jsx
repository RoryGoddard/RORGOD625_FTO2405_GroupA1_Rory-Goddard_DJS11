import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner";
import ErrorPage from './pages/ErrorPage';
import SearchAppBar from './components/SearchAppBar';
import Content from "./pages/Content";
import PlaybackFooter from './components/PlaybackFooter';
import { useState, useEffect } from 'react';

const PREVIEW_URL = "https://podcast-api.netlify.app";
const GENRE_URL = "https://podcast-api.netlify.app/genre/";

function App() {
    const { data: previewData, loading, error } = useFetchData(PREVIEW_URL);
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);

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

    if (loading || loadingGenres) return <LoadingSpinner />;
    if (error) return <ErrorPage />;

    return (
        <>
            <SearchAppBar />
            {previewData && <Content previewData={previewData} genres={genres} />}
            <PlaybackFooter />
        </>
    );
}

export default App;
