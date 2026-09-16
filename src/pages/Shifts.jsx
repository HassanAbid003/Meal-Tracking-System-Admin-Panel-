import { useState, useEffect } from 'react'
import { Plus, ChevronDown, Clock, Pencil, Sun, Moon, Coffee } from 'lucide-react'
import AddShiftModal from '../components/AddShiftModal'
import { useSelector, useDispatch } from 'react-redux'
import { fetchShifts, toggleShift, updateShiftInStore } from '../store'
import EditTimeModal from '../components/EditTimeModal'
import API_URL from '../config'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'

const DEFAULT_SHIFTS = [
  { name: 'Breakfast', icon: 'sun' },
  { name: 'Lunch', icon: 'coffee' },
  { name: 'Dinner', icon: 'moon' },
]

const Shifts = () => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { shifts, loading, error } = useSelector((state) => state.shifts)
  const { sites } = useSelector((state) => state.sites)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [editingShift, setEditingShift] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchShifts())
  }, [dispatch])

  const handleToggle = async (shiftId) => {
    if (!shiftId) return
    try {
      const updatedShift = await dispatch(toggleShift(shiftId)).unwrap()
      dispatch(updateShiftInStore(updatedShift))
      showSuccess('Shift status updated')
    } catch (err) {
      logError('Shift toggle failed:', err)
      showError('Failed to toggle shift')
    }
  }

  const handleEditClick = (shift) => {
    setEditingShift(shift)
    setIsEditModalOpen(true)
  }

  const handleSaveTimes = async (shiftId, times) => {
    try {
      const response = await fetch(`${API_URL}/api/shifts/${shiftId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(times),
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error('Server returned invalid response')
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      dispatch(updateShiftInStore(data))
      showSuccess('Shift times updated successfully')
    } catch (err) {
      logError('Shift update failed:', err)
      throw err
    }
  }

  const getShiftIcon = (icon) => {
    switch (icon) {
      case 'sun': return <Sun size={24} className="text-amber-500" />
      case 'coffee': return <Coffee size={24} className="text-yellow-500" />
      case 'moon': return <Moon size={24} className="text-purple-400" />
      default: return <Clock size={24} className="text-gray-500" />
    }
  }

  const groupedShifts = shifts.reduce((acc, shift) => {
    const siteId = shift.site_id?._id || shift.site_id

    if (!acc[siteId]) {
      acc[siteId] = {
        site: shift.site_id || { name: 'Unknown', code: 'N/A' },
        shifts: []
      }
    }

    const isDuplicate = acc[siteId].shifts.some(s => s.name === shift.name)

    if (!isDuplicate) {
      acc[siteId].shifts.push(shift)
    }

    return acc
  }, {})

  return (
    <div className={`min-h-screen p-4 md:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-4">
        <div className="relative w-full md:w-34">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className={`appearance-none w-full border rounded-xl pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option>All Sites</option>
            {sites.map(site => <option key={site._id} value={site._id}>{site.name}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <button className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          New Shift
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading shifts...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedShifts).map(([siteId, group]) => {

            const filledShifts = DEFAULT_SHIFTS.map(defaultShift => {
              const realShift = group.shifts.find(s => s.name === defaultShift.name)
              return realShift ? { ...defaultShift, ...realShift } : { ...defaultShift, isPlaceholder: true }
            })

            return (
              <div key={siteId} className={`rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

                <div className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group.site.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>{group.site.code}</span>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{group.shifts.length} shifts</span>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                  {filledShifts.map((shift, index) => (
                    <div key={index} className={`py-4 px-6 border-r last:border-r-0 border-b md:border-b-0 transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>

                      {shift.isPlaceholder ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <div className={`p-3 rounded-xl mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                            {getShiftIcon(shift.icon)}
                          </div>
                          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{shift.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Not configured</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-6">
                            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                              {getShiftIcon(shift.icon)}
                            </div>

                            <div onClick={() => handleToggle(shift._id)} className={`w-12 h-6 rounded-full p-0.5 cursor-pointer flex items-center transition-colors duration-300 ${
                              shift.status === 'Active' ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start dark:bg-slate-700'
                            }`}>
                              <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                            </div>
                          </div>

                          <h4 className={`text-lg font-bold mb-2 ${shift.name === 'Breakfast' ? 'text-amber-500' : shift.name === 'Lunch' ? 'text-yellow-500' : 'text-purple-400'}`}>{shift.name}</h4>

                          <div className="flex items-center gap-3 mb-4">
                            <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.start_time}</span>
                            <span className="text-gray-500">→</span>
                            <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{shift.end_time}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              shift.status === 'Active'
                                ? isDarkMode ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50'
                                : isDarkMode ? 'text-gray-400 bg-gray-500/10' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {shift.status}
                            </span>
                            <button onClick={() => handleEditClick(shift)} className={`flex items-center gap-1 text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                              <Pencil size={14} />
                              Edit times
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddShiftModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} />
      <EditTimeModal isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingShift(null)
        }}
        shift={editingShift}
        onSave={handleSaveTimes}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}

export default Shifts