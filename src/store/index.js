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

// ---------- SITES ----------
export const fetchSites = createAsyncThunk('sites/fetchSites', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/sites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/sites/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/shifts`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/shifts/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to toggle shift')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- DEVICES ----------
export const fetchDevices = createAsyncThunk('devices/fetchDevices', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/devices`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch devices')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- SCANS ----------
export const fetchRecentScans = createAsyncThunk('scans/fetchRecentScans', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/scan/recent`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch scans')
    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ---------- EMPLOYEES ----------
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/employees`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` },
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
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.role && filters.role !== 'All') params.append('role', filters.role)
      if (filters.site_id && filters.site_id !== 'All') params.append('site_id', filters.site_id)

      const url = `${API_URL}/api/users${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
  async ({ employeeId, role, site_id, password }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/promote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, role, site_id, password }),
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
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
  initialState: { scans: [], loading: false, error: null },
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
  },
})

// DEVICES SLICE
const devicesSlice = createSlice({
  name: 'devices',
  initialState: { devices: [], loading: false, error: null },
  reducers: {
    setDevices: (state, action) => { state.devices = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDevices.fulfilled, (state, action) => { state.loading = false; state.devices = action.payload })
      .addCase(fetchDevices.rejected, (state, action) => { state.loading = false; state.error = action.payload })
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
      // Fetch users
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // Update permissions
      .addCase(updateUserPermissions.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateUserPermissions.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(updateUserPermissions.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // Update role
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
      // Promote employee
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
        // Reset password
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