export type PlayStatus = 'not_started' | 'playing' | 'completed' | 'on_hold'

export type Genre = 
  | 'action'
  | 'rpg'
  | 'adventure'
  | 'simulation'
  | 'strategy'
  | 'shooter'
  | 'puzzle'
  | 'racing'
  | 'sports'
  | 'fighting'
  | 'other'

export interface Game {
  id: string
  title: string
  genre: Genre
  playStatus: PlayStatus
  rating: 1 | 2 | 3 | 4 | 5
  playTime: number
  imageUrl: string
  releaseDate: string
  developer: string
  publisher: string
  description?: string
  platform?: string
  purchaseDate?: string
  completedDate?: string
  memo?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}