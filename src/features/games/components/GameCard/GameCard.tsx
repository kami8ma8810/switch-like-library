import type { Game } from '../../types'
import { formatPlayTime } from '../../utils/gameValidation'

interface GameCardProps {
  game: Game
  onClick?: (game: Game) => void
}

const playStatusConfig = {
  not_started: {
    label: '未プレイ',
    bgColor: 'bg-switch-gray-200',
    textColor: 'text-switch-gray-600',
  },
  playing: {
    label: 'プレイ中',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  completed: {
    label: 'クリア済み',
    bgColor: 'bg-switch-blue bg-opacity-10',
    textColor: 'text-switch-blue',
  },
  on_hold: {
    label: '中断中',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
}

const genreLabels: Record<Game['genre'], string> = {
  action: 'アクション',
  rpg: 'RPG',
  adventure: 'アドベンチャー',
  simulation: 'シミュレーション',
  strategy: 'ストラテジー',
  shooter: 'シューター',
  puzzle: 'パズル',
  racing: 'レーシング',
  sports: 'スポーツ',
  fighting: '格闘',
  other: 'その他',
}

export function GameCard({ game, onClick }: GameCardProps) {
  const statusConfig = playStatusConfig[game.playStatus]

  return (
    <article
      className="switch-card game-card overflow-hidden cursor-pointer animate-fade-in"
      onClick={() => onClick?.(game)}
      role="article"
    >
      <div className="aspect-[16/9] relative bg-gray-200">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            data-testid="image-placeholder"
            className="w-full h-full flex items-center justify-center text-gray-400"
          >
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-switch-dark">{game.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-switch-gray-500 font-medium">{genreLabels[game.genre]}</span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                data-testid="star-icon"
                className={`w-5 h-5 ${
                  i < game.rating ? 'text-yellow-400' : 'text-switch-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-switch-gray-500">
            {formatPlayTime(game.playTime)}
          </span>
        </div>
      </div>
    </article>
  )
}