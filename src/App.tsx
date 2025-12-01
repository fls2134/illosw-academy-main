import { Routes, Route } from 'react-router-dom'
import MainPage from './routes/MainPage'
import FormPage from './routes/FormPage'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  )
}

export default App

