import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Download, Printer, Calendar, Lock } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecentScans } from '../store'

const Reports = ({ }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { user } = useSelector((state) => state.auth)
  const { employees, loading: employeesLoading } = useSelector((state) => state.employees)
  const { scans, loading: scansLoading } = useSelector((state) => state.scans)
  const dispatch = useDispatch()
  const canExport = user?.role === 'super_admin' || user?.permissions?.exportData

  const [activeTab, setActiveTab] = useState('Daily')
  const [selectedSite, setSelectedSite] = useState('All Sites')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Fetch scans when component mounts
  useEffect(() => {
    dispatch(fetchRecentScans())
  }, [dispatch])

  // Get today's date string for comparison
  const today = new Date().toISOString().split('T')[0]

  // Helper: Check if a scan happened on a specific date
  const isScanOnDate = (scan, date) => {
    const scanDate = new Date(scan.createdAt).toISOString().split('T')[0]
    return scanDate === date
  }

  // Get all unique departments from employees
  const departments = useMemo(() => {
    const depts = new Set(employees.map(emp => emp.department))
    return ['All Departments', ...depts]
  }, [employees])

  // Get all unique sites from employees
  const sites = useMemo(() => {
    const siteList = new Set(employees.map(emp => emp.site_id?.code || 'N/A'))
    return ['All Sites', ...siteList]
  }, [employees])

  // Filter employees based on search, site, department
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSite = selectedSite === 'All Sites' || emp.site_id?.code === selectedSite
      const matchesDept = selectedDept === 'All Departments' || emp.department === selectedDept
      return matchesSearch && matchesSite && matchesDept
    })
  }, [employees, searchTerm, selectedSite, selectedDept])

  // Get scans for selected date
  const scansForDate = useMemo(() => {
    return scans.filter(scan => isScanOnDate(scan, selectedDate))
  }, [scans, selectedDate])

  // Calculate real stats for the selected date
  const stats = useMemo(() => {
    const allowedScans = scansForDate.filter(s => s.status === 'allowed')
    const deniedScans = scansForDate.filter(s => s.status === 'denied')

    const uniqueEaters = new Set(allowedScans.map(s => s.employee_id?._id || s.employee_id))
    const totalEmployees = filteredEmployees.length

    return {
      served: allowedScans.length,
      denied: deniedScans.length,
      absent: totalEmployees - uniqueEaters.size,
      total: totalEmployees,
      uniqueEaters: uniqueEaters.size
    }
  }, [scansForDate, filteredEmployees])

  // Get daily meal status for each employee
  const getDailyStatus = (emp) => {
    const employeeScans = scansForDate.filter(scan => {
      const empId = scan.employee_id?._id || scan.employee_id
      return empId === emp._id
    })

    const meals = { breakfast: false, lunch: false, dinner: false }

    employeeScans.forEach(scan => {
      // Only count ALLOWED scans
      if (scan.status !== 'allowed') return
      // Read the shift directly from the scan (saved by backend at scan time)
      if (scan.shift === 'Breakfast') meals.breakfast = true
      if (scan.shift === 'Lunch') meals.lunch = true
      if (scan.shift === 'Dinner') meals.dinner = true
    })

    const mealCount = Object.values(meals).filter(Boolean).length

    return {
      breakfast: meals.breakfast ? 'served' : 'absent',
      lunch: meals.lunch ? 'served' : 'absent',
      dinner: meals.dinner ? 'served' : 'absent',
      mealCount
    }
  }

  // Get weekly data for an employee
  const getWeeklyData = (emp) => {
    const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const weekStart = new Date(selectedDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    return days.map((day, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      const dayScans = scans.filter(s => {
        const empId = s.employee_id?._id || s.employee_id
        return empId === emp._id && s.status === 'allowed' && isScanOnDate(s, dateStr)
      })

      const hasBreakfast = dayScans.some(s => s.shift === 'Breakfast')
      const hasLunch = dayScans.some(s => s.shift === 'Lunch')
      const hasDinner = dayScans.some(s => s.shift === 'Dinner')

      return {
        day,
        date: dateStr,
        b: hasBreakfast ? 'served' : 'absent',
        l: hasLunch ? 'served' : 'absent',
        d: hasDinner ? 'served' : 'absent'
      }
    })
  }

  // Get monthly data for an employee
  const getMonthlyData = (emp) => {
    const monthStart = new Date(selectedDate)
    monthStart.setDate(1)

    const monthEnd = new Date(selectedDate)
    monthEnd.setMonth(monthEnd.getMonth() + 1)
    monthEnd.setDate(0)

    const daysInMonth = monthEnd.getDate()

    const monthScans = scans.filter(s => {
      const empId = s.employee_id?._id || s.employee_id
      return empId === emp._id && s.status === 'allowed' &&
        new Date(s.createdAt) >= monthStart &&
        new Date(s.createdAt) <= monthEnd
    })

    const mealsServed = monthScans.length
    const totalMeals = daysInMonth * 3
    const percent = totalMeals > 0 ? Math.round((mealsServed / totalMeals) * 100) : 0

    return {
      meals: mealsServed,
      total: totalMeals,
      days: daysInMonth,
      percent: Math.min(100, percent)
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'served': return <span className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>✓</span>
      case 'denied': return <span className={`text-xs font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>✗</span>
      case 'absent': return <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>○</span>
      case 'not_assigned': default: return <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>—</span>
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const handleExport = () => {
    console.log('Exporting CSV...')
  }

  const handlePrint = () => {
    window.print()
  }

  // Loading state
  if (employeesLoading || scansLoading) {
    return (
      <div className={`min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center py-20">
          <div className="text-2xl font-bold text-indigo-500 mb-4">Loading Reports...</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Please wait while we fetch your data</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 md:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Top Bar */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">

          {/* Tabs */}
          <div className={`inline-flex rounded-xl p-1 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'}`}>
            {['Daily', 'Weekly', 'Monthly'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`bg-transparent text-xs outline-none transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            />
            <Calendar size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          </div>

          {/* Site Filter */}
          <div className="relative">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className={`appearance-none w-full md:w-40 border rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {sites.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={`appearance-none w-full md:w-48 border rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-200px">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Action Buttons */}
          {canExport && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                  isDarkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-xl border px-4 py-3 transition-colors duration-300 border-green-500/20 ${isDarkMode ? 'bg-green-500/5' : 'bg-green-50'}`}>
            <p className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.served}</p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Meals Served</p>
          </div>
          <div className={`rounded-xl border px-4 py-3 transition-colors duration-300 border-red-500/20 ${isDarkMode ? 'bg-red-500/5' : 'bg-red-50'}`}>
            <p className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{stats.denied}</p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Denied / Duplicate</p>
          </div>
          <div className={`rounded-xl border px-4 py-3 transition-colors duration-300 border-yellow-500/20 ${isDarkMode ? 'bg-yellow-500/5' : 'bg-yellow-50'}`}>
            <p className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.absent}</p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</p>
          </div>
          <div className={`rounded-xl border px-4 py-3 transition-colors duration-300 border-indigo-500/20 ${isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-50'}`}>
            <p className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{stats.total}</p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Employees</p>
          </div>
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center gap-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> Meal served</span>
          <span className="flex items-center gap-1.5"><span className="text-red-500 font-bold">✗</span> Denied / duplicate attempt</span>
          <span className="flex items-center gap-1.5"><span className="text-gray-500">○</span> Absent (didn't arrive)</span>
          <span className="flex items-center gap-1.5"><span className="text-gray-400">—</span> Not assigned to this shift</span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Report Views */}
      <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-3 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <h3 className={`text-base font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {activeTab === 'Daily' ? `Daily Meal Report - ${new Date(selectedDate).toLocaleDateString()}` :
             activeTab === 'Weekly' ? 'Weekly Meal Report' : 'Monthly Meal Report'}
          </h3>
          <p className={`text-xs mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredEmployees.length} employees shown | {scansForDate.length} total scans today
          </p>
        </div>

        {/* DAILY VIEW */}
        {activeTab === 'Daily' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emp ID</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dept</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Breakfast</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lunch</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dinner</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meals</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const status = getDailyStatus(emp)
                  return (
                    <tr key={emp._id} className={`border-b last:border-b-0 ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                      <td className="py-2 px-6">
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</span>
                      </td>
                      <td className={`py-2 px-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.empId}</td>
                      <td className={`py-2 px-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.department}</td>
                      <td className="py-2 px-6"><span className={`text-xs font-semibold px-2 py-1 rounded-md ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{emp.site_id?.code || 'N/A'}</span></td>
                      <td className="py-2 px-6">{getStatusIcon(status.breakfast)}</td>
                      <td className="py-2 px-6">{getStatusIcon(status.lunch)}</td>
                      <td className="py-2 px-6">{getStatusIcon(status.dinner)}</td>
                      <td className={`py-2 px-6 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{status.mealCount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* WEEKLY VIEW */}
        {activeTab === 'Weekly' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                  <th className={`py-2 px-6 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dept</th>
                  {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                    const weekStart = new Date(selectedDate)
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
                    const date = new Date(weekStart)
                    date.setDate(date.getDate() + i)
                    return (
                      <th key={i} className={`py-2 px-2 text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex flex-col items-center">
                          <span>{day}</span>
                          <span className="opacity-70 text-[10px]">{date.toISOString().split('T')[0]}</span>
                          <div className="flex gap-0.5 mt-1">
                            <span className="text-[10px] text-amber-500">B</span>
                            <span className="text-[10px] text-yellow-500">L</span>
                            <span className="text-[10px] text-purple-500">D</span>
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const weeklyDays = getWeeklyData(emp)
                  return (
                    <tr key={emp._id} className={`border-b last:border-b-0 ${isDarkMode ? 'border-slate-800/50' : 'border-gray-100'}`}>
                      <td className="py-3 px-6">
                        <div>
                          <span className={`block text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</span>
                          <span className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.empId}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.department}</td>
                      {weeklyDays.map((day, i) => (
                        <td key={i} className="py-3 px-2 text-center">
                          <div className="flex gap-0.5 justify-center">
                            <span className="text-xs">{getStatusIcon(day.b)}</span>
                            <span className="text-xs">{getStatusIcon(day.l)}</span>
                            <span className="text-xs">{getStatusIcon(day.d)}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MONTHLY VIEW */}
        {activeTab === 'Monthly' && (
          <div className="p-6">
            <div className="space-y-8">
              {filteredEmployees.map((emp) => {
                const monthly = getMonthlyData(emp)
                return (
                  <div key={emp._id} className="flex items-center gap-6">
                    <div className="flex items-center gap-3 w-64">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.empId}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${monthly.percent}%` }}></div>
                      </div>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {monthly.meals} of {monthly.total} meals served ({monthly.days} days)
                      </p>
                    </div>

                    <span className={`text-sm font-bold w-12 text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{monthly.percent}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports