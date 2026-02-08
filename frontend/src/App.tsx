import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* examples */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/quest/:id" element={<Quest />} /> */}
    </Routes>
  )
}
