import { configureStore } from '@reduxjs/toolkit'
import gamesReducer from '@/features/games/store/gamesSlice'
import filtersReducer from '@/features/filters/store/filtersSlice'

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    filters: filtersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch