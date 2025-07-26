import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useFilteredGames } from '@/features/games/hooks/useFilteredGames'
import { GameList } from '@/features/games/components/GameList'
import { setGames } from '@/features/games/store/gamesSlice'
import { storageService } from '@/features/games/services/storageService'
import { createNewGame } from '@/features/games/utils/gameValidation'

export function GameLibraryPage() {
  const dispatch = useAppDispatch()
  const games = useFilteredGames()

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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ゲームライブラリ
        </h1>
        <p className="text-gray-600">
          あなたのゲームコレクションを管理しましょう
        </p>
      </header>

      <main>
        <GameList games={games} />
      </main>
    </div>
  )
}