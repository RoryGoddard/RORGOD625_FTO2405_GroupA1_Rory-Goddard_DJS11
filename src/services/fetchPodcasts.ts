import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Podcast {
  id: string;
  title: string;
  description: string;
  seasons: number;
  image: string;
  genres: number[];
  updated: string;
}

interface Genre {
  id: number,
  title: string;
  description: string;
  shows: string[];
}

// Define a service using a base URL and expected endpoints
export const podcastApi = createApi({
  reducerPath: 'podcastApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app' }),
  endpoints: (builder) => ({

    getAllPodcasts: builder.query<Podcast[], void>({
      query: () => `podcasts`,
    }),

    getPodcastById: builder.query<Podcast, string>({
      query: (podcastId) => `podcasts/id/${podcastId}`
    }),

    getGenreByGenreId: builder.query<Genre, string>({
      query: (genreId) => `podcasts/genre/${genreId}`
    })

  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllPodcastsQuery, useGetPodcastByIdQuery, useGetGenreByGenreIdQuery } = podcastApi