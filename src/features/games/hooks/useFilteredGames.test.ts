import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useFilteredGames } from './useFilteredGames'
import gamesReducer, { setGames } from '../store/gamesSlice'
import filtersReducer, { setStatusFilter, setGenreFilter, setSortBy, setSortOrder } from '@/features/filters/store/filtersSlice'
import { createNewGame } from '../utils/gameValidation'
import React from 'react'
import type { ReactNode } from 'react'

describe('useFilteredGames', () => {
  const createWrapper = (store: ReturnType<typeof configureStore>) => {
    return ({ children }: { children: ReactNode }) => 
      React.createElement(Provider, { store, children })
  }

  const mockGames = [
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
      title: 'ポケモン SV',
      genre: 'rpg',
      playStatus: 'completed',
      rating: 4,
      playTime: 80,
      imageUrl: '',
      releaseDate: '2022-11-18',
      developer: 'ゲームフリーク',
      publisher: '任天堂',
    }),
    createNewGame({
      title: 'スプラトゥーン3',
      genre: 'shooter',
      playStatus: 'playing',
      rating: 4,
      playTime: 100,
      imageUrl: '',
      releaseDate: '2022-09-09',
      developer: '任天堂',
      publisher: '任天堂',
    }),
    createNewGame({
      title: 'ピクミン4',
      genre: 'strategy',
      playStatus: 'not_started',
      rating: 3,
      playTime: 0,
      imageUrl: '',
      releaseDate: '2023-07-21',
      developer: '任天堂',
      publisher: '任天堂',
    }),
  ]

  it('すべてのゲームを返す（フィルタなし）', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(4)
  })

  it('ステータスでフィルタリングできる', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setStatusFilter('playing'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(2)
    expect(result.current.every(game => game.playStatus === 'playing')).toBe(true)
  })

  it('ジャンルでフィルタリングできる', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setGenreFilter('action'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(1)
    expect(result.current[0].genre).toBe('action')
  })

  it('タイトルでソートできる（昇順）', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setSortBy('title'))
    store.dispatch(setSortOrder('asc'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    const titles = result.current.map(game => game.title)
    expect(titles).toEqual(['スプラトゥーン3', 'ゼルダの伝説', 'ピクミン4', 'ポケモン SV'])
  })

  it('評価でソートできる（降順）', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setSortBy('rating'))
    store.dispatch(setSortOrder('desc'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    const ratings = result.current.map(game => game.rating)
    expect(ratings).toEqual([5, 4, 4, 3])
  })

  it('プレイ時間でソートできる（昇順）', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setSortBy('playTime'))
    store.dispatch(setSortOrder('asc'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    const playTimes = result.current.map(game => game.playTime)
    expect(playTimes).toEqual([0, 80, 100, 120])
  })

  it('複数のフィルタとソートを組み合わせて使える', () => {
    const store = configureStore({
      reducer: { games: gamesReducer, filters: filtersReducer },
    })
    store.dispatch(setGames(mockGames))
    store.dispatch(setStatusFilter('playing'))
    store.dispatch(setSortBy('playTime'))
    store.dispatch(setSortOrder('desc'))

    const { result } = renderHook(() => useFilteredGames(), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(2)
    expect(result.current[0].title).toBe('ゼルダの伝説')
    expect(result.current[1].title).toBe('スプラトゥーン3')
  })
})