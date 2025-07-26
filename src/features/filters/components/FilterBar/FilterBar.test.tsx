import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { FilterBar } from './FilterBar'
import filtersReducer from '../../store/filtersSlice'
import gamesReducer from '@/features/games/store/gamesSlice'

describe('FilterBar', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        games: gamesReducer,
        filters: filtersReducer,
      },
    })
  }

  it('ステータスフィルターを表示する', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('未プレイ')).toBeInTheDocument()
    expect(screen.getByText('プレイ中')).toBeInTheDocument()
    expect(screen.getByText('クリア済み')).toBeInTheDocument()
    expect(screen.getByText('中断中')).toBeInTheDocument()
  })

  it('ジャンルフィルターを表示する', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    expect(screen.getByLabelText('ジャンル')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'ジャンル' })).toHaveValue('all')
  })

  it('ソート設定を表示する', () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    expect(screen.getByLabelText('並び順')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '並び順' })).toHaveValue('createdAt')
  })

  it('ステータスフィルターをクリックすると選択状態が変わる', async () => {
    const store = createTestStore()
    const user = userEvent.setup()
    
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    const playingButton = screen.getByText('プレイ中')
    await user.click(playingButton)
    
    expect(playingButton).toHaveClass('bg-switch-blue')
  })

  it('ジャンルフィルターを変更できる', async () => {
    const store = createTestStore()
    const user = userEvent.setup()
    
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    const genreSelect = screen.getByRole('combobox', { name: 'ジャンル' })
    await user.selectOptions(genreSelect, 'action')
    
    expect(genreSelect).toHaveValue('action')
  })

  it('ソート順を変更できる', async () => {
    const store = createTestStore()
    const user = userEvent.setup()
    
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    const sortSelect = screen.getByRole('combobox', { name: '並び順' })
    await user.selectOptions(sortSelect, 'rating')
    
    expect(sortSelect).toHaveValue('rating')
  })

  it('リセットボタンですべてのフィルターをリセットできる', async () => {
    const store = createTestStore()
    const user = userEvent.setup()
    
    render(
      <Provider store={store}>
        <FilterBar />
      </Provider>
    )

    // フィルターを設定
    await user.click(screen.getByText('プレイ中'))
    await user.selectOptions(screen.getByRole('combobox', { name: 'ジャンル' }), 'action')
    
    // リセット
    await user.click(screen.getByText('リセット'))
    
    // すべてがデフォルトに戻る
    expect(screen.getByText('すべて')).toHaveClass('bg-switch-blue')
    expect(screen.getByRole('combobox', { name: 'ジャンル' })).toHaveValue('all')
  })
})