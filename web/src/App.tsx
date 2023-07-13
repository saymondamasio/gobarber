import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts'
import RoutesApp from './routes'
import { GlobalStyle } from './styles/global'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <RoutesApp />

        <GlobalStyle />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
