import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import VoiceAssistant from './transcribe.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    {/* <VoiceAssistant/> */}
  </>
)
