import { useState, useEffect } from 'react';
import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner"
import ErrorPage from './pages/ErrorPage'
import SearchAppBar from './components/SearchAppBar'
import Content from "./pages/Content"
import PlaybackFooter from './components/PlaybackFooter'

const PREVIEW_URL = "https://podcast-api.netlify.app"

function App() {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data, loading: fetchLoading, error: fetchError } = useFetchData(PREVIEW_URL);

  useEffect(() => {
    setLoading(fetchLoading);
    setError(fetchError);
    if (data) {
      setPreviewData(data);
    }
  }, [data, fetchLoading, fetchError]);

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorPage />

  return (
    <>
      <SearchAppBar />
      {previewData && <Content previewData={previewData} />}
      <PlaybackFooter />
    </>
  )
}

export default App;
