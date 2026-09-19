import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { fetchWeeklyStats } from '../../store'

const WeeklyMealChart = ({ isDarkMode }) => {
  const dispatch = useDispatch()
  const { weeklyStats = [] } = useSelector((state) => state.scans)

  useEffect(() => {
    dispatch(fetchWeeklyStats())
  }, [dispatch])

  const chartData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weeklyStats.map((row) => {
      // Parse as local date to avoid TZ shift on the label
      const d = new Date(row.date + 'T12:00:00')
      return {
        day: dayNames[d.getDay()],
        date: row.date,
        breakfast: row.breakfast,
        lunch: row.lunch,
        dinner: row.dinner,
      }
    })
  }, [weeklyStats])

  const hasData = useMemo(
    () => chartData.some((d) => d.breakfast + d.lunch + d.dinner > 0),
    [chartData]
  )

  const gridColor = isDarkMode ? '#334155' : '#e5e7eb'
  const textColor = isDarkMode ? '#94a3b8' : '#6b7280'
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff'
  const tooltipBorder = isDarkMode ? '#334155' : '#e5e7eb'
  const tooltipText = isDarkMode ? '#fff' : '#111827'

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          No meal data for the past 7 days
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: tooltipText,
          }}
          cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Bar dataKey="breakfast" fill="#f59e0b" name="Breakfast" radius={[4, 4, 0, 0]} />
        <Bar dataKey="lunch" fill="#8b5cf6" name="Lunch" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dinner" fill="#6366f1" name="Dinner" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyMealChart