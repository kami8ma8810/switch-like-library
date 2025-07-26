import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameCard } from './GameCard'
import { createNewGame } from '../../utils/gameValidation'

describe('GameCard', () => {
  const mockGame = createNewGame({
    title: 'ゼルダの伝説 ティアーズ オブ ザ キングダム',
    genre: 'action',
    playStatus: 'playing',
    rating: 5,
    playTime: 120,
    imageUrl: 'https://example.com/zelda.jpg',
    releaseDate: '2023-05-12',
    developer: '任天堂',
    publisher: '任天堂',
  })

  it('ゲームの基本情報を表示する', () => {
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('ゼルダの伝説 ティアーズ オブ ザ キングダム')).toBeInTheDocument()
    expect(screen.getByText('アクション')).toBeInTheDocument()
    expect(screen.getByText('プレイ中')).toBeInTheDocument()
    expect(screen.getByText('2時間')).toBeInTheDocument()
  })

  it('ゲーム画像を表示する', () => {
    render(<GameCard game={mockGame} />)
    
    const image = screen.getByAltText('ゼルダの伝説 ティアーズ オブ ザ キングダム')
    expect(image).toHaveAttribute('src', 'https://example.com/zelda.jpg')
  })

  it('評価を星で表示する', () => {
    render(<GameCard game={mockGame} />)
    
    const stars = screen.getAllByTestId('star-icon')
    expect(stars).toHaveLength(5)
    const filledStars = stars.filter(star => star.classList.contains('text-yellow-400'))
    expect(filledStars).toHaveLength(5)
  })

  it('プレイステータスに応じた色を表示する', () => {
    const { rerender } = render(<GameCard game={mockGame} />)
    expect(screen.getByText('プレイ中')).toHaveClass('bg-green-100')
    
    const completedGame = { ...mockGame, playStatus: 'completed' as const }
    rerender(<GameCard game={completedGame} />)
    expect(screen.getByText('クリア済み')).toHaveClass('bg-opacity-10')
    
    const notStartedGame = { ...mockGame, playStatus: 'not_started' as const }
    rerender(<GameCard game={notStartedGame} />)
    expect(screen.getByText('未プレイ')).toHaveClass('bg-switch-gray-200')
    
    const onHoldGame = { ...mockGame, playStatus: 'on_hold' as const }
    rerender(<GameCard game={onHoldGame} />)
    expect(screen.getByText('中断中')).toHaveClass('bg-yellow-100')
  })

  it('クリックイベントが発火する', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<GameCard game={mockGame} onClick={handleClick} />)
    await user.click(screen.getByRole('article'))
    
    expect(handleClick).toHaveBeenCalledWith(mockGame)
  })

  it('画像がない場合はプレースホルダーを表示する', () => {
    const gameWithoutImage = { ...mockGame, imageUrl: '' }
    render(<GameCard game={gameWithoutImage} />)
    
    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument()
  })
})