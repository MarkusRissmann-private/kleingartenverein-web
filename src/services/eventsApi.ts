import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Event {
  id: number;
  date: string;
  title: string;
  time: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ('/events');
        if (result.error?.status === 404 || result.error?.status === 'FETCH_ERROR') {
          return {
            data: [
              { id: 1, date: "15.03.2025", title: "Frühjahrsputz", time: "09:00" },
              { id: 2, date: "05.04.2025", title: "Jahreshauptversammlung", time: "18:00" },
              { id: 3, date: "01.05.2025", title: "Maifest", time: "14:00" },
              { id: 4, date: "15.06.2025", title: "Sommerfest", time: "15:00" }
            ]
          };
        }
        return result.data ? { data: result.data as Event[] } : { error: result.error };
      },
    }),
    addEvent: builder.mutation<Event, Partial<Event>>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<Event, Partial<Event> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;