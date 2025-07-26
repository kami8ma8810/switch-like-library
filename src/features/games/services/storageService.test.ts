import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storageService } from './storageService'
import { createNewGame } from '../utils/gameValidation'
import type { Game } from '../types'

describe('storageService', () => {
  const mockGames: Game[] = [
    createNewGame({
      title: 'ゼルダの伝説',
      genre: 'action',
      playStatus: 'playing',
      rating: 5,
      playTime: 120,
      imageUrl: '',
      releaseDate: '2023-05-12',
      developer: '任天堂',
      publisher: '任天堂',
    }),
    createNewGame({
      title: 'スプラトゥーン3',
      genre: 'shooter',
      playStatus: 'completed',
      rating: 4,
      playTime: 80,
      imageUrl: '',
      releaseDate: '2022-09-09',
      developer: '任天堂',
      publisher: '任天堂',
    }),
  ]

  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear()
    // localStorageのモックをリセット
    vi.clearAllMocks()
  })

  describe('saveGames', () => {
    it('ゲームデータをlocalStorageに保存できる', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      
      storageService.saveGames(mockGames)
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'switch-library-games',
        JSON.stringify(mockGames)
      )
    })

    it('空の配列も保存できる', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      
      storageService.saveGames([])
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'switch-library-games',
        JSON.stringify([])
      )
    })
  })

  describe('loadGames', () => {
    it('localStorageからゲームデータを読み込める', () => {
      localStorage.setItem('switch-library-games', JSON.stringify(mockGames))
      
      const loadedGames = storageService.loadGames()
      
      expect(loadedGames).toEqual(mockGames)
    })

    it('データが存在しない場合は空の配列を返す', () => {
      const loadedGames = storageService.loadGames()
      
      expect(loadedGames).toEqual([])
    })

    it('不正なJSONデータの場合は空の配列を返す', () => {
      localStorage.setItem('switch-library-games', 'invalid json')
      
      const loadedGames = storageService.loadGames()
      
      expect(loadedGames).toEqual([])
    })

    it('配列以外のデータの場合は空の配列を返す', () => {
      localStorage.setItem('switch-library-games', JSON.stringify({ invalid: 'data' }))
      
      const loadedGames = storageService.loadGames()
      
      expect(loadedGames).toEqual([])
    })
  })

  describe('clearGames', () => {
    it('localStorageからゲームデータを削除できる', () => {
      localStorage.setItem('switch-library-games', JSON.stringify(mockGames))
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
      
      storageService.clearGames()
      
      expect(removeItemSpy).toHaveBeenCalledWith('switch-library-games')
      expect(localStorage.getItem('switch-library-games')).toBeNull()
    })
  })

  describe('localStorageが利用できない場合', () => {
    it('saveGamesでエラーをconsole.errorに出力する', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      storageService.saveGames(mockGames)
      
      expect(setItemSpy).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save games to localStorage:',
        expect.any(Error)
      )
    })

    it('loadGamesで空の配列を返す', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const loadedGames = storageService.loadGames()
      
      expect(loadedGames).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load games from localStorage:',
        expect.any(Error)
      )
    })
  })
})