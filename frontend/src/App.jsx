import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignInPage from "./pages/Auth/Login";
import SignUpPage from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Home";
import Navbar from "./components/layout/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import About from "./pages/About/About";
const AppContent = ({ user, setUser, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      <Navbar
        isAuthenticated={!!user}
        userName={user?.displayName || user?.email || "User"}
        userAvatar={user?.photoURL}
        onLogout={handleLogout}
        currentPage={location.pathname}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage onSignIn={setUser} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={setUser} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  // Persist user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <AppContent user={user} setUser={setUser} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
