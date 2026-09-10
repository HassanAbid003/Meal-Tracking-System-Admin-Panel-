import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Menu, X, Bell, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../store'

const MainLayout = ({ children, activePage, setActivePage, onGoHome, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Get the state from Redux
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col h-full">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onGoHome={onGoHome} 
          onLogout={onLogout} 
        />
      </div>

      {/* Mobile Sidebar & Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          <div className={`relative h-full w-60 shadow-xl transition-transform duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className={`absolute top-2 right-4 p-2 rounded-lg ${isDarkMode ? 'text-white bg-slate-800 hover:bg-slate-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
            >
              <X size={20} />
            </button>
            <Sidebar 
              activePage={activePage} 
              setActivePage={(page) => {
                setActivePage(page);
                setIsSidebarOpen(false);
              }} 
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onGoHome={onGoHome}
              onLogout={onLogout} 
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* MOBILE HEADER (Only shows on small screens) */}
        <header className={`lg:hidden flex items-center justify-between p-2 border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg ${isDarkMode ? 'text-white bg-slate-800 hover:bg-slate-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
          >
            <Menu size={24} />
          </button>
          <h1 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MealTrack</h1>
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></span>
            </button>
            <button 
              onClick={onLogout}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <LogOut size={20} />
            </button>
          </div>        
        </header>


        {/* DESKTOP HEADER (Fixed at top) */}
        <header className={`hidden lg:flex items-center justify-between px-5 py-1.5 border-b shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          
          {/* Left Side: Title & Date */}
          <div>
            <h1 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activePage}</h1>
            <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>          
          </div>
          
          {/* Right Side: Badge & Bell */}
          <div className="flex items-center gap-4">
            <div className={`border rounded-lg px-3 py-1 flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>4 devices online</span>
            </div>
            <div className={`relative p-1.5 cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <Bell size={20} />
              <span className="absolute top-1 left-5 w-1.5 h-1.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></span>
            </div>
            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <LogOut size={20} />
            </button>
            </div>
        </header>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto modal-scroll">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout