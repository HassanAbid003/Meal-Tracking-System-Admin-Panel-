import { QRCodeSVG } from 'qrcode.react'

const EmployeeQRCode = ({ empId, size = 150 }) => {
  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <QRCodeSVG value={empId} size={size} />
      <p className="text-center text-black font-bold mt-2 text-xs">{empId}</p>
    </div>
  )
}

export default EmployeeQRCode