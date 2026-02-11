import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Navbar from "./components/Navbar"
import QuestionsPage from "./pages/Questions"
import QuestionSolve from "./pages/QuestionSolve"

export default function App() {
  return (
    <div className="font-mono">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/question" element={<QuestionsPage />} />

        <Route path="/question/:id" element={<QuestionSolve />} />
      </Routes>
    </div >
  )
}
