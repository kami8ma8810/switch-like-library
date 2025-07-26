import { Provider } from 'react-redux'
import { store } from './store'
import { GameLibraryPage } from '@/pages/GameLibrary'

export function App() {
  return (
    <Provider store={store}>
      <GameLibraryPage />
    </Provider>
  )
}