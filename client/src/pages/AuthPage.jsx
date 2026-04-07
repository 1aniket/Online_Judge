import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import Signup from '../components/Signup'

const Authpage = () => {
  return (
    <div className='bg-slate-200'>
        <Routes>
            <Route path='' element={<Login />} />
            <Route path='signup' element={<Signup />} />
        </Routes>
    </div>
   
  )
}

export default Authpage