import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Game, PlayStatus, Genre } from '../types'

interface GamesState {
  games: Game[]
  isLoading: boolean
  error: string | null
}

const initialState: GamesState = {
  games: [],
  isLoading: false,
  error: null,
}

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    addGame: (state, action: PayloadAction<Game>) => {
      state.games.push(action.payload)
    },
    updateGame: (state, action: PayloadAction<Game>) => {
      const index = state.games.findIndex(game => game.id === action.payload.id)
      if (index !== -1) {
        state.games[index] = action.payload
      }
    },
    deleteGame: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter(game => game.id !== action.payload)
    },
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  addGame,
  updateGame,
  deleteGame,
  setGames,
  setLoading,
  setError,
} = gamesSlice.actions

// Selectors
import type { RootState } from '@/app/store'

export const selectAllGames = (state: RootState): Game[] => state.games.games

export const selectGameById = (state: RootState, gameId: string): Game | undefined => 
  state.games.games.find(game => game.id === gameId)

export const selectGamesByStatus = (state: RootState, status: PlayStatus): Game[] =>
  state.games.games.filter(game => game.playStatus === status)

export const selectGamesByGenre = (state: RootState, genre: Genre): Game[] =>
  state.games.games.filter(game => game.genre === genre)

export const selectIsLoading = (state: RootState): boolean => state.games.isLoading

export const selectError = (state: RootState): string | null => state.games.error

export default gamesSlice.reducer