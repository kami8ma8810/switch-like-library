import { describe, it, expect } from 'vitest'
import type { Game, PlayStatus, Genre } from './Game'

describe('Game型', () => {
  it('必須フィールドを持つGame型を作成できる', () => {
    const game: Game = {
      id: '1',
      title: 'ゼルダの伝説 ティアーズ オブ ザ キングダム',
      genre: 'action',
      playStatus: 'playing',
      rating: 5,
      playTime: 120,
      imageUrl: 'https://example.com/zelda.jpg',
      releaseDate: '2023-05-12',
      developer: '任天堂',
      publisher: '任天堂',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    }

    expect(game.id).toBe('1')
    expect(game.title).toBe('ゼルダの伝説 ティアーズ オブ ザ キングダム')
    expect(game.genre).toBe('action')
    expect(game.playStatus).toBe('playing')
    expect(game.rating).toBe(5)
    expect(game.playTime).toBe(120)
  })

  it('オプショナルフィールドを含むGame型を作成できる', () => {
    const game: Game = {
      id: '2',
      title: 'スプラトゥーン3',
      genre: 'shooter',
      playStatus: 'completed',
      rating: 4,
      playTime: 80,
      imageUrl: 'https://example.com/splatoon.jpg',
      releaseDate: '2022-09-09',
      developer: '任天堂',
      publisher: '任天堂',
      description: 'イカしたシューティングゲーム',
      platform: 'Nintendo Switch',
      purchaseDate: '2022-09-09',
      completedDate: '2023-03-15',
      memo: 'フレンドと楽しくプレイ',
      tags: ['マルチプレイ', 'アクション', '対戦'],
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    }

    expect(game.description).toBe('イカしたシューティングゲーム')
    expect(game.platform).toBe('Nintendo Switch')
    expect(game.purchaseDate).toBe('2022-09-09')
    expect(game.completedDate).toBe('2023-03-15')
    expect(game.memo).toBe('フレンドと楽しくプレイ')
    expect(game.tags).toEqual(['マルチプレイ', 'アクション', '対戦'])
  })

  it('PlayStatus型が正しい値を持つ', () => {
    const statuses: PlayStatus[] = ['not_started', 'playing', 'completed', 'on_hold']
    
    statuses.forEach(status => {
      const game: Game = {
        id: '3',
        title: 'Test Game',
        genre: 'rpg',
        playStatus: status,
        rating: 3,
        playTime: 0,
        imageUrl: '',
        releaseDate: '2024-01-01',
        developer: 'Test',
        publisher: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      expect(game.playStatus).toBe(status)
    })
  })

  it('Genre型が正しい値を持つ', () => {
    const genres: Genre[] = [
      'action', 'rpg', 'adventure', 'simulation', 'strategy',
      'shooter', 'puzzle', 'racing', 'sports', 'fighting', 'other'
    ]
    
    genres.forEach(genre => {
      const game: Game = {
        id: '4',
        title: 'Test Game',
        genre: genre,
        playStatus: 'not_started',
        rating: 3,
        playTime: 0,
        imageUrl: '',
        releaseDate: '2024-01-01',
        developer: 'Test',
        publisher: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      expect(game.genre).toBe(genre)
    })
  })

  it('評価は1から5の範囲である', () => {
    const ratings = [1, 2, 3, 4, 5] as const
    
    ratings.forEach(rating => {
      const game: Game = {
        id: '5',
        title: 'Test Game',
        genre: 'action',
        playStatus: 'completed',
        rating: rating,
        playTime: 10,
        imageUrl: '',
        releaseDate: '2024-01-01',
        developer: 'Test',
        publisher: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      expect(game.rating).toBeGreaterThanOrEqual(1)
      expect(game.rating).toBeLessThanOrEqual(5)
    })
  })

  it('プレイ時間は0以上の数値である', () => {
    const game: Game = {
      id: '6',
      title: 'Test Game',
      genre: 'puzzle',
      playStatus: 'playing',
      rating: 3,
      playTime: 0,
      imageUrl: '',
      releaseDate: '2024-01-01',
      developer: 'Test',
      publisher: 'Test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    expect(game.playTime).toBeGreaterThanOrEqual(0)
  })
})