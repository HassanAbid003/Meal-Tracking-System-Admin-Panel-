// import { useState } from 'react'
// import { X, Building2, Hash, User, CheckCircle2 } from 'lucide-react'
// import { useSelector } from 'react-redux'

// const NewDepartmentModal = ({ isOpen, onClose }) => {
//   const isDarkMode = useSelector((state) => state.auth.isDarkMode)

//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     head: '',
//     assignedSite: ''
//   })

//   const availableSites = [
//     { code: 'MCC', name: 'Main Campus Canteen' },
//     { code: 'TBC', name: 'Tech Block Cafeteria' },
//     { code: 'NWD', name: 'North Wing Dining' },
//     { code: 'EXL', name: 'Executive Lounge' }
//   ]

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleSiteChange = (siteCode) => {
//     setFormData(prev => ({
//       ...prev,
//       assignedSite: siteCode
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log('New Department Data:', formData)
//     // TODO: Connect to backend API here
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

//       {/* Modal Container */}
//       <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        
//         {/* Modal Header */}
//         <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
//           <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Department</h2>
//           <button onClick={onClose} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
//             <X size={20} />
//           </button>
//         </div>

//         {/* Scrollable Body */}
//         <div className=" flex-1 overflow-y-auto px-6 py-3 max-h-[70vh]" style={{ scrollbarWidth: 'thin',  scrollbarColor: isDarkMode ? '#334155 #1e293b' : '#c1c1c1 #f3f4f6'}}>
//           <form id="departmentForm" onSubmit={handleSubmit}>
//             <div className="space-y-6">
              
//               {/* Department Name */}
//               <div className="flex flex-col gap-2">
//                 <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department Name</label>
//                 <div className="relative">
//                   <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input 
//                     type="text" 
//                     name="name" 
//                     required
//                     placeholder="e.g. Engineering"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
//                   />
//                 </div>
//               </div>

//               {/* Department Code */}
//               <div className="flex flex-col gap-2">
//                 <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department Code</label>
//                 <div className="relative">
//                   <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input 
//                     type="text" 
//                     name="code" 
//                     required
//                     placeholder="e.g. ENG"
//                     value={formData.code}
//                     onChange={handleChange}
//                     className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
//                   />
//                 </div>
//               </div>

//               {/* Head of Department */}
//               <div className="flex flex-col gap-2">
//                 <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Head of Department</label>
//                 <div className="relative">
//                   <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input 
//                     type="text" 
//                     name="head" 
//                     required
//                     placeholder="e.g. Ali Hassan"
//                     value={formData.head}
//                     onChange={handleChange}
//                     className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
//                   />
//                 </div>
//               </div>

//               {/* Assign To Single Site - RADIO BUTTONS */}
//               <div className="flex flex-col gap-2">
//                 <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assign To Site</label>
//                 <div className={`border rounded-xl p-3 space-y-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
//                   {availableSites.map((site) => (
//                     <label key={site.code} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
//                       <input 
//                         type="radio"
//                         name="assignedSite"
//                         className="w-4 h-4 cursor-pointer accent-indigo-600"
//                         checked={formData.assignedSite === site.code}
//                         onChange={() => handleSiteChange(site.code)}
//                       />
//                       <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {site.code} - {site.name}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className={`flex items-center justify-end gap-4 border-t px-6 py-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
//           <button type="button" onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
//             Cancel
//           </button>
//           <button type="submit" form="departmentForm" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all">
//             <CheckCircle2 size={18} />
//             Save Department
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NewDepartmentModal





















import { useState, useEffect } from 'react'
import { X, Building2, Hash, User, CheckCircle2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
// import { createDepartment } from '../store/departmentSlice'
import { fetchSites } from '../store'
import { createDepartment } from '../store' // Import from your store

const NewDepartmentModal = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { sites } = useSelector((state) => state.sites)
  const { loading } = useSelector((state) => state.departments)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    site_id: '' // This will store the site ID
  })

  const [error, setError] = useState('')

  // Fetch sites when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSites())
    }
  }, [isOpen, dispatch])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        code: '',
        head: '',
        site_id: ''
      })
      setError('')
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('') // Clear error when user types
  }

  const handleSiteChange = (siteId) => {
    setFormData(prev => ({
      ...prev,
      site_id: siteId
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.name.trim()) {
      setError('Department name is required')
      return
    }
    if (!formData.code.trim()) {
      setError('Department code is required')
      return
    }
    if (!formData.head.trim()) {
      setError('Department head is required')
      return
    }
    if (!formData.site_id) {
      setError('Please select a site')
      return
    }

    try {
      // Send data to backend
      const result = await dispatch(createDepartment(formData)).unwrap()
      
      // Close modal on success
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to create department')
      console.error('Error creating department:', error)
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
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Department</h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-3 max-h-[70vh]" style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#334155 #1e293b' : '#c1c1c1 #f3f4f6'}}>
          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${isDarkMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {error}
            </div>
          )}

          <form id="departmentForm" onSubmit={handleSubmit}>
            <div className="space-y-6">
              
              {/* Department Name */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Department Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="name" 
                    required
                    placeholder="e.g. Engineering"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Department Code */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Department Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="code" 
                    required
                    placeholder="e.g. ENG"
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Head of Department */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Head of Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    name="head" 
                    required
                    placeholder="e.g. Ali Hassan"
                    value={formData.head}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              {/* Assign To Site - RADIO BUTTONS */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Assign To Site <span className="text-red-500">*</span>
                </label>
                <div className={`border rounded-xl p-3 space-y-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  {sites.length === 0 ? (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No sites available. Please create a site first.
                    </p>
                  ) : (
                    sites.map((site) => (
                      <label key={site._id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
                        <input 
                          type="radio"
                          name="site_id"
                          className="w-4 h-4 cursor-pointer accent-indigo-600"
                          checked={formData.site_id === site._id}
                          onChange={() => handleSiteChange(site._id)}
                        />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {site.code} - {site.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
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
            form="departmentForm" 
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CheckCircle2 size={18} />
            {loading ? 'Saving...' : 'Save Department'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewDepartmentModal