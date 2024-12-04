import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { podcastApi } from '../services/fetchPodcasts'

export const store = configureStore({
  reducer: {
    [podcastApi.reducerPath]: podcastApi.reducer
  },

  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware().concat(podcastApi.middleware)
  }
})

setupListeners(store.dispatch)