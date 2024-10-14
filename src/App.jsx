import './App.css'
import useFetchData from './hooks/useFetchData';
import LoadingSpinner from "./pages/LoadingSpinner"
import ErrorPage from './pages/ErrorPage'
import SearchAppBar from './components/SearchAppBar'
import Content from "./components/Content"
import PlaybackFooter from './components/PlaybackFooter'

const PREVIEW_URL = "https://podcast-api.netlify.app"

function App() {

  const { data: previewData, loading, error } = useFetchData(PREVIEW_URL)


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

export default App
