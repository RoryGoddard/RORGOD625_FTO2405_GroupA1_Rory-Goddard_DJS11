import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const podcastApi = createApi({
  reducerPath: 'podcastApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app/' }),
  endpoints: (builder) => ({

    getAllPodcastsEnriched: builder.query({
      queryFn: async (_, api) => {
        const baseQuery = fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app/' });
        try {
          // Fetch all podcasts
          const podcastsResult = await baseQuery('', api, {});
          if (podcastsResult.error) {
            return { error: podcastsResult.error };
          }
          const podcasts = podcastsResult.data;
    
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
              acc[genreIds[index]] = result.data;
            }
            return acc;
          }, {});

          // Transform podcasts to include full genre info
          const enrichedPodcasts = podcasts.map(podcast => ({
            ...podcast,
            genres: podcast.genres.map(genreId => genres[genreId])
          }));

          return {
            data: {
              enrichedPodcasts,
              genres: Object.values(genres)
            }
          };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      }
    }),

    getAllPodcasts: builder.query({
      query: () => ``,
    }),

    getPodcastById: builder.query({
      queryFn: async (podcastId, api, extraOptions) => {
        const baseQuery = fetchBaseQuery({ baseUrl: 'https://podcast-api.netlify.app/' });
        const podcastResult = await baseQuery(`id/${podcastId}`, api, extraOptions);
        if (podcastResult.error) return { error: podcastResult.error };
        
        const fetchedPodcast = podcastResult.data;

        const state = api.getState();
        const enrichedPodcasts = state.podcasts?.enrichedPodcasts || [];
        const enrichedPodcast = enrichedPodcasts.find(p => p.id === podcastId);

        const finalPodcast = enrichedPodcast 
          ? {...fetchedPodcast, genres: enrichedPodcast.genres} 
          : fetchedPodcast;
        
        return { data: finalPodcast };
      },
    }),

    getGenreByGenreId: builder.query({
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