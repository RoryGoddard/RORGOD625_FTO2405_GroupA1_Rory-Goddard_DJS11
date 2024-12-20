import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { podcastApi } from '../services/podcastApi'
import podcastReducer from '../state/podcastSlice'

export const store = configureStore({
  reducer: {
    podcasts: podcastReducer,
    [podcastApi.reducerPath]: podcastApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(podcastApi.middleware)
  ,
})

setupListeners(store.dispatch)