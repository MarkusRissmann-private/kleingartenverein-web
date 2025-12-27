import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { newsApi } from '../services/newsApi';
import { eventsApi } from '../services/eventsApi';

export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(newsApi.middleware)
      .concat(eventsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;