import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/components/Button'
import { validateGame, createNewGame } from '../../utils/gameValidation'
import type { Game, Genre, PlayStatus } from '../../types'

interface GameFormProps {
  game?: Game
  onSubmit: (game: Game) => void
  onCancel: () => void
}

const genreOptions: { value: Genre; label: string }[] = [
  { value: 'action', label: 'アクション' },
  { value: 'rpg', label: 'RPG' },
  { value: 'adventure', label: 'アドベンチャー' },
  { value: 'simulation', label: 'シミュレーション' },
  { value: 'strategy', label: 'ストラテジー' },
  { value: 'shooter', label: 'シューター' },
  { value: 'puzzle', label: 'パズル' },
  { value: 'racing', label: 'レーシング' },
  { value: 'sports', label: 'スポーツ' },
  { value: 'fighting', label: '格闘' },
  { value: 'other', label: 'その他' },
]

const playStatusOptions: { value: PlayStatus; label: string }[] = [
  { value: 'not_started', label: '未プレイ' },
  { value: 'playing', label: 'プレイ中' },
  { value: 'completed', label: 'クリア済み' },
  { value: 'on_hold', label: '中断中' },
]

export function GameForm({ game, onSubmit, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState({
    title: game?.title || '',
    genre: game?.genre || 'action' as Genre,
    playStatus: game?.playStatus || 'not_started' as PlayStatus,
    rating: game?.rating || 3 as 1 | 2 | 3 | 4 | 5,
    playTime: game?.playTime || 0,
    imageUrl: game?.imageUrl || '',
    releaseDate: game?.releaseDate || '',
    developer: game?.developer || '',
    publisher: game?.publisher || '',
    description: game?.description || '',
    platform: game?.platform || '',
    purchaseDate: game?.purchaseDate || '',
    completedDate: game?.completedDate || '',
    memo: game?.memo || '',
    tags: game?.tags?.join(', ') || '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    const gameData = {
      ...formData,
      rating: Number(formData.rating) as 1 | 2 | 3 | 4 | 5,
      playTime: Number(formData.playTime),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    }

    const validation = validateGame(gameData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors([])
    
    if (game) {
      // 編集モード
      onSubmit({
        ...game,
        ...gameData,
        updatedAt: new Date().toISOString(),
      })
    } else {
      // 新規作成モード
      onSubmit(createNewGame(gameData))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border-2 border-switch-red text-switch-red px-6 py-4 rounded-2xl">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-switch-dark mb-2">基本情報</h3>
          
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-switch-dark mb-2">
              タイトル <span className="text-switch-red">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-bold text-switch-dark mb-2">
              ジャンル
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            >
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-bold text-switch-dark mb-2">
              プラットフォーム
            </label>
            <input
              type="text"
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-bold text-switch-dark mb-2">
              発売日 <span className="text-switch-red">*</span>
            </label>
            <input
              type="date"
              id="releaseDate"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="developer" className="block text-sm font-bold text-switch-dark mb-2">
              開発元 <span className="text-switch-red">*</span>
            </label>
            <input
              type="text"
              id="developer"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="publisher" className="block text-sm font-bold text-switch-dark mb-2">
              発売元 <span className="text-switch-red">*</span>
            </label>
            <input
              type="text"
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>
        </div>

        {/* プレイ情報 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-switch-dark mb-2">プレイ情報</h3>
          
          <div>
            <label htmlFor="playStatus" className="block text-sm font-bold text-switch-dark mb-2">
              プレイ状況
            </label>
            <select
              id="playStatus"
              value={formData.playStatus}
              onChange={(e) => setFormData({ ...formData, playStatus: e.target.value as PlayStatus })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            >
              {playStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-bold text-switch-dark mb-2">
              評価
            </label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value.toString()}>
                  {'★'.repeat(value) + '☆'.repeat(5 - value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="playTime" className="block text-sm font-bold text-switch-dark mb-2">
              プレイ時間（分）
            </label>
            <input
              type="number"
              id="playTime"
              min="0"
              value={formData.playTime}
              onChange={(e) => setFormData({ ...formData, playTime: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-bold text-switch-dark mb-2">
              購入日
            </label>
            <input
              type="date"
              id="purchaseDate"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>

          <div>
            <label htmlFor="completedDate" className="block text-sm font-bold text-switch-dark mb-2">
              クリア日
            </label>
            <input
              type="date"
              id="completedDate"
              value={formData.completedDate}
              onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-switch-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-switch-blue focus:border-switch-blue transition-all"
            />
          </div>
        </div>
      </div>

      {/* その他の情報 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-switch-dark mb-2">その他の情報</h3>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-bold text-switch-dark mb-2">
            画像URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-switch-dark mb-2">
            説明
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="memo" className="block text-sm font-bold text-switch-dark mb-2">
            メモ
          </label>
          <textarea
            id="memo"
            rows={3}
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-bold text-switch-dark mb-2">
            タグ（カンマ区切り）
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="例: オープンワールド, アクション, マルチプレイ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary">
          {game ? 'ゲームを更新' : 'ゲームを登録'}
        </Button>
      </div>
    </form>
  )
}