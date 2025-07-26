import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  setStatusFilter,
  setGenreFilter,
  setSortBy,
  setSortOrder,
  resetFilters,
  selectStatusFilter,
  selectGenreFilter,
  selectSortBy,
  selectSortOrder,
  selectActiveFiltersCount,
  type StatusFilterValue,
  type GenreFilterValue,
  type SortBy,
  type SortOrder,
} from '../../store/filtersSlice'
import { Button } from '@/shared/components/Button'

const statusOptions: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'not_started', label: '未プレイ' },
  { value: 'playing', label: 'プレイ中' },
  { value: 'completed', label: 'クリア済み' },
  { value: 'on_hold', label: '中断中' },
]

const genreOptions: { value: GenreFilterValue; label: string }[] = [
  { value: 'all', label: 'すべてのジャンル' },
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

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: '登録日' },
  { value: 'title', label: 'タイトル' },
  { value: 'rating', label: '評価' },
  { value: 'playTime', label: 'プレイ時間' },
  { value: 'releaseDate', label: '発売日' },
]

const sortOrderOptions: { value: SortOrder; label: string }[] = [
  { value: 'desc', label: '降順' },
  { value: 'asc', label: '昇順' },
]

export function FilterBar() {
  const dispatch = useAppDispatch()
  const statusFilter = useAppSelector(selectStatusFilter)
  const genreFilter = useAppSelector(selectGenreFilter)
  const sortBy = useAppSelector(selectSortBy)
  const sortOrder = useAppSelector(selectSortOrder)
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount)

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col gap-4">
        {/* ステータスフィルター */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            プレイ状況
          </h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => dispatch(setStatusFilter(option.value))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* ジャンルとソート */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-2">
              ジャンル
            </label>
            <select
              id="genre"
              value={genreFilter}
              onChange={(e) => dispatch(setGenreFilter(e.target.value as GenreFilterValue))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div>
              <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-2">
                並び順
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as SortBy))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-semibold text-gray-700 mb-2">
                順序
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => dispatch(setSortOrder(e.target.value as SortOrder))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOrderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-end">
              <Button
                variant="secondary"
                size="small"
                onClick={() => dispatch(resetFilters())}
              >
                リセット
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}