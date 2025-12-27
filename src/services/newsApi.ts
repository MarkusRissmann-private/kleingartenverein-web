import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getNews: builder.query<NewsItem[], void>({
      query: () => '/news',
      providesTags: ['News'],
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ('/news');
        if (result.error?.status === 404 || result.error?.status === 'FETCH_ERROR') {
          return {
            data: [
              {
                id: 1,
                title: "Frühjahrsputz am 15. März",
                date: "2024-02-20",
                content: "Gemeinsam machen wir unsere Anlage fit für den Frühling. Treffpunkt 9 Uhr am Vereinshaus."
              },
              {
                id: 2,
                title: "Neue Bewässerungsanlage installiert",
                date: "2024-02-15",
                content: "Dank der Gemeinschaftsaktion haben wir nun eine moderne Tröpfchenbewässerung in Bereich C."
              },
              {
                id: 3,
                title: "Jahreshauptversammlung - Einladung",
                date: "2024-02-10",
                content: "Wir laden herzlich zur Jahreshauptversammlung am 5. April ein. Tagesordnung folgt per Mail."
              }
            ]
          };
        }
        return result.data ? { data: result.data as NewsItem[] } : { error: result.error };
      },
    }),
    addNews: builder.mutation<NewsItem, Partial<NewsItem>>({
      query: (body) => ({
        url: '/news',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation<NewsItem, Partial<NewsItem> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation<void, number>({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useAddNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;