import { useState } from 'react'
import './App.css'
import { Route, Router } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Home from '../pages/Home.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
    </Routes>
  )
}

export default App
