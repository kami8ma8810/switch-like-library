import type { Game } from '../types'

export function isValidRating(rating: number): rating is 1 | 2 | 3 | 4 | 5 {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

export function isValidPlayTime(playTime: number): boolean {
  return Number.isInteger(playTime) && playTime >= 0
}

export function validateGame(
  game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!game.title || game.title.trim() === '') {
    errors.push('タイトルは必須です')
  }

  if (!game.releaseDate) {
    errors.push('発売日は必須です')
  }

  if (!game.developer || game.developer.trim() === '') {
    errors.push('開発元は必須です')
  }

  if (!game.publisher || game.publisher.trim() === '') {
    errors.push('発売元は必須です')
  }

  if (!isValidRating(game.rating)) {
    errors.push('評価は1から5の間で入力してください')
  }

  if (!isValidPlayTime(game.playTime)) {
    errors.push('プレイ時間は0以上の整数で入力してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function createNewGame(
  gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>
): Game {
  const now = new Date().toISOString()
  
  return {
    ...gameData,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
}

export function formatPlayTime(minutes: number): string {
  if (minutes === 0) {
    return '0分'
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}分`
  }

  if (remainingMinutes === 0) {
    return `${hours}時間`
  }

  return `${hours}時間${remainingMinutes}分`
}