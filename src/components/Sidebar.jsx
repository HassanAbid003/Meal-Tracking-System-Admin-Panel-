// import { 
//   LayoutDashboard, 
//   Utensils, 
//   Users, 
//   Clock, 
//   Monitor, 
//   Building2, 
//   FileText, 
//   Shield,
//   Moon,
//   Sun,
//   LogOut,
//   ChevronsLeft,
//   ChevronsRight
// } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { toggleTheme, logout } from '../store'

// const Sidebar = ({ activePage, setActivePage, isCollapsed, setIsCollapsed, onLogout }) => {
//   // Get global state from Redux
//   const isDarkMode = useSelector((state) => state.auth.isDarkMode)
//   const { user } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()

//   // Map sidebar display names → permission keys
//   const PAGE_KEY_MAP = {
//     'Dashboard':   'dashboard',
//     'Mess Sites':  'messSites',
//     'Employees':   'employees',
//     'Shifts':      'shifts',
//     'Devices':     'devices',
//     'Departments': 'departments',
//     'Reports':     'reports',
//   }

//   // Check if the current user can access a given page
//   const canAccessPage = (pageName) => {
//     // Super Admin has access to everything
//     if (user?.role === 'super_admin') return true

//     // Permissions page is Super Admin only
//     if (pageName === 'Permissions') return false

//     // Site Admin → check their permissions.pages
//     if (user?.role === 'site_admin') {
//       const key = PAGE_KEY_MAP[pageName]
//       return key ? !!user?.permissions?.pages?.[key] : false
//     }

//     // Everyone else (employee, no user) → no access
//     return false
//   }

//   // All menu items
//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard },
//     { name: 'Mess Sites', icon: Utensils },
//     { name: 'Employees', icon: Users },
//     { name: 'Shifts', icon: Clock },
//     { name: 'Devices', icon: Monitor },
//     { name: 'Departments', icon: Building2 },
//     { name: 'Reports', icon: FileText },
//     { name: 'Permissions', icon: Shield },
//   ]

//   // ✅ Filter menu items by permission
//   const visibleMenuItems = menuItems.filter(item => canAccessPage(item.name))

//   // Get user initials
//   const getInitials = (name) => {
//     if (!name) return '?'
//     return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
//   }

//   // Get role display name
//   const getRoleDisplay = (role) => {
//     if (role === 'super_admin') return 'Super Admin'
//     if (role === 'site_admin') return 'Site Admin'
//     if (role === 'mess_keeper') return 'Mess Keeper'
//     return 'User'
//   }

//   return (
//     <div className={`${isCollapsed ? 'w-20' : 'w-60'} h-screen flex flex-col transition-all duration-300 ${
//       isDarkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-gray-200'
//     }`}>
      
//       {/* Logo Area */}
//       <div className={`p-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
//           <div className="bg-indigo-600 p-1 rounded-xl text-white shadow-lg">
//             <LayoutDashboard size={22} />
//           </div>
//           {!isCollapsed && (
//             <div>
//               <h1 className={`text-sm font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MealTrack</h1>
//               <p className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Console</p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Navigation Area - ONLY THIS SCROLLS */}
//       <nav className={`${isCollapsed ? 'overflow-hidden py-3' : 'overflow-y-auto py-1'} flex-1 min-h-0 nav-scroll px-2 `}>
//         {!isCollapsed && (
//           <p className={`px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400 '}`}>Navigation</p>
//         )}
        
//         {visibleMenuItems.map((item) => {
//           const Icon = item.icon
//           const isActive = activePage === item.name
          
//           return (
//             <button
//               key={item.name}
//               onClick={() => setActivePage(item.name)}
//               className={`
//                 w-full flex items-center ${isCollapsed ? 'justify-center gap-6' : 'gap-3 px-3'} py-2 rounded-lg transition-all text-sm font-medium 
//                 ${isActive 
//                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
//                   : isDarkMode 
//                     ? 'text-gray-400 hover:bg-slate-800 hover:text-white' 
//                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                 }
//               `}
//             >
//               <Icon size={20} />
//               {!isCollapsed && <span>{item.name}</span>}
//             </button>
//           )
//         })}
//       </nav>
      
//       {/* Bottom Actions (Fixed) */}
//       <div className={`shrink-0 border-t ${isCollapsed ? 'py-2' : 'px-2 py-1'} ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        
//         <button 
//           onClick={() => dispatch(toggleTheme())}
//           className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
//             isDarkMode 
//               ? 'text-gray-400 hover:bg-slate-800 hover:text-white' 
//               : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//           }`}
//         >
//           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
//         </button>

//         <button 
//           onClick={onLogout}
//           className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
//             isDarkMode 
//               ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400' 
//               : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
//           }`}
//         >
//           <LogOut size={20} />
//           {!isCollapsed && <span>Logout</span>}
//         </button>
//       </div>
      
//       {/* User Profile Area - Hidden when collapsed */}
//       {!isCollapsed && user && (
//         <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
//           <div className={`rounded-xl py-2 px-4 flex items-center gap-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
//             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
//               {getInitials(user.name)}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className={`text-sm font-bold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                 {user.name}
//               </p>
//               <p className={`text-[11px] leading-tight truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                 {user.email}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Collapse / Expand Button */}
//       <div className="shrink-0 pb-2 pr-2 pl-2">
//         <button 
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className={`w-full flex items-center justify-center py-2 rounded-lg transition-all ${
//             isDarkMode ? 'text-gray-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//           }`}
//         >
//           {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Sidebar






import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  Clock, 
  Monitor, 
  Building2, 
  FileText, 
  Shield,
  Moon,
  Sun,
  LogOut,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme, logout } from '../store'

const Sidebar = ({ activePage, setActivePage, isCollapsed, setIsCollapsed, onLogout }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const PAGE_KEY_MAP = {
    'Dashboard':   'dashboard',
    'Mess Sites':  'messSites',
    'Employees':   'employees',
    'Shifts':      'shifts',
    'Devices':     'devices',
    'Departments': 'departments',
    'Reports':     'reports',
  }

  const canAccessPage = (pageName) => {
    if (user?.role === 'super_admin') return true
    if (pageName === 'Permissions') return false

    if (user?.role === 'site_admin') {
      const key = PAGE_KEY_MAP[pageName]
      return key ? !!user?.permissions?.pages?.[key] : false
    }

    return false
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Mess Sites', icon: Utensils },
    { name: 'Employees', icon: Users },
    { name: 'Shifts', icon: Clock },
    { name: 'Devices', icon: Monitor },
    { name: 'Departments', icon: Building2 },
    { name: 'Reports', icon: FileText },
    { name: 'Permissions', icon: Shield },
  ]

  const visibleMenuItems = menuItems.filter(item => canAccessPage(item.name))

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleDisplay = (role) => {
    if (role === 'super_admin') return 'Super Admin'
    if (role === 'site_admin') return 'Site Admin'
    if (role === 'mess_keeper') return 'Mess Keeper'
    return 'User'
  }

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-60'} h-screen flex flex-col transition-all duration-300 ${
      isDarkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-gray-200'
    }`}>
      
      {/* Logo */}
      <div className={`p-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="bg-indigo-600 p-1 rounded-xl text-white shadow-lg">
            <LayoutDashboard size={22} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className={`text-sm font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MealTrack</h1>
              <p className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Console</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`${isCollapsed ? 'overflow-hidden flex-none py-3' : 'overflow-y-auto flex-1 min-h-0 py-1.5'} nav-scroll px-2`}>
        {!isCollapsed && (
          <p className={`px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Navigation</p>
        )}
        
        {visibleMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.name
          
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`
                w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all text-sm font-medium 
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : isDarkMode 
                    ? 'text-gray-400 hover:bg-slate-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          )
        })}
      </nav>
      
      {/* Bottom Actions */}
      <div className={`shrink-0 border-t ${isCollapsed ? 'py-2' : 'px-2 py-1'} ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        
        <button 
          onClick={() => dispatch(toggleTheme())}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-slate-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button 
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400' 
              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
      
      {/* User Profile */}
      {!isCollapsed && user && (
        <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className={`rounded-xl py-2 px-4 flex items-center gap-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </p>
              <p className={`text-[11px] leading-tight truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <div className="shrink-0 pb-2 pr-2 pl-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center py-2 rounded-lg transition-all ${
            isDarkMode ? 'text-gray-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
    </div>
  )
}

export default Sidebar