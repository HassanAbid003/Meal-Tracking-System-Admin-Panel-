import { useSelector } from 'react-redux'

const StatBox = ({ icon: Icon, value, title, subtext, trend }) => {
  const isDarkMode = useSelector((state) => state.auth.isDarkMode)
  return (
    <div className={`rounded-xl shadow-sm p-5 flex flex-col gap-4 border transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      
      {/* Top Row */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`p-2.5 rounded-lg ${
          isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <Icon size={24} />
        </div>
        
        {/* Trend */}
        {trend === 'up' ? (
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-50 text-green-600'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
          </div>
        ) : (
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{title}</p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtext}</p>
      </div>
    </div>
  );
};

export default StatBox