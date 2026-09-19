import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_URL from '../config'

// ====================================================
// 1. AUTH SLICE
// ====================================================
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isDarkMode: true,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
  },
})

// ====================================================
// 2. ASYNC THUNKS
// ====================================================

// ---------- AUTH: PASSWORD RESET ----------
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to send reset email')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to reset password')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// ---------- SITES ----------
export const fetchSites = createAsyncThunk('sites/fetchSites', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/sites`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch sites')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const deleteSite = createAsyncThunk('sites/deleteSite', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/sites/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to delete site')
    return id
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- SHIFTS ----------
export const fetchShifts = createAsyncThunk('shifts/fetchShifts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/shifts`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch shifts')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const toggleShift = createAsyncThunk('shifts/toggleShift', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/shifts/${id}/toggle`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to toggle shift')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- DEVICES ----------
// ---------- DEVICES ----------
export const fetchDevices = createAsyncThunk('devices/fetchDevices', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/devices`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch devices')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async ({ name, serial, site_id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/devices`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, serial, site_id, status: status?.toLowerCase() || 'online' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create device')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, name, serial, site_id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/devices/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, serial, site_id, status: status?.toLowerCase() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update device')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/devices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to delete device')
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// ---------- SCANS ----------
export const fetchRecentScans = createAsyncThunk('scans/fetchRecentScans', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/scan/recent`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch scans')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchWeeklyStats = createAsyncThunk(
  'scans/fetchWeeklyStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/scan/stats/weekly`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch weekly stats')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
// ---------- EMPLOYEES ----------
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/employees`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch employees')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- DEPARTMENTS ----------
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/departments`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch departments')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/departments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentData),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create department')
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// ---------- USERS ----------
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.role && filters.role !== 'All') params.append('role', filters.role)
      if (filters.site_id && filters.site_id !== 'All') params.append('site_id', filters.site_id)

      const url = `${API_URL}/api/users${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch users')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserPermissions = createAsyncThunk(
  'users/updatePermissions',
  async ({ userId, permissions }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/permissions`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update permissions')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ userId, role, site_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, site_id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update role')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const promoteEmployee = createAsyncThunk(
  'users/promoteEmployee',
  async ({ employeeId, role, site_id, password, device_serial }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/promote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, role, site_id, password, device_serial }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to promote')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const resetUserPassword = createAsyncThunk(
  'users/resetPassword',
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to reset password')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// ====================================================
// 3. SLICES
// ====================================================

// SITES SLICE
const sitesSlice = createSlice({
  name: 'sites',
  initialState: { sites: [], loading: false, error: null },
  reducers: {
    addSite: (state, action) => { state.sites.push(action.payload) },
    updateSite: (state, action) => {
      const index = state.sites.findIndex(site => site._id === action.payload._id)
      if (index !== -1) state.sites[index] = action.payload
    },
    removeSite: (state, action) => {
      state.sites = state.sites.filter(site => site._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSites.fulfilled, (state, action) => { state.loading = false; state.sites = action.payload })
      .addCase(fetchSites.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

// EMPLOYEES SLICE
const employeesSlice = createSlice({
  name: 'employees',
  initialState: { employees: [], loading: false, error: null },
  reducers: {
    setEmployees: (state, action) => { state.employees = action.payload },
    addEmployee: (state, action) => { state.employees.push(action.payload) },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(emp => emp._id === action.payload._id)
      if (index !== -1) state.employees[index] = action.payload
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchEmployees.fulfilled, (state, action) => { state.loading = false; state.employees = action.payload })
      .addCase(fetchEmployees.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

// SHIFTS SLICE
const shiftsSlice = createSlice({
  name: 'shifts',
  initialState: { shifts: [], loading: false, error: null },
  reducers: {
    updateShiftInStore: (state, action) => {
      const index = state.shifts.findIndex(shift => shift._id === action.payload._id)
      if (index !== -1) state.shifts[index] = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchShifts.fulfilled, (state, action) => { state.loading = false; state.shifts = action.payload })
      .addCase(fetchShifts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(toggleShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(shift => shift._id === action.payload._id)
        if (index !== -1) state.shifts[index] = action.payload
      })
  },
})

// SCANS SLICE
const scansSlice = createSlice({
  name: 'scans',
  initialState: { scans: [], weeklyStats: [], loading: false, error: null },
  reducers: {
    setScans: (state, action) => { state.scans = action.payload },
    addScan: (state, action) => {
      state.scans = [action.payload, ...state.scans].slice(0, 50)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentScans.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRecentScans.fulfilled, (state, action) => { state.loading = false; state.scans = action.payload })
      .addCase(fetchRecentScans.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchWeeklyStats.pending, (state) => { state.loading = true })
      .addCase(fetchWeeklyStats.fulfilled, (state, action) => { state.loading = false; state.weeklyStats = action.payload })
      .addCase(fetchWeeklyStats.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})
// DEVICES SLICE
const devicesSlice = createSlice({
  name: 'devices',
  initialState: { devices: [], loading: false, error: null },
  reducers: {
    setDevices: (state, action) => { state.devices = action.payload },
    clearDevicesError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDevices.fulfilled, (state, action) => { state.loading = false; state.devices = action.payload })
      .addCase(fetchDevices.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createDevice.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false
        state.devices.push(action.payload)
      })
      .addCase(createDevice.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateDevice.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false
        const index = state.devices.findIndex(d => d._id === action.payload._id)
        if (index !== -1) state.devices[index] = action.payload
      })
      .addCase(updateDevice.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(deleteDevice.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false
        state.devices = state.devices.filter(d => d._id !== action.payload)
      })
      .addCase(deleteDevice.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

// DEPARTMENTS SLICE
const departmentSlice = createSlice({
  name: 'departments',
  initialState: { departments: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.loading = false; state.departments = action.payload })
      .addCase(fetchDepartments.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createDepartment.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false
        state.departments.push(action.payload)
      })
      .addCase(createDepartment.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

// USERS SLICE
const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [], loading: false, error: null },
  reducers: {
    clearUsersError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateUserPermissions.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateUserPermissions.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(updateUserPermissions.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateUserRole.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.deleted) {
          state.users = state.users.filter(u => u._id !== action.payload._id)
        } else {
          const index = state.users.findIndex(u => u._id === action.payload._id)
          if (index !== -1) state.users[index] = action.payload
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(promoteEmployee.pending, (state) => { state.loading = true; state.error = null })
      .addCase(promoteEmployee.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        } else {
          state.users.push(action.payload)
        }
      })
      .addCase(promoteEmployee.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(resetUserPassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(resetUserPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

// ====================================================
// 4. EXPORTS
// ====================================================
export const { setCredentials, logout, toggleTheme } = authSlice.actions
export const { addSite, updateSite, removeSite } = sitesSlice.actions
export const { setEmployees, addEmployee, updateEmployee, removeEmployee } = employeesSlice.actions
export const { setScans, addScan } = scansSlice.actions
export const { updateShiftInStore } = shiftsSlice.actions
export const { clearUsersError } = usersSlice.actions
export const { clearDevicesError } = devicesSlice.actions

// ====================================================
// 5. STORE
// ====================================================
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sites: sitesSlice.reducer,
    employees: employeesSlice.reducer,
    shifts: shiftsSlice.reducer,
    scans: scansSlice.reducer,
    devices: devicesSlice.reducer,
    departments: departmentSlice.reducer,
    users: usersSlice.reducer,
  },
})

export default store