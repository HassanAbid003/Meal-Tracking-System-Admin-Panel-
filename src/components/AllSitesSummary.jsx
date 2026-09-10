import { useSelector, useDispatch } from 'react-redux'
import { updateSite, removeSite, deleteSite } from '../store'
import { useState } from 'react'
import EditSiteModal from './EditSiteModal'


const AllSitesSummary = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  // JUST GET THE DATA FROM REDUX - NO FETCHING HERE!
  const { sites } = useSelector((state) => state.sites)
  const { employees } = useSelector((state) => state.employees)
  const { devices } = useSelector((state) => state.devices)

    const [editSite, setEditSite] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleEdit = (site) => {
      setEditSite(site)
      setIsEditModalOpen(true)
    }

    const handleSave = (updatedSite) => {
      dispatch(updateSite(updatedSite))
    }

    const handleDelete = async (siteId) => {
      if (confirm('Are you sure you want to delete this site?')) {
        try {
          await dispatch(deleteSite(siteId)).unwrap()
          dispatch(removeSite(siteId))
        } catch (error) {
          alert('Failed to delete site')
        }
      }
    }



  // Calculate real counts for each site
  const sitesWithCounts = sites.map(site => {
    const employeeCount = employees.filter(emp => emp.site_id && emp.site_id._id === site._id).length
    const deviceCount = devices.filter(dev => dev.site_id && dev.site_id._id === site._id).length
    

    return {
      ...site,
      employees: employeeCount,
      devices: deviceCount,
      status: site.is_active ? 'Active' : 'Inactive'
    }
  })

  return (
    <div className={`rounded-xl border p-6 mt-2 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
      
      {/* Header */}
      <h3 className={`text-lg font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Sites Summary</h3>

      {/* Table */}
      <div className="overflow-x-auto">
      <table className="text-left border-collapse w-full">
      <thead>
        <tr className={`border-b border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <th className={`py-3 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
          <th className={`py-3 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Code</th>
          <th className={`py-3 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</th>
          <th className={`py-3 px-4 text-sm font-semibold text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employees</th>
          <th className={`py-3 px-4 text-sm font-semibold text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Devices</th>
          <th className={`py-3 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
          <th className={`py-3 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sitesWithCounts.map((site, index) => (
          <tr key={index} className={`border-b last:border-b-0 transition-colors duration-300 ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
            
            {/* Site Name */}
            <td className={`py-4 px-4 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</td>
            
            {/* Code Badge */}
            <td className="py-4 px-4 text-sm">
              <span className={`text-xs font-medium px-2 py-1 rounded-md transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                {site.code}
              </span>
            </td>
            
            {/* Location */}
            <td className={`py-4 px-4 max-w-[150px] text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</td>
            
            {/* Employees - REAL DATA */}
            <td className={`py-4 px-4 text-sm text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{site.employees}</td>
            
            {/* Devices - REAL DATA */}
            <td className={`py-4 px-4 text-sm text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{site.devices}</td>
            
            {/* Status - REAL DATA */}
            <td className="py-4 px-4 text-sm">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${
                site.status === 'Active' 
                  ? isDarkMode ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50'
                  : isDarkMode ? 'text-gray-400 bg-gray-500/10' : 'text-gray-500 bg-gray-100'
              }`}>
                {site.status}
              </span>
            </td>
            
            {/* Actions */}
            <td className="py-4 px-4 text-sm">
              <span className="flex items-center gap-4">
                <button className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors hover:underline decoration-indigo-500" onClick={() => handleEdit(site)}>Edit</button>
                <button className="text-red-500 hover:text-red-600 font-medium transition-colors hover:underline decoration-red-500" onClick={() => handleDelete(site._id)}>Delete</button>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
      </div>    
        <EditSiteModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} site={editSite} onSave={handleSave}/>
    </div>
  )
}

export default AllSitesSummary