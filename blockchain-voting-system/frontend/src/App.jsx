import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Web3Provider } from './contexts/Web3Context'
import AppRoutes from './routes'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import Footer from './components/common/Footer'
import './App.scss'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <div className="app-container">
            <Header />
            <div className="main-content">
              <Sidebar />
              <div className="content-area">
                <AppRoutes />
              </div>
            </div>
            <Footer />
          </div>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App