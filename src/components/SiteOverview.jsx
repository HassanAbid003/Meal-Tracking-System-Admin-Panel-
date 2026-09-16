import { Building2, Users } from 'lucide-react'
import { useSelector } from 'react-redux'

const SiteOverview = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { sites, loading, error } = useSelector((state) => state.sites)

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
          sites.map((site, index) => (
            <div key={index} className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${site.is_active === false ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                <div>
                  <p className={`font-semibold text-base transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</p>
                  <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.code}</p>
                <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.manager}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SiteOverview