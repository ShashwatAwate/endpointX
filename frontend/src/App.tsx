import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* examples */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/quest/:id" element={<Quest />} /> */}
      </Routes>
    </>
  )
}
