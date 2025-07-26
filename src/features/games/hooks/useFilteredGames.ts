import { useMemo } from 'react'
import { useAppSelector } from '@/app/hooks'
import { selectAllGames } from '../store/gamesSlice'
import {
  selectStatusFilter,
  selectGenreFilter,
  selectSortBy,
  selectSortOrder,
} from '@/features/filters/store/filtersSlice'
import type { Game } from '../types'

export function useFilteredGames(): Game[] {
  const games = useAppSelector(selectAllGames)
  const statusFilter = useAppSelector(selectStatusFilter)
  const genreFilter = useAppSelector(selectGenreFilter)
  const sortBy = useAppSelector(selectSortBy)
  const sortOrder = useAppSelector(selectSortOrder)

  return useMemo(() => {
    // フィルタリング
    let filteredGames = [...games]

    if (statusFilter !== 'all') {
      filteredGames = filteredGames.filter(
        (game) => game.playStatus === statusFilter
      )
    }

    if (genreFilter !== 'all') {
      filteredGames = filteredGames.filter(
        (game) => game.genre === genreFilter
      )
    }

    // ソート
    filteredGames.sort((a, b) => {
      let compareResult = 0

      switch (sortBy) {
        case 'title':
          compareResult = a.title.localeCompare(b.title, 'ja')
          break
        case 'rating':
          compareResult = a.rating - b.rating
          break
        case 'playTime':
          compareResult = a.playTime - b.playTime
          break
        case 'releaseDate':
          compareResult = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
          break
        case 'createdAt':
          compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === 'asc' ? compareResult : -compareResult
    })

    return filteredGames
  }, [games, statusFilter, genreFilter, sortBy, sortOrder])
}