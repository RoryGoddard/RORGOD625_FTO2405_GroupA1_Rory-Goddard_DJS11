import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { podcastApi } from '../services/podcastApi'
import podcastReducer from '../state/podcastSlice'
import navbarReducer from '../state/navbarSlice'
import favouritesReducer from '../state/favouritesSlice'
import localStorageMiddleware from '../middleware/localStorageMiddleware'
import audioPlayerReducer from '../state/audioPlayerSlice'

export const store = configureStore({
  reducer: {
    podcasts: podcastReducer,
    [podcastApi.reducerPath]: podcastApi.reducer,
    navbar: navbarReducer,
    favourites: favouritesReducer,
    audioPlayer: audioPlayerReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(podcastApi.middleware, localStorageMiddleware)
  ,
})

setupListeners(store.dispatch)