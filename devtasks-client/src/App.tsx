import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";

function App() {
  const email = "testuser@test.com";
  const password = "123456";

  const login = async () => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
  };
  const testProtected = async () => {
    const res = await fetch("http://localhost:5000/protected", {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data.message);
  };
  useEffect(() => {
    login();
    testProtected();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
