import React from 'react'
import ReactDOM from 'react-dom/client'
// Fonts bundled with the site (no Google Fonts needed)
import '@fontsource/amiri/400.css' // Quran text
import '@fontsource/amiri/700.css'
import '@fontsource/dancing-script/600.css'
import '@fontsource/dancing-script/700.css'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/700.css'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
