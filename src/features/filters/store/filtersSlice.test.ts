import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import filtersReducer, {
  setStatusFilter,
  setGenreFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
  selectStatusFilter,
  selectGenreFilter,
  selectSortBy,
  selectSortOrder,
  selectActiveFiltersCount,
} from './filtersSlice'
import gamesReducer from '@/features/games/store/gamesSlice'
import type { RootState } from '@/app/store'

describe('filtersSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        games: gamesReducer,
        filters: filtersReducer,
      },
    })
  })

  describe('actions', () => {
    it('setStatusFilterでステータスフィルタを設定できる', () => {
      store.dispatch(setStatusFilter('playing'))
      const state = store.getState()
      expect(selectStatusFilter(state)).toBe('playing')
    })

    it('setGenreFilterでジャンルフィルタを設定できる', () => {
      store.dispatch(setGenreFilter('action'))
      const state = store.getState()
      expect(selectGenreFilter(state)).toBe('action')
    })

    it('setSortByでソート項目を設定できる', () => {
      store.dispatch(setSortBy('rating'))
      const state = store.getState()
      expect(selectSortBy(state)).toBe('rating')
    })

    it('setSortOrderでソート順を設定できる', () => {
      store.dispatch(setSortOrder('desc'))
      const state = store.getState()
      expect(selectSortOrder(state)).toBe('desc')
    })

    it('resetFiltersですべてのフィルタをリセットできる', () => {
      // フィルタを設定
      store.dispatch(setStatusFilter('completed'))
      store.dispatch(setGenreFilter('rpg'))
      store.dispatch(setSortBy('playTime'))
      store.dispatch(setSortOrder('desc'))

      // リセット
      store.dispatch(resetFilters())
      const state = store.getState()

      expect(selectStatusFilter(state)).toBe('all')
      expect(selectGenreFilter(state)).toBe('all')
      expect(selectSortBy(state)).toBe('createdAt')
      expect(selectSortOrder(state)).toBe('desc')
    })
  })

  describe('selectors', () => {
    it('初期状態では正しいデフォルト値を返す', () => {
      const state = store.getState()
      
      expect(selectStatusFilter(state)).toBe('all')
      expect(selectGenreFilter(state)).toBe('all')
      expect(selectSortBy(state)).toBe('createdAt')
      expect(selectSortOrder(state)).toBe('desc')
    })

    it('selectActiveFiltersCountでアクティブなフィルタ数を取得できる', () => {
      const state1 = store.getState()
      expect(selectActiveFiltersCount(state1)).toBe(0)

      store.dispatch(setStatusFilter('playing'))
      const state2 = store.getState()
      expect(selectActiveFiltersCount(state2)).toBe(1)

      store.dispatch(setGenreFilter('action'))
      const state3 = store.getState()
      expect(selectActiveFiltersCount(state3)).toBe(2)

      // ソート項目の変更はフィルタ数に含まない
      store.dispatch(setSortBy('rating'))
      const state4 = store.getState()
      expect(selectActiveFiltersCount(state4)).toBe(2)
    })
  })
})