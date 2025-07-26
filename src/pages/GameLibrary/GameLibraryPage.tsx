import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useFilteredGames } from '@/features/games/hooks/useFilteredGames'
import { GameList } from '@/features/games/components/GameList'
import { GameForm } from '@/features/games/components/GameForm'
import { FilterBar } from '@/features/filters/components/FilterBar'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { setGames, addGame, updateGame, selectAllGames } from '@/features/games/store/gamesSlice'
import { storageService } from '@/features/games/services/storageService'
import { createNewGame } from '@/features/games/utils/gameValidation'
import type { Game } from '@/features/games/types'

export function GameLibraryPage() {
  const dispatch = useAppDispatch()
  const games = useFilteredGames()
  const allGames = useAppSelector(selectAllGames)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | undefined>(undefined)

  useEffect(() => {
    // LocalStorageからゲームを読み込む
    const savedGames = storageService.loadGames()
    
    // デモデータがない場合はサンプルデータを追加
    if (savedGames.length === 0) {
      const demoGames = [
        createNewGame({
          title: 'ゼルダの伝説 ティアーズ オブ ザ キングダム',
          genre: 'action',
          playStatus: 'playing',
          rating: 5,
          playTime: 120,
          imageUrl: '',
          releaseDate: '2023-05-12',
          developer: '任天堂',
          publisher: '任天堂',
          description: 'ハイラルの大地と大空を舞台に、驚きと感動の冒険が再び始まる。',
        }),
        createNewGame({
          title: 'スプラトゥーン3',
          genre: 'shooter',
          playStatus: 'completed',
          rating: 4,
          playTime: 80,
          imageUrl: '',
          releaseDate: '2022-09-09',
          developer: '任天堂',
          publisher: '任天堂',
          description: 'イカしたシューティングゲーム第3弾！',
        }),
        createNewGame({
          title: 'ポケットモンスター スカーレット・バイオレット',
          genre: 'rpg',
          playStatus: 'playing',
          rating: 4,
          playTime: 45,
          imageUrl: '',
          releaseDate: '2022-11-18',
          developer: 'ゲームフリーク',
          publisher: '任天堂',
          description: 'オープンワールドで楽しむ新しいポケモンの冒険。',
        }),
      ]
      dispatch(setGames(demoGames))
      storageService.saveGames(demoGames)
    } else {
      dispatch(setGames(savedGames))
    }
  }, [dispatch])

  // ゲームデータが変更されたらLocalStorageに保存
  useEffect(() => {
    if (allGames.length > 0) {
      storageService.saveGames(allGames)
    }
  }, [allGames])

  const handleAddGame = () => {
    setEditingGame(undefined)
    setIsFormOpen(true)
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setIsFormOpen(true)
  }

  // const handleDeleteGame = (game: Game) => {
  //   if (window.confirm(`「${game.title}」を削除しますか？`)) {
  //     dispatch(deleteGame(game.id))
  //   }
  // }

  const handleFormSubmit = (game: Game) => {
    if (editingGame) {
      dispatch(updateGame(game))
    } else {
      dispatch(addGame(game))
    }
    setIsFormOpen(false)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingGame(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ゲームライブラリ
            </h1>
            <p className="text-gray-600">
              あなたのゲームコレクションを管理しましょう
            </p>
          </div>
          <Button onClick={handleAddGame}>
            ゲームを追加
          </Button>
        </div>
      </header>

      <main>
        <FilterBar />
        <GameList 
          games={games} 
          onGameClick={handleEditGame}
        />
      </main>

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingGame ? 'ゲームを編集' : 'ゲームを追加'}
      >
        <GameForm
          game={editingGame}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  )
}