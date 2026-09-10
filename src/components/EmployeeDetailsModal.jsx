import { useState, useEffect } from 'react'
import { X, User, Mail, Hash, Building2, UtensilsCrossed, Briefcase, CheckCircle2, Printer, LayoutDashboard } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSites } from '../store'
import EmployeeQRCode from './EmployeeQRCode'
import { updateEmployee } from '../store' 
import API_URL from '../config'

const EmployeeDetailsModal = ({ isOpen, onClose, employee, mode }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { sites } = useSelector((state) => state.sites)
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        empId: employee.empId || '',
        department: employee.department || '',
        site_id: employee.site_id ? employee.site_id._id : (employee.site_id || ''),
        shifts: employee.shifts || [],
        role: employee.role || 'Employee',
        status: employee.status || 'Active'
      })
    }
  }, [employee])

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
    if (mode === 'edit' && employee) {
      try {
        const token = localStorage.getItem('token')
        const payload = {
          ...formData,
          site_id: formData.site_id
        }

        const response = await fetch(`${API_URL}/api/employees/${employee._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
        
        const data = await response.json()
        if (response.ok) {
          console.log('✅ Employee updated:', data)
          
          // UPDATE REDUX INSTANTLY (No page reload!)
          dispatch(updateEmployee(data))
          
          // Just close the modal
          onClose()
        } else {
          alert(data.message || 'Failed to update employee')
        }
      } catch (error) {
        console.error('Error updating employee:', error)
        alert('Failed to connect to server')
      }
    } else {
      onClose()
    }
  }

  // Print function using a new window (NO CSS HACKS)
  const handlePrint = () => {
    const qrContainer = document.getElementById('qr-image-print')
    const qrSvg = qrContainer.querySelector('svg')
    const printWindow = window.open('', '_blank', 'width=600,height=700')
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Employee ID</title>
          <style>
            body { font-family: -apple-system, sans-serif; margin: 0; background: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; }
            .card { background: white; width: 350px; padding: 40px 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; }
            .logo-box { width: 48px; height: 48px; background: #6366f1; border-radius: 12px; display: flex; justify-content: center; align-items: center; margin: 0 auto 16px; color: white; font-size: 24px; }
            .app-name { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
            .employee-name { font-size: 28px; font-weight: 700; color: #0f172a; margin: 24px 0 4px; }
            .employee-id { font-size: 14px; color: #64748b; margin: 0 0 2px; }
            .employee-dept { font-size: 12px; color: #94a3b8; margin: 0 0 24px; }
            .qr-border { border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; background: white; display: inline-block; }
            .footer { font-size: 10px; color: #cbd5e1; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo-box">🍽️</div>
            <p class="app-name">MealTrack</p>
            <p class="employee-name">${formData.name}</p>
            <p class="employee-id">${formData.empId}</p>
            <p class="employee-dept">${formData.department}</p>
            <div class="qr-border">${qrSvg.outerHTML}</div>
            <p class="footer">Scan to verify employee</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (!isOpen || !employee) return null

  const isViewMode = mode === 'view'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isViewMode ? 'Employee Details' : 'Edit Employee'}
          </h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3">
          <form id="employeeDetailsForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Employee ID</label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="empId" required value={formData.empId} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input type="text" name="department" value={formData.department} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`} />
                </div>
              </div>

              {/* Mess Site - Uses REAL Sites from Redux! */}
              <div className="flex flex-col gap-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mess Site</label>
                <div className="relative">
                  <UtensilsCrossed size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select name="site_id" required value={formData.site_id} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>
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
                  <select name="role" required value={formData.role} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>
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
                <select name="status" value={formData.status} onChange={handleChange} disabled={isViewMode} className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>
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
                  } ${isViewMode ? 'pointer-events-none opacity-60' : ''}`}>
                    <input type="checkbox" className="peer hidden" checked={formData.shifts.includes(shift)} onChange={() => handleShiftChange(shift)} disabled={isViewMode} />
                    <span className={`text-sm font-bold ${formData.shifts.includes(shift) ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                      {shift}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* QR CODE */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <label className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Employee QR Code</label>
              <div id="qr-image-print" className="bg-white p-3 rounded-xl border border-gray-200">
                <EmployeeQRCode empId={formData.empId} size={180} />
              </div>
              <button 
                type="button"
                onClick={handlePrint}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-900/30 transition-all"
              >
                <Printer size={16} />
                Print ID Card
              </button>
            </div>
          </form>
        </div>

        <div className={`flex items-center justify-end gap-4 border-t p-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <button type="button" onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            {isViewMode ? 'Close' : 'Cancel'}
          </button>
          {!isViewMode && (
            <button type="submit" form="employeeDetailsForm" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all">
              <CheckCircle2 size={18} />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetailsModal