import { GameCard } from '../GameCard'
import type { Game } from '../../types'

interface GameListProps {
  games: Game[]
  onGameClick?: (game: Game) => void
}

export function GameList({ games, onGameClick }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">ゲームが登録されていません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={onGameClick} />
      ))}
    </div>
  )
}