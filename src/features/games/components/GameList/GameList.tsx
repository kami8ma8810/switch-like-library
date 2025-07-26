import { GameCard } from '../GameCard'
import type { Game } from '../../types'

interface GameListProps {
  games: Game[]
  onGameClick?: (game: Game) => void
}

export function GameList({ games, onGameClick }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <svg className="w-24 h-24 mx-auto mb-6 text-switch-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-switch-gray-500 text-xl font-medium mb-4">ゲームが登録されていません</p>
        <p className="text-switch-gray-400">右上のボタンから新しいゲームを追加してください</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {games.map((game, index) => (
        <div
          key={game.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <GameCard game={game} onClick={onGameClick} />
        </div>
      ))}
    </div>
  )
}