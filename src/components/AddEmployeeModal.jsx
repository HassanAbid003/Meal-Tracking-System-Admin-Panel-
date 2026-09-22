import { useState, useEffect } from 'react'
import { X, User, Mail, Hash, Building2, UtensilsCrossed, Briefcase, CheckCircle2, Phone, CreditCard, Image as ImageIcon, Upload } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSites } from '../store'
import API_URL from '../config'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  let rest = digits.startsWith('92') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits
  rest = rest.slice(0, 10)
  if (rest.length <= 3) return `+92 ${rest}`
  return `+92 ${rest.slice(0, 3)}-${rest.slice(3)}`
}

const formatCnic = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 13)
  if (digits.length <= 5) return digits
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
}

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const dispatch = useDispatch()

  const { sites } = useSelector((state) => state.sites)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    department: '',
    site_id: '',
    shifts: [],
    role: 'Employee',
    status: 'Active',
    phone: '',
    cnic: ''
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (isOpen) dispatch(fetchSites())
  }, [isOpen, dispatch])

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null)
      setImagePreview(null)
      setFormData({
        name: '', email: '', empId: '', department: '', site_id: '',
        shifts: [], role: 'Employee', status: 'Active', phone: '', cnic: ''
      })
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'phone') {
      setFormData({ ...formData, phone: formatPhone(value) })
      return
    }
    if (name === 'cnic') {
      setFormData({ ...formData, cnic: formatCnic(value) })
      return
    }

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      showError('Only JPG, PNG, and WebP files are allowed')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showError('Image must be under 2MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = new FormData()
    payload.append('empId', formData.empId)
    payload.append('name', formData.name)
    payload.append('email', formData.email)
    payload.append('department', formData.department)
    payload.append('site_id', formData.site_id)
    payload.append('shifts', JSON.stringify(formData.shifts))
    payload.append('role', formData.role)
    payload.append('status', formData.status)
    payload.append('phone', formData.phone)
    payload.append('cnic', formData.cnic)
    if (imageFile) payload.append('image', imageFile)

    try {
      const response = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        credentials: 'include',                        
        body: payload,
      })

      const data = await response.json()
      if (response.ok) {
        showSuccess('Employee created successfully')
        onClose()
      } else {
        showError(data.message || 'Failed to create employee')
      }
    } catch (err) {
      logError('Employee create failed:', err)
      showError('Failed to connect to server')
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

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="tel" name="phone" required placeholder="+92 300-1234567" value={formData.phone} onChange={handleChange} maxLength={17} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CNIC</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="cnic" required placeholder="12345-6789012-3" value={formData.cnic} onChange={handleChange} maxLength={15} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profile Image <span className="text-xs opacity-70">(optional, max 2MB)</span></label>

                {!imagePreview ? (
                  <label className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all ${isDarkMode ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50' : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'}`}>
                    <Upload size={20} className="text-gray-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload image</span>
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                  </label>
                ) : (
                  <div className={`flex items-center gap-4 border rounded-xl p-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-300 dark:border-slate-600" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{imageFile?.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{imageFile ? (imageFile.size / 1024).toFixed(1) + ' KB' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                        Change
                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button type="button" onClick={handleRemoveImage} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

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