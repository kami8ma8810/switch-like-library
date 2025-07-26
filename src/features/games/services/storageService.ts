import type { Game } from '../types'

const STORAGE_KEY = 'switch-library-games'

export const storageService = {
  saveGames(games: Game[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
    } catch (error) {
      console.error('Failed to save games to localStorage:', error)
    }
  },

  loadGames(): Game[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const parsed = JSON.parse(stored)
      
      // 配列でない場合は空配列を返す
      if (!Array.isArray(parsed)) return []
      
      return parsed
    } catch (error) {
      console.error('Failed to load games from localStorage:', error)
      return []
    }
  },

  clearGames(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear games from localStorage:', error)
    }
  },
}