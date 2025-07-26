import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PlayStatus, Genre } from '@/features/games/types'

export type SortBy = 'title' | 'rating' | 'playTime' | 'releaseDate' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export type StatusFilterValue = PlayStatus | 'all'
export type GenreFilterValue = Genre | 'all'

interface FiltersState {
  statusFilter: StatusFilterValue
  genreFilter: GenreFilterValue
  sortBy: SortBy
  sortOrder: SortOrder
}

const initialState: FiltersState = {
  statusFilter: 'all',
  genreFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<StatusFilterValue>) => {
      state.statusFilter = action.payload
    },
    setGenreFilter: (state, action: PayloadAction<GenreFilterValue>) => {
      state.genreFilter = action.payload
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload
    },
    resetFilters: () => initialState,
  },
})

export const {
  setStatusFilter,
  setGenreFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
} = filtersSlice.actions

// Selectors
import type { RootState } from '@/app/store'

export const selectStatusFilter = (state: RootState): StatusFilterValue =>
  state.filters.statusFilter

export const selectGenreFilter = (state: RootState): GenreFilterValue =>
  state.filters.genreFilter

export const selectSortBy = (state: RootState): SortBy =>
  state.filters.sortBy

export const selectSortOrder = (state: RootState): SortOrder =>
  state.filters.sortOrder

export const selectActiveFiltersCount = (state: RootState): number => {
  let count = 0
  if (state.filters.statusFilter !== 'all') count++
  if (state.filters.genreFilter !== 'all') count++
  return count
}

export default filtersSlice.reducer