import { QRCodeSVG } from 'qrcode.react'
import { LayoutDashboard } from 'lucide-react'

const PrintEmployeeCard = ({ employee }) => {
  if (!employee) return null

  return (
    <div className="print-section bg-white p-10">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center">
          <LayoutDashboard size={24} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">MealTrack</span>
      </div>

      {/* Name and Details */}
      <div className="text-center mb-10">
        <p className="text-4xl font-bold text-gray-900">{employee.name}</p>
        <p className="text-xl text-gray-600 mt-3">{employee.empId}</p>
        <p className="text-base text-gray-500 mt-2">{employee.department}</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-8">
        <div className="p-5 border-2 border-gray-200 rounded-xl">
          <QRCodeSVG value={employee.empId} size={200} />
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-lg text-gray-500">Scan to verify employee</p>
    </div>
  )
}

export default PrintEmployeeCard