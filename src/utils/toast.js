import toast from 'react-hot-toast'

export const showSuccess = (message) => {
  toast.success(message, { duration: 3000 })
}

export const showError = (message) => {
  toast.error(message || 'Something went wrong', { duration: 4500 })
}