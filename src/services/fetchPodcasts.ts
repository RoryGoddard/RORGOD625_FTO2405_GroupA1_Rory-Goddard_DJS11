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

interface EnrichedPodcast extends Omit<Podcast, 'genres'> {
  genres: Genre[];
}

interface TransformedResponse {
  enrichedPodcasts: EnrichedPodcast[];
  allGenres: Genre[];
}

// Define a service using a base URL and expected endpoints
export const podcastApi = createApi({
  reducerPath: 'podcastApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app/' }),
  endpoints: (builder) => ({

    getAllPodcastsEnriched: builder.query<TransformedResponse, void>({
      queryFn: async (_, api) => {
        const baseQuery = fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app/' });
        try {
          // Fetch all podcasts
          const podcastsResult = await baseQuery('', api, {});
          if (podcastsResult.error) {
            return { error: podcastsResult.error };
          }
          const podcasts = podcastsResult.data as Podcast[];
    
          // Get unique genre IDs
          const genreIds = [...new Set(podcasts.flatMap(podcast => podcast.genres))];
    
          // Fetch all genres
          const genrePromises = genreIds.map(genreId => 
            baseQuery(`genre/${genreId}`, api, {})
          );
          const genreResults = await Promise.all(genrePromises);

          // Handle genre fetch errors
          const genres = genreResults.reduce((acc, result, index) => {
            if (result.data) {
              acc[genreIds[index]] = result.data as Genre;
            }
            return acc;
          }, {} as Record<number, Genre>);

          // Transform podcasts to include full genre info
          const enrichedPodcasts = podcasts.map(podcast => ({
            ...podcast,
            genres: podcast.genres.map(genreId => genres[genreId])
          }));

          return {
            data: {
              enrichedPodcasts,
              allGenres: Object.values(genres)
            }
          };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      }
    }),

    getAllPodcasts: builder.query<Podcast[], void>({
      query: () => ``,
    }),

    getPodcastById: builder.query<Podcast, string>({
      query: (podcastId) => `id/${podcastId}`
    }),

    getGenreByGenreId: builder.query<Genre, string>({
      query: (genreId) => `genre/${genreId}`
    })

  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetAllPodcastsEnrichedQuery,
  useGetAllPodcastsQuery, 
  useGetPodcastByIdQuery, 
  useGetGenreByGenreIdQuery 
} = podcastApi;