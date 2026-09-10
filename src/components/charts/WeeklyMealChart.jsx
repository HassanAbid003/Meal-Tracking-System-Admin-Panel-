

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const WeeklyMealChart = ({ isDarkMode }) => {
  const data = [
    { day: 'Mon', breakfast: 400, lunch: 600, dinner: 350 },
    { day: 'Tue', breakfast: 380, lunch: 580, dinner: 320 },
    { day: 'Wed', breakfast: 420, lunch: 620, dinner: 380 },
    { day: 'Thu', breakfast: 390, lunch: 590, dinner: 340 },
    { day: 'Fri', breakfast: 410, lunch: 610, dinner: 360 },
    { day: 'Sat', breakfast: 300, lunch: 450, dinner: 280 },
    { day: 'Sun', breakfast: 250, lunch: 380, dinner: 220 },
  ]

  // Define colors based on mode
  const gridColor = isDarkMode ? '#334155' : '#e5e7eb';
  const textColor = isDarkMode ? '#94a3b8' : '#6b7280';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e5e7eb';
  const tooltipText = isDarkMode ? '#fff' : '#111827';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        {/* Grid */}
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
        
        {/* Axis */}
        <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
        
        {/* Tooltip */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: tooltipBg, 
            border: `1px solid ${tooltipBorder}`, 
            borderRadius: '8px', 
            color: tooltipText 
          }} 
          cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        />
        
        {/* Legend */}
        <Legend wrapperStyle={{ color: textColor }} />
        
        {/* Exact Colors from Figma */}
        <Bar dataKey="breakfast" fill="#f59e0b" name="Breakfast" radius={[4, 4, 0, 0]} />
        <Bar dataKey="lunch" fill="#8b5cf6" name="Lunch" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dinner" fill="#6366f1" name="Dinner" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyMealChart