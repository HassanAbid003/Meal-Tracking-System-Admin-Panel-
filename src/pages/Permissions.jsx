import { useState, useEffect } from 'react'
import {
  AlertTriangle, Search, ChevronDown, Check, RefreshCw,
  FileText, Download, Building2, Users, Clock, Monitor,
  LayoutDashboard, ShieldAlert, Key,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers, updateUserPermissions, updateUserRole, promoteEmployee, resetUserPassword } from '../store'
import { fetchSites } from '../store'
import { useConfirm } from '../context/ConfirmContext'
import { showSuccess, showError } from '../utils/toast'
import { logError } from '../utils/logger'
import PromoteEmployeeModal from '../components/PromoteEmployeeModal'
import ResetPasswordModal from '../components/ResetPasswordModal'

const PAGE_LIST = [
  { key: 'dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { key: 'messSites',   label: 'Mess Sites',   icon: Building2 },
  { key: 'employees',   label: 'Employees',    icon: Users },
  { key: 'shifts',      label: 'Shifts',       icon: Clock },
  { key: 'devices',     label: 'Devices',      icon: Monitor },
  { key: 'departments', label: 'Departments',  icon: FileText },
  { key: 'reports',     label: 'Reports',      icon: FileText },
]

const Permissions = () => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  const { user } = useSelector((state) => state.auth)
  const { users, loading, error } = useSelector((state) => state.users)
  const { sites } = useSelector((state) => state.sites)
  const dispatch = useDispatch()
  const confirm = useConfirm()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [selectedSite, setSelectedSite] = useState('All')
  const [updating, setUpdating] = useState(null)

  const [promoteTarget, setPromoteTarget] = useState(null)
  const [isPromoting, setIsPromoting] = useState(false)

  const [resetTarget, setResetTarget] = useState(null)
  const [isResetting, setIsResetting] = useState(false)

  const isSuperAdmin = user?.role === 'super_admin'

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(fetchSites())
      dispatch(fetchUsers())
    }
  }, [dispatch, isSuperAdmin])

  useEffect(() => {
    if (isSuperAdmin) {
      const timer = setTimeout(() => {
        dispatch(fetchUsers({
          search: searchTerm,
          role: activeTab,
          site_id: selectedSite,
        }))
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [dispatch, searchTerm, activeTab, selectedSite, isSuperAdmin])

  const refresh = () => {
    dispatch(fetchUsers({
      search: searchTerm,
      role: activeTab,
      site_id: selectedSite,
    }))
  }

  const togglePage = async (userId, pageKey) => {
    setUpdating(userId)
    try {
      const u = users.find(x => x._id === userId)
      if (!u) return

      const newPermissions = {
        ...u.permissions,
        pages: {
          ...u.permissions.pages,
          [pageKey]: !u.permissions.pages?.[pageKey],
        },
      }

      await dispatch(updateUserPermissions({
        userId,
        permissions: newPermissions,
      })).unwrap()
    } catch (err) {
      logError('Permission update failed:', err)
      showError('Failed to update permissions')
    } finally {
      setUpdating(null)
    }
  }

  const togglePerm = async (userId, key) => {
    setUpdating(userId)
    try {
      const u = users.find(x => x._id === userId)
      if (!u) return

      const newPermissions = {
        ...u.permissions,
        [key]: !u.permissions[key],
      }

      await dispatch(updateUserPermissions({
        userId,
        permissions: newPermissions,
      })).unwrap()
    } catch (err) {
      logError('Permission update failed:', err)
      showError('Failed to update permissions')
    } finally {
      setUpdating(null)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    const u = users.find(x => x._id === userId)
    if (!u) return

    if (u.source !== 'user') {
      showError('This is an employee. Use "Promote to Site Admin" instead.')
      return
    }

    const ok = await confirm({
      title: 'Change Role',
      message: `Change ${u.name}'s role to Employee? They will lose all admin access.`,
      confirmText: 'Demote',
      variant: 'warning',
    })

    if (!ok) return

    setUpdating(userId)
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap()
      showSuccess('Role updated successfully')
      refresh()
    } catch (err) {
      logError('Role update failed:', err)
      showError('Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const handlePromoteClick = (emp) => {
    const sel = document.getElementById(`site-select-${emp._id}`)
    const siteId = sel?.value || ''

    if (!siteId) {
      showError('Please select a site first')
      return
    }

    setPromoteTarget({ employee: emp, siteId })
  }

  const handlePromoteConfirm = async ({ password }) => {
    if (!promoteTarget) return

    setIsPromoting(true)
    try {
      const result = await dispatch(promoteEmployee({
        employeeId: promoteTarget.employee._id,
        role: 'site_admin',
        site_id: promoteTarget.siteId,
        password,
      })).unwrap()

      showSuccess(`${result.name} promoted to Site Admin`)
      setPromoteTarget(null)
      refresh()
    } catch (err) {
      logError('Promote failed:', err)
      showError(err || 'Failed to promote employee')
    } finally {
      setIsPromoting(false)
    }
  }

  const handleResetPassword = async ({ password }) => {
    if (!resetTarget) return

    setIsResetting(true)
    try {
      await dispatch(resetUserPassword({
        userId: resetTarget._id,
        password,
      })).unwrap()

      showSuccess('Password reset successfully')
      setResetTarget(null)
    } catch (err) {
      logError('Reset password failed:', err)
      showError(err || 'Failed to reset password')
    } finally {
      setIsResetting(false)
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className={`min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <ShieldAlert size={40} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access Denied</h2>
          <p className={`text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You don't have permission to access this page. This section is restricted to Super Admins only.
          </p>
        </div>
      </div>
    )
  }

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase() || '?'

  const getRoleBadge = (role) => {
    if (role === 'super_admin') return isDarkMode ? 'text-purple-400 bg-purple-500/10' : 'text-purple-600 bg-purple-50'
    if (role === 'site_admin') return isDarkMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-50'
    if (role === 'mess_keeper') return isDarkMode ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-50'
    return isDarkMode ? 'text-gray-400 bg-slate-800' : 'text-gray-600 bg-gray-100'
  }

  return (
    <div className={`min-h-screen p-3 sm:p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

      <div className={`rounded-xl border p-3 sm:p-4 mb-4 flex items-start gap-3 ${
        isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'
      }`}>
        <AlertTriangle size={20} className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`} />
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-amber-500' : 'text-amber-700'}`}>
          Grant page-level access to Site Admins. Toggling a page off will hide it from their sidebar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className={`appearance-none w-full border rounded-xl pl-4 pr-10 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-indigo-500 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="All">All Sites</option>
            {sites.map(s => (
              <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className={`inline-flex rounded-xl p-1 mb-4 overflow-x-auto max-w-full ${
        isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'
      }`}>
        {['All', 'super_admin', 'site_admin', 'employee'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab === 'All' ? 'All' : tab.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {error && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-400">Loading users...</div>
      )}

      {!loading && (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className={`text-center py-10 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No users found</p>
            </div>
          ) : (
            users.map((u) => {
              const isUpdating = updating === u._id
              const isSuper = u.role === 'super_admin'
              const isSiteAdmin = u.role === 'site_admin' && u.source === 'user'
              const isEmployee = u.source === 'employee'
              const canConfigure = isSiteAdmin

              return (
                <div key={u._id} className={`rounded-xl border p-3 sm:p-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${isDarkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{u.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${getRoleBadge(u.role)}`}>
                            {u.role.replace('_', ' ')}
                          </span>
                          {u.empId && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                              {u.empId}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{u.email}</p>
                        {u.site_id && (
                          <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            {u.site_id.code} - {u.site_id.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      {isUpdating && <RefreshCw size={16} className="text-indigo-500 animate-spin" />}

                      {isSuper && (
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Locked</span>
                      )}

                      {isSiteAdmin && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setResetTarget(u)}
                            disabled={isUpdating}
                            title="Reset Password"
                            className={`p-2 rounded-lg transition-all disabled:opacity-40 shrink-0 ${
                              isDarkMode
                                ? 'text-indigo-400 hover:text-white hover:bg-slate-800 border border-slate-700'
                                : 'text-indigo-600 hover:text-indigo-500 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <Key size={14} />
                          </button>

                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={isUpdating}
                            className={`text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 flex-1 sm:flex-none ${
                              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                          >
                            <option value="site_admin">Site Admin</option>
                            <option value="employee">Demote to Employee</option>
                          </select>
                        </div>
                      )}

                      {isEmployee && (
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Not a user
                        </span>
                      )}
                    </div>
                  </div>

                  {isSuper && (
                    <div className={`rounded-xl p-3 text-xs border ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      Super Admin always has full access.
                    </div>
                  )}

                  {isEmployee && (
                    <div className={`rounded-xl p-3 text-xs border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        This employee doesn't have a user account yet. Promote them to Site Admin to grant access.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          id={`site-select-${u._id}`}
                          defaultValue={u.site_id?._id || ''}
                          className={`text-xs border rounded-lg px-3 py-1.5 flex-1 ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        >
                          <option value="">-- Select Site --</option>
                          {sites.map(s => (
                            <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handlePromoteClick(u)}
                          disabled={isUpdating}
                          className="px-4 py-2 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs disabled:opacity-50 whitespace-nowrap"
                        >
                          Promote to Site Admin
                        </button>
                      </div>
                    </div>
                  )}

                  {canConfigure && (
                    <>
                      <p className={`text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Page Access
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                        {PAGE_LIST.map(({ key, label, icon: Icon }) => {
                          const enabled = u.permissions?.pages?.[key]
                          return (
                            <button
                              key={key}
                              onClick={() => togglePage(u._id, key)}
                              disabled={isUpdating}
                              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                                enabled
                                  ? isDarkMode
                                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                                    : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                                  : isDarkMode
                                    ? 'bg-slate-800/50 border-slate-700 text-gray-400'
                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <Icon size={14} className="shrink-0" />
                                <span className="truncate">{label}</span>
                              </span>
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                                enabled ? 'bg-indigo-600 border-indigo-600' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                              }`}>
                                {enabled && <Check size={10} className="text-white" />}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <p className={`text-xs font-semibold uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Data Scope
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() => togglePerm(u._id, 'viewAllSites')}
                          disabled={isUpdating}
                          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                            u.permissions?.viewAllSites
                              ? isDarkMode
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                              : isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 text-gray-400'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <Building2 size={14} className="shrink-0" />
                            <span className="truncate">View All Sites</span>
                          </span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                            u.permissions?.viewAllSites ? 'bg-indigo-600 border-indigo-600' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}>
                            {u.permissions?.viewAllSites && <Check size={10} className="text-white" />}
                          </span>
                        </button>

                        <button
                          onClick={() => togglePerm(u._id, 'exportData')}
                          disabled={isUpdating}
                          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                            u.permissions?.exportData
                              ? isDarkMode
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                              : isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 text-gray-400'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <Download size={14} className="shrink-0" />
                            <span className="truncate">Export Data</span>
                          </span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                            u.permissions?.exportData ? 'bg-indigo-600 border-indigo-600' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}>
                            {u.permissions?.exportData && <Check size={10} className="text-white" />}
                          </span>
                        </button>
                      </div>
                    </>
                  )}

                </div>
              )
            })
          )}
        </div>
      )}

      <PromoteEmployeeModal
        isOpen={!!promoteTarget}
        employee={promoteTarget?.employee}
        onPromote={handlePromoteConfirm}
        onClose={() => !isPromoting && setPromoteTarget(null)}
        isPromoting={isPromoting}
      />

      <ResetPasswordModal
        isOpen={!!resetTarget}
        user={resetTarget}
        onReset={handleResetPassword}
        onClose={() => !isResetting && setResetTarget(null)}
        isResetting={isResetting}
      />
    </div>
  )
}

export default Permissions