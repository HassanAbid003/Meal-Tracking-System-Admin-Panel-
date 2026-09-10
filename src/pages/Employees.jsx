import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../store'
import { Search, Plus, ChevronDown, Eye, Pencil } from 'lucide-react'
import { useState, useMemo } from 'react'
import AddEmployeeModal from '../components/AddEmployeeModal'
import EmployeeDetailsModal from '../components/EmployeeDetailsModal'


const Employees = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [modalMode, setModalMode] = useState('view') 
  
  // 1. STATE FOR SEARCH & FILTERS
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  // 2. GET EMPLOYEES FROM REDUX
  const { employees, loading, error } = useSelector((state) => state.employees)
  
  const dispatch = useDispatch()

  // 3. FETCH EMPLOYEES WHEN PAGE LOADS
  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  // 4. MAP BACKEND DATA TO FRONTEND FORMAT
  const formattedEmployees = useMemo(() => {
    return employees.map(emp => {
      const siteData = emp.site_id; // This is the object from backend
      return {
        ...emp,
        // If site_id is an object, get the code and name from it
        siteCode: siteData && typeof siteData === 'object' ? siteData.code : 'N/A',
        siteName: siteData && typeof siteData === 'object' ? siteData.name : 'N/A',
        siteId: siteData && typeof siteData === 'object' ? siteData._id : null
      }
    })
  }, [employees])

  const filteredEmployees = useMemo(() => {
    return formattedEmployees.filter(emp => {
      // Search filter
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.siteName.toLowerCase().includes(searchTerm.toLowerCase())    

      // Site filter - USE emp.siteCode (from formattedEmployees)
      const matchesSite = selectedSite === 'All Sites' || emp.siteCode === selectedSite

      // Department filter
      const matchesDept = selectedDept === 'All Departments' || emp.department === selectedDept

      // Status filter
      const matchesStatus = selectedStatus === 'All Status' || emp.status === selectedStatus

      return matchesSearch && matchesSite && matchesDept && matchesStatus
    })
  }, [formattedEmployees, searchTerm, selectedSite, selectedDept, selectedStatus])
  
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const getShiftClass = (shift) => {
    switch (shift) {
      case 'Breakfast': return 'bg-amber-500/10 text-amber-500'
      case 'Lunch': return 'bg-blue-500/10 text-blue-500'
      case 'Dinner': return 'bg-purple-500/10 text-purple-500'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const handleView = (emp) => {
    setSelectedEmployee(emp)
    setModalMode('view')
  }

  const handleEdit = (emp) => {
    setSelectedEmployee(emp)
    setModalMode('edit')
  }

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Bar: Search, Filters, Add Button */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 mb-2">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-250px">
          <Search className="absolute left-4 top-2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-11 pr-4 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-300/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative md:w-40">
            <select 
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className={`appearance-none w-full border text-sm rounded-xl pl-4 pr-10 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-300/30 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <option>All Sites</option>
              <option>MCC</option>
              <option>TBC</option>
              <option>NWD</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative md:w-48">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={`appearance-none w-full border text-sm rounded-xl pl-4 pr-10 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-300/30 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Product Management</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative md:w-40">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`appearance-none w-full border text-sm rounded-xl pl-4 pr-10 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-300/30 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Add Employee Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Showing X of Y */}
      <p className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading employees...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
      /* Employee Table */
      <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-800/30' : 'border-gray-200'}`}>
                      <th className={`py-2.5 pl-4 pr-2 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                      <th className={`py-2.5 px-4 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emp ID</th>
                      <th className={`py-3 px-4 text-xs font-medium transition-colors duration-300  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</th>
                      <th className={`py-2.5 px-2 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mess Site</th>
                      <th className={`py-2.5 px-2 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Allowed Shifts</th>
                      <th className={`py-2.5 px-4 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role</th>
                      <th className={`py-2.5 px-4 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                      <th className={`py-2.5 pl-2 pr-2 text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, index) => (
                      <tr key={index} className={`border-b last:border-b-0 transition-colors duration-300 ${
                        isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'
                      }`}>
                        
                        {/* Employee */}
                        <td className="py-2 pl-4 pr-2 max-w-[140px]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                              isDarkMode ? 'bg-indigo-600/20 border-indigo-600/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                            }`}>
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <p className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</p>
                              <p className={`text-[10px] transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Emp ID */}
                        <td className={`py-2 px-4 text-[13px] font-mono transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <div className="flex flex-col">
                            <span>{emp.empId}</span>
                          </div>
                        </td>

                        {/* Department */}
                        <td className={`py-3 px-4 text-sm transition-colors duration-300 break-words whitespace-normal max-w-[120px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{emp.department}</td>

                        {/* Mess Site */}
                        <td className="py-2 px-2">
                          <div className="flex flex-col">
                            <span className={`text-[13px] font-medium transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {emp.siteCode}
                            </span>
                            <span className={`text-[10px] transition-colors duration-300 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {emp.siteName}
                            </span>
                          </div>
                        </td>

                        {/* Allowed Shifts */}
                        <td className="py-2 px-2 max-w-[120px]" >
                          <div className="flex flex-wrap gap-1.5 max-w-180px">
                            {emp.shifts.map((shift, i) => (
                              <span key={i} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getShiftClass(shift)}`}>
                                {shift}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-2 px-4 max-w-[100px]">
                          <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-center whitespace-normal wrap:break-words transition-colors duration-300 ${
                            emp.role === 'Mess Keeper' 
                              ? isDarkMode ? 'text-amber-500 bg-amber-500/10' : 'text-amber-600 bg-amber-50' 
                              : isDarkMode ? 'text-gray-300 bg-slate-800' : 'text-gray-600 bg-gray-100'
                          }`}>
                            {emp.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-4">
                          <span className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                            emp.status === 'Active' 
                              ? isDarkMode ? 'text-green-500' : 'text-green-600' 
                              : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            {emp.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-2 pl-2 pr-2">
                          <div className={`flex items-center gap-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <button onClick={() => handleView(emp)} className="hover:text-indigo-500 transition-colors"><Eye size={18} /></button>
                            <button onClick={() => handleEdit(emp)} className="hover:text-indigo-500 transition-colors"><Pencil size={18} /></button>                          
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      </div>
      )}
      
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode}/>
      <EmployeeDetailsModal isOpen={selectedEmployee !== null} onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} mode={modalMode}/>
    </div>
  )
}

export default Employees