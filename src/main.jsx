
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux' // <--- Import Provider
import store from './store' // <--- Import the store you just created

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap everything in Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)