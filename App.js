import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import { ToastContainer } from 'react-toastify'
import ViewViolation from './Components/ViewViolation'
import ViewComplaints from './Components/ViewComplaints'
import UpdatePassword from './Components/UpdatePassword'
import VehicleInfo from './Components/VehicleInfo'

export const baseurl = "https://yhmysore.in/api/trafficViolations1.php"

export default function App() {
  return (
    <>
    <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} >
      <Route path="violation" element={<ViewViolation />} />
      <Route path="complaints" element={<ViewComplaints />} />
      <Route path="password" element={<UpdatePassword />} />
      <Route path="vehicle" element={<VehicleInfo />} />
      </Route>

    </Routes>
    </BrowserRouter>
    </>
  )
}
