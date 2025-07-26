import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameForm } from './GameForm'
import { createNewGame } from '../../utils/gameValidation'
import type { Game } from '../../types'

describe('GameForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  const mockGame: Game = createNewGame({
    title: 'ゼルダの伝説',
    genre: 'action',
    playStatus: 'playing',
    rating: 5,
    playTime: 120,
    imageUrl: 'https://example.com/zelda.jpg',
    releaseDate: '2023-05-12',
    developer: '任天堂',
    publisher: '任天堂',
    description: 'ハイラルの大地での冒険',
    platform: 'Nintendo Switch',
    tags: ['オープンワールド', 'アクション'],
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('新規登録モード', () => {
    it('空のフォームを表示する', () => {
      render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      expect(screen.getByLabelText(/タイトル/)).toHaveValue('')
      expect(screen.getByLabelText(/ジャンル/)).toHaveValue('action')
      expect(screen.getByLabelText(/プレイ状況/)).toHaveValue('not_started')
      expect(screen.getByLabelText(/評価/)).toHaveValue('3')
      expect(screen.getByLabelText(/プレイ時間（分）/)).toHaveValue(0)
      expect(screen.getByText('ゲームを登録')).toBeInTheDocument()
    })

    it('必須項目が入力されていない場合はバリデーションエラーを表示する', async () => {
      const user = userEvent.setup()
      render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const submitButton = screen.getByText('ゲームを登録')
      await user.click(submitButton)

      expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('有効なデータで送信できる', async () => {
      const user = userEvent.setup()
      render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      await user.type(screen.getByLabelText(/タイトル/), 'スプラトゥーン3')
      await user.selectOptions(screen.getByLabelText(/ジャンル/), 'shooter')
      await user.selectOptions(screen.getByLabelText(/プレイ状況/), 'playing')
      await user.selectOptions(screen.getByLabelText(/評価/), '4')
      await user.clear(screen.getByLabelText(/プレイ時間（分）/))
      await user.type(screen.getByLabelText(/プレイ時間（分）/), '60')
      await user.type(screen.getByLabelText(/発売日/), '2022-09-09')
      await user.type(screen.getByLabelText(/開発元/), '任天堂')
      await user.type(screen.getByLabelText(/発売元/), '任天堂')

      await user.click(screen.getByText('ゲームを登録'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'スプラトゥーン3',
            genre: 'shooter',
            playStatus: 'playing',
            rating: 4,
            playTime: 60,
            releaseDate: '2022-09-09',
            developer: '任天堂',
            publisher: '任天堂',
          })
        )
      })
    })
  })

  describe('編集モード', () => {
    it('既存のゲームデータを表示する', () => {
      render(
        <GameForm 
          game={mockGame} 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
        />
      )

      expect(screen.getByLabelText(/タイトル/)).toHaveValue('ゼルダの伝説')
      expect(screen.getByLabelText(/ジャンル/)).toHaveValue('action')
      expect(screen.getByLabelText(/プレイ状況/)).toHaveValue('playing')
      expect(screen.getByLabelText(/評価/)).toHaveValue('5')
      expect(screen.getByLabelText(/プレイ時間（分）/)).toHaveValue(120)
      expect(screen.getByText('ゲームを更新')).toBeInTheDocument()
    })

    it('編集したデータで送信できる', async () => {
      const user = userEvent.setup()
      render(
        <GameForm 
          game={mockGame} 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
        />
      )

      await user.clear(screen.getByLabelText(/プレイ時間（分）/))
      await user.type(screen.getByLabelText(/プレイ時間（分）/), '150')
      await user.selectOptions(screen.getByLabelText(/プレイ状況/), 'completed')

      await user.click(screen.getByText('ゲームを更新'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            id: mockGame.id,
            playTime: 150,
            playStatus: 'completed',
          })
        )
      })
    })
  })

  it('キャンセルボタンでonCancelが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    await user.click(screen.getByText('キャンセル'))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('必須項目が入力されていない場合、複数のエラーを表示する', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    // タイトルを空にして送信
    await user.click(screen.getByText('ゲームを登録'))
    
    // タイトルが必須であることを確認
    expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('フォームのすべてのフィールドに入力できる', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    await user.type(screen.getByLabelText(/タイトル/), 'テストゲーム')
    await user.type(screen.getByLabelText(/画像URL/), 'https://example.com/test.jpg')
    await user.type(screen.getByLabelText(/説明/), 'これはテスト用のゲームです')
    await user.type(screen.getByLabelText(/メモ/), 'テストメモ')
    await user.type(screen.getByLabelText(/タグ/), 'タグ1, タグ2, タグ3')
    
    await user.type(screen.getByLabelText(/発売日/), '2024-01-01')
    await user.type(screen.getByLabelText(/開発元/), 'テスト開発')
    await user.type(screen.getByLabelText(/発売元/), 'テスト発売')
    
    await user.click(screen.getByText('ゲームを登録'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'テストゲーム',
          imageUrl: 'https://example.com/test.jpg',
          description: 'これはテスト用のゲームです',
          memo: 'テストメモ',
          tags: ['タグ1', 'タグ2', 'タグ3'],
        })
      )
    })
  })
})