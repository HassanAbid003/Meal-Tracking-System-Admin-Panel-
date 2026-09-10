import { useState, useEffect } from 'react'
import { Search, Plus, MoreVertical, User } from 'lucide-react'
import AllSitesSummary from '../components/AllSitesSummary'
import AddSiteModal from '../components/AddSiteModal'
import EditSiteModal from '../components/EditSiteModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSites, addSite, fetchEmployees, fetchDevices } from '../store'
import { updateSite, removeSite, deleteSite } from '../store'

const MessSites = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { sites, loading, error } = useSelector((state) => state.sites)
  const { employees } = useSelector((state) => state.employees)
  const { devices } = useSelector((state) => state.devices)
  const [editSite, setEditSite] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(fetchSites());
      dispatch(fetchEmployees());
      dispatch(fetchDevices());
  }, [dispatch]);

  const handleSiteCreated = (newSite) => {
    dispatch(addSite(newSite))
    setIsModalOpen(false)
  }

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
  
  return (
    <div className={`min-h-screen p-4 md:p-6 lg:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search sites..." 
            className={`w-full h-full border rounded-xl pl-12 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
        </div>

        <button onClick={() => setIsModalOpen(true)} className="flex md:w-auto w-full items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30">
          <Plus size={18} />
          Add Site
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading sites...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {sites.length > 0 ? (
              sites.map((site, index) => {
                // Count Employees
                const siteEmployeeCount = employees.filter(emp => emp.site_id && emp.site_id._id === site._id).length;
                // Count Devices
                const siteDeviceCount = devices.filter(dev => dev.site_id && dev.site_id._id === site._id).length;
                // Count Online Devices (FIXED HERE!)
                const siteOnlineCount = devices.filter(dev => dev.site_id && dev.site_id._id === site._id && dev.status === 'online').length;

                return (
                <div key={index} className={`rounded-xl border p-6 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600/20 border-indigo-600/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                        {site.code}
                      </div>
                      <div>
                        <h3 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{site.name}</h3>
                        <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{site.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${site.status === 'Active' ? (isDarkMode ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50') : (isDarkMode ? 'text-gray-400 bg-gray-500/10' : 'text-gray-500 bg-gray-100')}`}>
                        {site.status}
                      </span>
                      <button className={`transition-colors ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className={`rounded-lg p-3 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                      <p className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{siteEmployeeCount}</p>
                      <p className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Employees</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                      <p className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{siteDeviceCount}</p>
                      <p className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Devices</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                      <p className={`text-lg font-bold transition-colors duration-300 ${siteOnlineCount > 0 ? (isDarkMode ? 'text-green-500' : 'text-green-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>{siteOnlineCount}</p>
                      <p className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Online</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`flex items-center justify-between border-t pt-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className={`flex items-center gap-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <User size={15} className={`transition-colors ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>Manager: {site.manager}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <button onClick={() => handleEdit(site)} className="text-indigo-500 hover:text-indigo-600 transition-colors hover:underline decoration-indigo-500">Edit</button>
                      <button onClick={() => handleDelete(site._id)} className="text-red-500 hover:text-red-600 transition-colors hover:underline decoration-red-500">Remove</button>
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-400">No sites found. Add a site to get started.</div>
            )}
          </div>

          <AllSitesSummary isDarkMode={isDarkMode} />
        </>
      )}

      <AddSiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} onSiteCreated={handleSiteCreated} />
      <EditSiteModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} site={editSite} onSave={handleSave} />
      
    </div>
  )
}

export default MessSites