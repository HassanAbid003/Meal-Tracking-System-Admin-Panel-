import { useState, useEffect } from 'react'

const EditTimeModal = ({ isOpen, onClose, shift, onSave, isDarkMode }) => {
  // State for the time inputs
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  // When the shift changes, update the time inputs
  useEffect(() => {
    if (shift) {
      setStartTime(shift.start_time || '')
      setEndTime(shift.end_time || '')
    }
  }, [shift])

  // If modal is not open or no shift is selected, don't render anything
  if (!isOpen || !shift) return null

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page refresh
    setLoading(true) // Show loading state
    
    try {
      // Call the onSave function passed from parent
      await onSave(shift._id, { 
        start_time: startTime, 
        end_time: endTime 
      })
      onClose() // Close the modal on success
    } catch (error) {
      alert('Failed to update times')
    } finally {
      setLoading(false) // Hide loading state
    }
  }

  return (
    // Overlay - covers the entire screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-gray-900'
      }`}>
        {/* Modal header */}
        <h3 className="text-xl font-bold mb-2">Edit Shift Times</h3>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Editing: <span className="font-semibold text-indigo-500">{shift.name}</span>
        </p>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Time input */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-indigo-500 transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
              required
            />
          </div>
          
          {/* End Time input */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-indigo-500 transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            
            {/* Save button */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 rounded-xl font-medium text-white transition-colors ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTimeModal