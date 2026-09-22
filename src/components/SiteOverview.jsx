// import { Building2, Users } from 'lucide-react'
// import { useSelector } from 'react-redux'

// const SiteOverview = ({ }) => {
//   const isDarkMode = useSelector((state) => state.auth.isDarkMode)
//   const { sites, loading, error } = useSelector((state) => state.sites)

//   return (
//     <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
//       <div className="space-y-4">
//         {loading ? (
//           <div className="p-4 text-center text-gray-400">Loading sites...</div>
//         ) : error ? (
//           <div className="p-4 text-center text-red-500">Error: {error}</div>
//         ) : sites.length === 0 ? (
//           <div className="p-4 text-center text-gray-400">No sites available.</div>
//         ) : (
//           sites.map((site, index) => (
//             <div key={index} className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-colors duration-300 ${
//               isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'
//             }`}>
//               <div className="flex items-center gap-4">
//                 <div className={`w-3 h-3 rounded-full ${site.is_active === false ? 'bg-gray-400' : 'bg-green-500'}`}></div>
//                 <div>
//                   <p className={`font-semibold text-base transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</p>
//                   <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.code}</p>
//                 <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.manager}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default SiteOverview








import { Monitor } from 'lucide-react'
import { useSelector } from 'react-redux'

const SiteOverview = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { sites, loading, error } = useSelector((state) => state.sites)
  const { devices } = useSelector((state) => state.devices)

  // Count devices per site
  const deviceCounts = devices.reduce((acc, d) => {
    const siteId = d.site_id?._id || d.site_id
    if (!siteId) return acc
    const key = String(siteId)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
      <div className="space-y-4">
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading sites...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Error: {error}</div>
        ) : sites.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No sites available.</div>
        ) : (
          sites.map((site, index) => {
            const count = deviceCounts[String(site._id)] || 0

            return (
              <div key={index} className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'
              }`}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${site.is_active === false ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-base truncate transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</p>
                    <p className={`text-xs truncate transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.code}</p>
                  <p className={`text-xs truncate transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.manager}</p>

                  {/* Device count */}
                  <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors duration-300 ${
                    count > 0
                      ? isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      : isDarkMode ? 'bg-slate-700/50 text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Monitor size={11} />
                    <span>
                      {count} {count === 1 ? 'device' : 'devices'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SiteOverview