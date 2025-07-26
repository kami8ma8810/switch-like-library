import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import gamesReducer, {
  addGame,
  updateGame,
  deleteGame,
  setGames,
  selectAllGames,
  selectGameById,
  selectGamesByStatus,
  selectGamesByGenre,
} from './gamesSlice'
import filtersReducer from '@/features/filters/store/filtersSlice'
import type { Game } from '../types'
import { createNewGame } from '../utils/gameValidation'
import type { RootState } from '@/app/store'

describe('gamesSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>
  
  const mockGame1: Game = createNewGame({
    title: 'ゼルダの伝説',
    genre: 'action',
    playStatus: 'playing',
    rating: 5,
    playTime: 120,
    imageUrl: 'https://example.com/zelda.jpg',
    releaseDate: '2023-05-12',
    developer: '任天堂',
    publisher: '任天堂',
  })

  const mockGame2: Game = createNewGame({
    title: 'スプラトゥーン3',
    genre: 'shooter',
    playStatus: 'completed',
    rating: 4,
    playTime: 80,
    imageUrl: 'https://example.com/splatoon.jpg',
    releaseDate: '2022-09-09',
    developer: '任天堂',
    publisher: '任天堂',
  })

  beforeEach(() => {
    store = configureStore({
      reducer: {
        games: gamesReducer,
        filters: filtersReducer,
      },
    })
  })

  describe('actions', () => {
    it('addGameアクションで新しいゲームを追加できる', () => {
      store.dispatch(addGame(mockGame1))
      const state = store.getState()
      const games = selectAllGames(state)
      
      expect(games).toHaveLength(1)
      expect(games[0]).toEqual(mockGame1)
    })

    it('updateGameアクションで既存のゲームを更新できる', () => {
      store.dispatch(addGame(mockGame1))
      
      const updatedGame = {
        ...mockGame1,
        playStatus: 'completed' as const,
        playTime: 150,
      }
      
      store.dispatch(updateGame(updatedGame))
      const state = store.getState()
      const game = selectGameById(state, mockGame1.id)
      
      expect(game?.playStatus).toBe('completed')
      expect(game?.playTime).toBe(150)
    })

    it('deleteGameアクションでゲームを削除できる', () => {
      store.dispatch(addGame(mockGame1))
      store.dispatch(addGame(mockGame2))
      
      store.dispatch(deleteGame(mockGame1.id))
      const state = store.getState()
      const games = selectAllGames(state)
      
      expect(games).toHaveLength(1)
      expect(games[0].id).toBe(mockGame2.id)
    })

    it('setGamesアクションで複数のゲームを一度に設定できる', () => {
      const games = [mockGame1, mockGame2]
      store.dispatch(setGames(games))
      
      const state = store.getState()
      const allGames = selectAllGames(state)
      
      expect(allGames).toHaveLength(2)
      expect(allGames).toEqual(games)
    })
  })

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(setGames([mockGame1, mockGame2]))
    })

    it('selectAllGamesですべてのゲームを取得できる', () => {
      const state = store.getState()
      const games = selectAllGames(state)
      
      expect(games).toHaveLength(2)
      expect(games[0]).toEqual(mockGame1)
      expect(games[1]).toEqual(mockGame2)
    })

    it('selectGameByIdで特定のゲームを取得できる', () => {
      const state = store.getState()
      const game = selectGameById(state, mockGame1.id)
      
      expect(game).toEqual(mockGame1)
    })

    it('selectGameByIdで存在しないIDの場合undefinedを返す', () => {
      const state = store.getState()
      const game = selectGameById(state, 'non-existent-id')
      
      expect(game).toBeUndefined()
    })

    it('selectGamesByStatusでステータスごとにゲームをフィルタできる', () => {
      const state = store.getState()
      
      const playingGames = selectGamesByStatus(state, 'playing')
      expect(playingGames).toHaveLength(1)
      expect(playingGames[0].id).toBe(mockGame1.id)
      
      const completedGames = selectGamesByStatus(state, 'completed')
      expect(completedGames).toHaveLength(1)
      expect(completedGames[0].id).toBe(mockGame2.id)
      
      const notStartedGames = selectGamesByStatus(state, 'not_started')
      expect(notStartedGames).toHaveLength(0)
    })

    it('selectGamesByGenreでジャンルごとにゲームをフィルタできる', () => {
      const state = store.getState()
      
      const actionGames = selectGamesByGenre(state, 'action')
      expect(actionGames).toHaveLength(1)
      expect(actionGames[0].id).toBe(mockGame1.id)
      
      const shooterGames = selectGamesByGenre(state, 'shooter')
      expect(shooterGames).toHaveLength(1)
      expect(shooterGames[0].id).toBe(mockGame2.id)
      
      const rpgGames = selectGamesByGenre(state, 'rpg')
      expect(rpgGames).toHaveLength(0)
    })
  })
})