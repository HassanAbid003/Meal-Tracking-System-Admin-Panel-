// import { useState } from 'react'
// import { Plus, ChevronDown, Pencil } from 'lucide-react'
// import NewDepartmentModal from '../components/NewDepartmentModal'
// import { useSelector } from 'react-redux'


// const Departments = ({ }) => {
//   const isDarkMode = useSelector((state) => state.auth.isDarkMode)
    
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedSite, setSelectedSite] = useState('All Sites')

//   const departments = [
//     { code: 'ENG', color: 'blue', name: 'Engineering', head: 'Ali Hassan', activeMembers: 3, site: 'MCC', siteName: 'Main Campus Canteen', totalRegistered: 78 },
//     { code: 'PM', color: 'green', name: 'Product Management', head: 'Sara Malik', activeMembers: 2, site: 'MCC', siteName: 'Main Campus Canteen', totalRegistered: 23 },
//     { code: 'HR', color: 'yellow', name: 'Human Resources', head: 'Ayesha Siddiqui', activeMembers: 1, site: 'TBC', siteName: 'Tech Block Cafeteria', totalRegistered: 15 },
//     { code: 'FIN', color: 'cyan', name: 'Finance', head: 'Imran Shah', activeMembers: 1, site: 'TBC', siteName: 'Tech Block Cafeteria', totalRegistered: 32 },
//     { code: 'OPS', color: 'red', name: 'Operations', head: 'Khalid Butt', activeMembers: 2, site: 'NWD', siteName: 'North Wing Dining', totalRegistered: 56 },
//     { code: 'QA', color: 'purple', name: 'Quality Assurance', head: 'Nadia Amin', activeMembers: 2, site: 'MCC', siteName: 'Main Campus Canteen', totalRegistered: 34 },
//     { code: 'EXEC', color: 'cyan', name: 'Executive', head: 'Waseem Baig', activeMembers: 1, site: 'EXL', siteName: 'Executive Lounge', totalRegistered: 11 },
//     { code: 'SEC', color: 'orange', name: 'Security', head: 'Kamran Raza', activeMembers: 1, site: 'NWD', siteName: 'North Wing Dining', totalRegistered: 28 },
//   ]

//   // Helper function to get color classes
//   const getColorClasses = (color) => {
//     switch (color) {
//       case 'blue': return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
//       case 'green': return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
//       case 'yellow': return isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
//       case 'cyan': return isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
//       case 'red': return isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
//       case 'purple': return isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
//       case 'orange': return isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
//       default: return isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
//     }
//   }

//   return (
//     <div className={`min-h-screen p-4 md:p-4 lg:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        
//         {/* Site Filter */}
//         <div className="relative w-full md:w-34">
//           <select 
//             value={selectedSite}
//             onChange={(e) => setSelectedSite(e.target.value)}
//             className={`appearance-none w-full border rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
//               isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
//             }`}
//           >
//             <option>All Sites</option>
//               {departments.map((dep, index) => <option key={`${dep.site}-${index}`}>{dep.siteName}</option>)}          </select>
//           <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
//         </div>

//         {/* New Department Button */}
//         <button className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30" onClick={() => setIsModalOpen(true)}>
//           <Plus size={18} />
//           New Department
//         </button>
//       </div>

//       {/* Departments Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {departments.map((dep, index) => (
//           <div key={index} className={`rounded-xl border p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            
//             {/* Top Row: Code Badge + Edit Icon */}
//             <div className="flex items-start justify-between mb-2">
//               <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold p-2 ${getColorClasses(dep.color)}`}>
//                 {dep.code}
//               </div>
//             </div>

//             {/* Department Name & Head */}
//             <h3 className={`text-sm font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.name}</h3>
//             <p className={`text-xs mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Head: {dep.head}</p>

//             {/* Stats Row */}
//             <div className="flex items-center justify-between mb-1">
//               <span className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.activeMembers}</span>
//               <span className={`text-[11px] text-right transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                 {dep.site}
//                 <br />
//                 {dep.siteName.length > 12 ? dep.siteName.substring(0, 12) + '...' : dep.siteName}
//               </span>
//             </div>

//             <p className={`text-xs mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active members</p>

//             {/* Progress Bar */}
//             <div className={`h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
//               <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(dep.activeMembers / dep.totalRegistered) * 100}%` }}></div>
//             </div>

//             <p className={`text-xs mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{dep.totalRegistered} total registered</p>
//           </div>
//         ))}
//       </div>

//       {/* Department Summary Table */}
//       <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
//         <div className="px-4 py-3">
//           <h3 className={`text-base font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Department Summary</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className={`border-y transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</th>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Code</th>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Head</th>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employees</th>
//                 <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {departments.map((dep, index) => (
//                 <tr key={index} className={`border-b last:border-b-0 transition-colors duration-300 ${
//                   isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
//                 }`}>
//                   <td className={`py-3 px-6 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.name}</td>
//                   <td className="py-3 px-6">
//                     <span className={`text-xs font-medium px-2 py-1 rounded-md transition-colors duration-300 ${
//                       isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
//                     }`}>{dep.code}</span>
//                   </td>
//                   <td className={`py-3 px-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.siteName}</td>
//                   <td className={`py-3 px-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.head}</td>
//                   <td className={`py-3 px-6 text-xs transition-colors duration-300 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.totalRegistered}</td>
//                   <td className="py-3 px-6">
//                     <span className="flex items-center gap-4 text-xs font-medium">
//                       <button className="text-indigo-500 hover:text-indigo-600 transition-colors hover:underline decoration-indigo-500">Edit</button>
//                       <button className="text-red-500 hover:text-red-600 transition-colors hover:underline decoration-red-500">Delete</button>
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <NewDepartmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} />

//     </div>
//   )
// }

// export default Departments








import { useState, useEffect } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import NewDepartmentModal from '../components/NewDepartmentModal'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDepartments } from '../store' // Import from your store
import { fetchSites } from '../store'

const Departments = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { departments, loading, error } = useSelector((state) => state.departments)
  const { sites } = useSelector((state) => state.sites)
  const dispatch = useDispatch()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState('All Sites')

  // Fetch departments and sites when component mounts
  useEffect(() => {
    dispatch(fetchDepartments())
    dispatch(fetchSites())
  }, [dispatch])

  // Helper function to get color based on department code
  const getColorClasses = (code) => {
    const colors = ['blue', 'green', 'yellow', 'cyan', 'red', 'purple', 'orange', 'pink', 'teal', 'indigo']
    const index = code ? code.charCodeAt(0) % colors.length : 0
    const color = colors[index]
    
    switch (color) {
      case 'blue': return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
      case 'green': return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
      case 'yellow': return isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
      case 'cyan': return isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
      case 'red': return isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
      case 'purple': return isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
      case 'orange': return isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
      case 'pink': return isDarkMode ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-600'
      case 'teal': return isDarkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600'
      case 'indigo': return isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      default: return isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
    }
  }

  // Filter departments by selected site
  const filteredDepartments = selectedSite === 'All Sites' 
    ? departments 
    : departments.filter(dep => dep.site_id?._id === selectedSite)

  return (
    <div className={`min-h-screen p-4 md:p-4 lg:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        
        {/* Site Filter */}
        <div className="relative w-full md:w-34">
          <select 
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className={`appearance-none w-full border rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="All Sites">All Sites</option>
            {sites.map(site => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* New Department Button */}
        <button 
          className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          New Department
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-400">Loading departments...</div>
      )}

      {/* Error State */}
      {error && (
        <div className={`text-center py-10 rounded-xl border ${isDarkMode ? 'border-red-800 bg-red-900/20 text-red-400' : 'border-red-200 bg-red-50 text-red-600'}`}>
          Error: {error}
          <button 
            onClick={() => dispatch(fetchDepartments())}
            className="ml-3 text-indigo-500 hover:text-indigo-600 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* No Departments State */}
      {!loading && !error && filteredDepartments.length === 0 && (
        <div className={`text-center py-10 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No departments found
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Click "New Department" to create your first one
          </p>
        </div>
      )}

      {/* Departments Content */}
      {!loading && !error && filteredDepartments.length > 0 && (
        <>
          {/* Departments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {filteredDepartments.map((dep) => (
              <div key={dep._id} className={`rounded-xl border p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                
                {/* Top Row: Code Badge */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold p-2 ${getColorClasses(dep.code)}`}>
                    {dep.code}
                  </div>
                </div>

                {/* Department Name & Head */}
                <h3 className={`text-sm font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.name}</h3>
                <p className={`text-xs mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Head: {dep.head}</p>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.activeMembers || 0}</span>
                  <span className={`text-[11px] text-right transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {dep.site_id?.code || 'N/A'}
                    <br />
                    {dep.site_id?.name ? (dep.site_id.name.length > 12 ? dep.site_id.name.substring(0, 12) + '...' : dep.site_id.name) : 'No Site'}
                  </span>
                </div>

                <p className={`text-xs mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active members</p>

                {/* Progress Bar */}
                <div className={`h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${dep.totalRegistered ? (dep.activeMembers / dep.totalRegistered) * 100 : 0}%` }}
                  ></div>
                </div>

                <p className={`text-xs mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{dep.totalRegistered || 0} total registered</p>
              </div>
            ))}
          </div>

          {/* Department Summary Table */}
          <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="px-4 py-3">
              <h3 className={`text-base font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Department Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-y transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</th>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Code</th>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Head</th>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employees</th>
                    <th className={`py-2 px-6 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dep) => (
                    <tr key={dep._id} className={`border-b last:border-b-0 transition-colors duration-300 ${
                      isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
                    }`}>
                      <td className={`py-3 px-6 text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dep.name}</td>
                      <td className="py-3 px-6">
                        <span className={`text-xs font-medium px-2 py-1 rounded-md transition-colors duration-300 ${
                          isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>{dep.code}</span>
                      </td>
                      <td className={`py-3 px-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.site_id?.name || 'N/A'}</td>
                      <td className={`py-3 px-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.head}</td>
                      <td className={`py-3 px-6 text-xs transition-colors duration-300 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dep.totalRegistered || 0}</td>
                      <td className="py-3 px-6">
                        <span className="flex items-center gap-4 text-xs font-medium">
                          <button className="text-indigo-500 hover:text-indigo-600 transition-colors hover:underline decoration-indigo-500">Edit</button>
                          <button className="text-red-500 hover:text-red-600 transition-colors hover:underline decoration-red-500">Delete</button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <NewDepartmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Departments