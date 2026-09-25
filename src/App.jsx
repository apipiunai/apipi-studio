import { Routes, Route, Navigate } from "react-router-dom"

import { useAuth } from "./providers/AuthProvider"

import Layout from "./layout/Layout"
import Studio3D from "./pages/studio-3d/Studio3D"
import Login from "./pages/login/Login"
// import StudioIMG from "./pages/studioimg/StudioIMG"
// import StudioVideo from "./pages/studiovideo/StudioVideo"



import './App.css'

function App() {

  const { modules } = useAuth()

  return (
    <Routes>

      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/studio-3d" replace />} />
        <Route path="/studio-3d" element={<Studio3D />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
