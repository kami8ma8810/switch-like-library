import { describe, it, expect } from 'vitest'
import { 
  isValidRating, 
  isValidPlayTime, 
  validateGame,
  createNewGame,
  formatPlayTime 
} from './gameValidation'
import type { Game } from '../types'

describe('gameValidation', () => {
  describe('isValidRating', () => {
    it('1から5の評価を有効と判定する', () => {
      expect(isValidRating(1)).toBe(true)
      expect(isValidRating(2)).toBe(true)
      expect(isValidRating(3)).toBe(true)
      expect(isValidRating(4)).toBe(true)
      expect(isValidRating(5)).toBe(true)
    })

    it('範囲外の評価を無効と判定する', () => {
      expect(isValidRating(0)).toBe(false)
      expect(isValidRating(6)).toBe(false)
      expect(isValidRating(-1)).toBe(false)
      expect(isValidRating(3.5)).toBe(false)
    })
  })

  describe('isValidPlayTime', () => {
    it('0以上の整数を有効と判定する', () => {
      expect(isValidPlayTime(0)).toBe(true)
      expect(isValidPlayTime(1)).toBe(true)
      expect(isValidPlayTime(100)).toBe(true)
      expect(isValidPlayTime(9999)).toBe(true)
    })

    it('負の数を無効と判定する', () => {
      expect(isValidPlayTime(-1)).toBe(false)
      expect(isValidPlayTime(-100)).toBe(false)
    })

    it('小数を無効と判定する', () => {
      expect(isValidPlayTime(1.5)).toBe(false)
      expect(isValidPlayTime(10.25)).toBe(false)
    })
  })

  describe('validateGame', () => {
    const validGame: Omit<Game, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'ゼルダの伝説',
      genre: 'action',
      playStatus: 'playing',
      rating: 5,
      playTime: 120,
      imageUrl: 'https://example.com/zelda.jpg',
      releaseDate: '2023-05-12',
      developer: '任天堂',
      publisher: '任天堂',
    }

    it('有効なゲームデータを検証する', () => {
      const result = validateGame(validGame)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('タイトルが空の場合エラーを返す', () => {
      const invalidGame = { ...validGame, title: '' }
      const result = validateGame(invalidGame)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('タイトルは必須です')
    })

    it('無効な評価の場合エラーを返す', () => {
      const invalidGame = { ...validGame, rating: 0 as 1 }
      const result = validateGame(invalidGame)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('評価は1から5の間で入力してください')
    })

    it('無効なプレイ時間の場合エラーを返す', () => {
      const invalidGame = { ...validGame, playTime: -10 }
      const result = validateGame(invalidGame)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('プレイ時間は0以上の整数で入力してください')
    })

    it('複数のエラーがある場合すべて返す', () => {
      const invalidGame = { 
        ...validGame, 
        title: '', 
        rating: 10 as 1,
        playTime: -5 
      }
      const result = validateGame(invalidGame)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBe(3)
    })
  })

  describe('createNewGame', () => {
    it('新しいゲームオブジェクトを作成する', () => {
      const gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'スプラトゥーン3',
        genre: 'shooter',
        playStatus: 'playing',
        rating: 4,
        playTime: 50,
        imageUrl: 'https://example.com/splatoon.jpg',
        releaseDate: '2022-09-09',
        developer: '任天堂',
        publisher: '任天堂',
      }

      const newGame = createNewGame(gameData)

      expect(newGame.id).toBeDefined()
      expect(newGame.id).toMatch(/^[a-f0-9-]+$/)
      expect(newGame.title).toBe('スプラトゥーン3')
      expect(newGame.createdAt).toBeDefined()
      expect(newGame.updatedAt).toBeDefined()
      expect(newGame.createdAt).toBe(newGame.updatedAt)
    })
  })

  describe('formatPlayTime', () => {
    it('0分を正しくフォーマットする', () => {
      expect(formatPlayTime(0)).toBe('0分')
    })

    it('60分未満を分単位でフォーマットする', () => {
      expect(formatPlayTime(30)).toBe('30分')
      expect(formatPlayTime(59)).toBe('59分')
    })

    it('60分以上を時間と分でフォーマットする', () => {
      expect(formatPlayTime(60)).toBe('1時間')
      expect(formatPlayTime(90)).toBe('1時間30分')
      expect(formatPlayTime(120)).toBe('2時間')
      expect(formatPlayTime(135)).toBe('2時間15分')
    })

    it('大きな数値を正しくフォーマットする', () => {
      expect(formatPlayTime(600)).toBe('10時間')
      expect(formatPlayTime(999)).toBe('16時間39分')
    })
  })
})