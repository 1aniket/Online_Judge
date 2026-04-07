import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Authpage from './pages/AuthPage';
import HomePage from './pages/HomePage';


const App = () => {
  return (
    <div className='text-3xl font-semibold'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth/*' element={<Authpage />} />
      </Routes>
    </div>
  )
}

export default App;