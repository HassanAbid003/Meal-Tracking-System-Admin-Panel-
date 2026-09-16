import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import MainLayout from './layouts/MainLayout'
import Dashboard from './components/Dashboard'
import MessSites from './pages/MessSites'
import Employees from './pages/Employees'
import Shifts from './pages/Shifts'
import Devices from './pages/Devices'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import Permissions from './pages/Permissions'
import { ConfirmProvider } from './context/ConfirmContext'
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials } from './store'
import API_URL from './config'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  // Check session by asking backend "who am I?" (cookie is sent automatically)
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        dispatch(setCredentials({ user: data, token: 'cookie' }))
        setIsAuthenticated(true)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
      .finally(() => {
        setIsCheckingAuth(false)
      })
  }, [dispatch])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setActivePage('Dashboard')
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }

    dispatch(setCredentials({ user: null, token: null }))
    setIsAuthenticated(false)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard />
      case 'Mess Sites': return <MessSites />
      case 'Employees': return <Employees />
      case 'Shifts': return <Shifts />
      case 'Devices': return <Devices />
      case 'Departments': return <Departments />
      case 'Reports': return <Reports />
      case 'Permissions': return <Permissions />
      default: return <Dashboard />
    }
  }

  if (isCheckingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</div>
      </div>
    )
  }

  return (
    <ConfirmProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f1f5f9' : '#0f172a',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: isDarkMode
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
          error: { duration: 4500, iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="*"
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <MainLayout
                  activePage={activePage}
                  setActivePage={setActivePage}
                  onLogout={handleLogout}
                >
                  {renderPage()}
                </MainLayout>
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfirmProvider>
  )
}

export default App