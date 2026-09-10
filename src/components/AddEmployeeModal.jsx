import { useState, useEffect } from 'react'
import { X, User, Mail, Hash, Building2, UtensilsCrossed, Briefcase, CheckCircle2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSites } from '../store'
import API_URL from '../config'

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  // Get real sites from Redux
  const { sites } = useSelector((state) => state.sites)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    department: '',
    site_id: '',
    shifts: [],
    role: 'Employee',
    status: 'Active'
  })

  // Fetch sites when modal opens
  useEffect(() => {
    if (isOpen) dispatch(fetchSites())
  }, [isOpen, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleShiftChange = (shift) => {
    setFormData(prev => ({
      ...prev,
      shifts: prev.shifts.includes(shift)
        ? prev.shifts.filter(s => s !== shift)
        : [...prev.shifts, shift]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const payload = {
      empId: formData.empId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      site_id: formData.site_id,
      shifts: formData.shifts,
      role: formData.role,
      status: formData.status
    }

    try {
      const response = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Employee Created:', data)
        onClose()
        // No refresh! The page will update when you navigate back to Employees.
      } else {
        console.error('❌ Error creating employee:', data.message)
        alert(data.message || 'Failed to create employee')
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      alert('Failed to connect to server')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Employee</h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3">
          <form id="employeeForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="name" required placeholder="e.g. Ahmed Hassan" value={formData.name} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="email" name="email" required placeholder="e.g. a.hassan@corp.com" value={formData.email} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Employee ID</label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="empId" required placeholder="e.g. EMP-0007" value={formData.empId} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select name="department" required value={formData.department} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Product Management">Product Management</option>
                  </select>
                </div>
              </div>

              {/* Mess Site - Uses Real Sites from Redux! */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mess Site</label>
                <div className="relative">
                  <UtensilsCrossed size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select name="site_id" required value={formData.site_id} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="">Select Site</option>
                    {sites.map(site => (
                      <option key={site._id} value={site._id}>
                        {site.name} ({site.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select name="role" required value={formData.role} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="Employee">Employee</option>
                    <option value="Mess Keeper">Mess Keeper</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</label>
              <div className="relative">
                <CheckCircle2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select name="status" value={formData.status} onChange={handleChange} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className={`text-sm font-medium mb-3 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Allowed Shifts</label>
              <div className="flex flex-wrap gap-3">
                {['Breakfast', 'Lunch', 'Dinner'].map((shift) => (
                  <label key={shift} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.shifts.includes(shift)
                      ? isDarkMode ? 'bg-indigo-500/10 border-indigo-500' : 'bg-indigo-50 border-indigo-500'
                      : isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="checkbox" className="peer hidden" checked={formData.shifts.includes(shift)} onChange={() => handleShiftChange(shift)} />
                    <span className={`text-sm font-bold ${formData.shifts.includes(shift) ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                      {shift}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className={`flex items-center justify-end gap-4 border-t p-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button type="button" onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            Cancel
          </button>
          <button type="submit" form="employeeForm" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all">
            <CheckCircle2 size={18} />
            Save Employee
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeeModal