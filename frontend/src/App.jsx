import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trip/:id" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
