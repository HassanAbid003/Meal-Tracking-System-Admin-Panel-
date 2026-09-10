import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import MainLayout from './layouts/MainLayout'
import Dashboard from './components/Dashboard'
import MessSites from './pages/MessSites'
import Employees from './pages/Employees'
import Shifts from './pages/Shifts'
import Devices from './pages/Devices'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import Permissions from './pages/Permissions'
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials } from './store'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const dispatch = useDispatch()

  // Check if user is already logged in (on page refresh)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      dispatch(setCredentials({ user: JSON.parse(user), token }))
      setIsAuthenticated(true)
    }
  }, [dispatch])

  // Handle Login Success
  const handleLogin = () => {
    setIsAuthenticated(true)
    setActivePage('Dashboard')
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(setCredentials({ user: null, token: null }))
    setIsAuthenticated(false)
  }

  // 1. Show Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  // 2. Render the selected page
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />
      case 'Mess Sites':
        return <MessSites />
      case 'Employees':
        return <Employees />
      case 'Shifts':
        return <Shifts />
      case 'Devices':
        return <Devices />
      case 'Departments':
        return <Departments />
      case 'Reports':
        return <Reports />
      case 'Permissions':
        return <Permissions />
      default:
        return <Dashboard />
    }
  }

  // 3. Show Main Layout with selected page
  return (
    <MainLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </MainLayout>
  )
}

export default App