import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Projects from "./pages/Projects";
import Monitoring from "./pages/Monitoring";
import SystemLogs from "./pages/SystemLogs";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-white">
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/logs" element={<SystemLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
