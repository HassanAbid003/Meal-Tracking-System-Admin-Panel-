import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees, fetchSites } from '../store'
import { Search, Plus, ChevronDown, Eye, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import AddEmployeeModal from '../components/AddEmployeeModal'
import EmployeeDetailsModal from '../components/EmployeeDetailsModal'
import API_URL from '../config'
import { useDebounce } from '../hooks/useDebounce'

const PAGE_SIZE = 10

const Employees = () => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { employees, loading, error } = useSelector((state) => state.employees)
  const { sites } = useSelector((state) => state.sites)
  const dispatch = useDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [modalMode, setModalMode] = useState('view')

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchEmployees())
    dispatch(fetchSites())
  }, [dispatch])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedSite, selectedDept, selectedStatus])

  const formattedEmployees = useMemo(() => {
    return employees.map(emp => {
      const siteData = emp.site_id
      return {
        ...emp,
        siteCode: siteData && typeof siteData === 'object' ? siteData.code : 'N/A',
        siteName: siteData && typeof siteData === 'object' ? siteData.name : 'N/A',
        siteId: siteData && typeof siteData === 'object' ? siteData._id : null,
      }
    })
  }, [employees])

  const filteredEmployees = useMemo(() => {
    return formattedEmployees.filter(emp => {
      const matchesSearch =
        emp.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.empId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        emp.siteName.toLowerCase().includes(debouncedSearch.toLowerCase())

      const matchesSite = selectedSite === 'All Sites' || emp.siteCode === selectedSite
      const matchesDept = selectedDept === 'All Departments' || emp.department === selectedDept
      const matchesStatus = selectedStatus === 'All Status' || emp.status === selectedStatus

      return matchesSearch && matchesSite && matchesDept && matchesStatus
    })
  }, [formattedEmployees, debouncedSearch, selectedSite, selectedDept, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase()

  const getShiftClass = (shift) => {
    switch (shift) {
      case 'Breakfast': return 'bg-amber-500/10 text-amber-500'
      case 'Lunch': return 'bg-blue-500/10 text-blue-500'
      case 'Dinner': return 'bg-purple-500/10 text-purple-500'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const handleView = (emp) => { setSelectedEmployee(emp); setModalMode('view') }
  const handleEdit = (emp) => { setSelectedEmployee(emp); setModalMode('edit') }

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 mb-2">

        {/* Search */}
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

          {/* Site Filter */}
          <div className="relative md:w-44">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className={`appearance-none w-full border text-sm rounded-xl pl-4 pr-10 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-300/30 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <option value="All Sites">All Sites</option>
              {sites.map(site => (
                <option key={site._id} value={site.code}>
                  {site.code} - {site.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Department Filter */}
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
              <option>Quality Assurance</option>
              <option>Executive</option>
              <option>Security</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
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

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full md:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-1.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Count */}
      <p className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
        {filteredEmployees.length !== employees.length && ` (filtered from ${employees.length} total)`}
      </p>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading employees...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-800/30' : 'border-gray-200'}`}>
                    <th className={`py-2.5 pl-4 pr-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                    <th className={`py-2.5 px-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emp ID</th>
                    <th className={`py-3 px-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</th>
                    <th className={`py-2.5 px-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mess Site</th>
                    <th className={`py-2.5 px-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Allowed Shifts</th>
                    <th className={`py-2.5 px-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role</th>
                    <th className={`py-2.5 px-4 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`py-2.5 pl-2 pr-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((emp, index) => (
                    <tr key={emp._id || index} className={`border-b last:border-b-0 transition-colors duration-300 ${isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>

                      <td className="py-2 pl-4 pr-2 max-w-[140px]">
                        <div className="flex items-center gap-3">
                          {emp.image ? (
                            <img
                              src={emp.image}
                              alt={emp.name}
                              className={`w-8 h-8 rounded-full object-cover border ${isDarkMode ? 'border-indigo-600/30' : 'border-indigo-100'}`}
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-indigo-600/20 border-indigo-600/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                              {getInitials(emp.name)}
                            </div>
                          )}
                          <div>
                            <p className={`text-xs font-medium truncate... ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</p>
                            <p className={`text-[10px] truncate... ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className={`py-2 px-4 text-[13px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{emp.empId}</td>

                      <td className={`py-3 px-4 text-sm break-words whitespace-normal max-w-[120px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{emp.department}</td>

                      <td className="py-2 px-2">
                        <div className="flex flex-col">
                          <span className={`text-[13px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{emp.siteCode}</span>
                          <span className={`text-[10px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{emp.siteName}</span>
                        </div>
                      </td>

                      <td className="py-2 px-2 max-w-[120px]">
                        <div className="flex flex-wrap gap-1.5 max-w-180px">
                          {emp.shifts.map((shift, i) => (
                            <span key={i} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getShiftClass(shift)}`}>
                              {shift}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-2 px-4 max-w-[100px]">
                        <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-center whitespace-normal ${emp.role === 'Mess Keeper' ? (isDarkMode ? 'text-amber-500 bg-amber-500/10' : 'text-amber-600 bg-amber-50') : (isDarkMode ? 'text-gray-300 bg-slate-800' : 'text-gray-600 bg-gray-100')}`}>
                          {emp.role}
                        </span>
                      </td>

                      <td className="py-2 px-4">
                        <span className={`flex items-center gap-2 text-sm font-semibold ${emp.status === 'Active' ? (isDarkMode ? 'text-green-500' : 'text-green-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                          <span className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-2 pl-2 pr-2">
                        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-xs">
                Showing <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{startIndex + 1}</span> to{' '}
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.min(endIndex, filteredEmployees.length)}</span> of{' '}
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{filteredEmployees.length}</span> results
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => {
                      if (totalPages <= 7) return true
                      if (p === 1 || p === totalPages) return true
                      if (Math.abs(p - currentPage) <= 1) return true
                      return false
                    })
                    .map((p, i, arr) => {
                      const prev = arr[i - 1]
                      const showEllipsis = prev && p - prev > 1
                      return (
                        <span key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>}
                          <button
                            onClick={() => goToPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                              p === currentPage
                                ? 'bg-indigo-600 text-white'
                                : isDarkMode
                                  ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {p}
                          </button>
                        </span>
                      )
                    })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode}/>
      <EmployeeDetailsModal isOpen={selectedEmployee !== null} onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} mode={modalMode}/>
    </div>
  )
}

export default Employees