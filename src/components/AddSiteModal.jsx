import { useState } from 'react'
import { X, Building2, Hash, User, CheckCircle2 } from 'lucide-react'
import { useSelector } from 'react-redux' 
import API_URL from '../config'

const AddSiteModal = ({ isOpen, onClose, onSiteCreated }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)

  const [formData, setFormData] = useState({
    code: '',       // e.g., MCC
    name: '',       // e.g., Main Campus Canteen
    location: '',   // e.g., Block A, Ground Floor
    manager: ''     // e.g., Tariq Mehmood
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${API_URL}/api/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Site Created:', data)
        onSiteCreated(data) // <--- This adds it to Redux instantly!
        onClose() // Close the modal
      } else {
        console.error('❌ Error creating site:', data.message)
        alert(data.message || 'Failed to create site')
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      alert('Failed to connect to server')
    }
  }
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Site</h2>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="siteForm" onSubmit={handleSubmit}>
            
            <div className="space-y-4">
              {/* Site Code */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Site Code</label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="code" 
                    required
                    placeholder="e.g. MCC"
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Site Name */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Site Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="name" 
                    required
                    placeholder="e.g. Main Campus Canteen"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="location" 
                    required
                    placeholder="e.g. Block A, Ground Floor"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Manager */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manager</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="manager" 
                    placeholder="e.g. Tariq Mehmood"
                    value={formData.manager}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className={`flex items-center justify-end gap-4 border-t px-6 py-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button 
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="siteForm"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all"
          >
            <CheckCircle2 size={18} />
            Save Site
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSiteModal