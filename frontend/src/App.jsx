import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignInPage from "./pages/Auth/Login";
import SignUpPage from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Home";
import Navbar from "./components/layout/Navbar";
import Profile from "./pages/Profile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import About from "./pages/About/About";
import CarePage from "./pages/CarePage";

// Placeholder components (replace with actual components when available)
const ShopPage = () => <div>Shop Page (Placeholder)</div>;
const AdoptPage = () => <div>Adopt Page (Placeholder)</div>;
const VetPortal = () => <div>Vet Portal Page (Placeholder)</div>;
const AdminDashboard = () => <div>Admin Dashboard Page (Placeholder)</div>;

// ProtectedRoute component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const AppContent = ({ user, setUser, handleLogout }) => {
  const location = useLocation();

  const getNavbarProps = () => {
    if (user) {
      return {
        isAuthenticated: true,
        userName: user.displayName || user.email || "User",
        userAvatar:
          user.photoURL ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        userRole: user.role || "user",
        cartCount: 3,
        notificationCount: 5,
        onLogout: handleLogout,
        currentPage: getCurrentPage(location.pathname),
      };
    } else {
      return {
        isAuthenticated: false,
        onLogout: handleLogout,
        currentPage: getCurrentPage(location.pathname),
      };
    }
  };

  const getCurrentPage = (pathname) => {
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/adopt")) return "adopt";
    if (pathname.startsWith("/care")) return "care";
    if (pathname.startsWith("/shop")) return "shop";
    if (pathname.startsWith("/vet")) return "vet";
    if (pathname.startsWith("/admin")) return "admin";
    return "";
  };

  return (
    <>
      <Navbar {...getNavbarProps()} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage onSignIn={setUser} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={setUser} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* NEW: Added routes for navigation items */}
        <Route
          path="/care"
          element={
            <ProtectedRoute user={user}>
              <CarePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute user={user}>
              <ShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adopt"
          element={
            <ProtectedRoute user={user}>
              <AdoptPage />
            </ProtectedRoute>
          }
        />
        <Route path="/adopt/browse" element={<AdoptPage />} /> {/* Example sub-route */}
        <Route path="/adopt/homes" element={<AdoptPage />} />
        <Route path="/adopt/post" element={<AdoptPage />} />
        <Route path="/adopt/requests" element={<AdoptPage />} />
        <Route
          path="/vet"
          element={
            <ProtectedRoute user={user}>
              <VetPortal />
            </ProtectedRoute>
          }
        />
        <Route path="/vet/patients" element={<VetPortal />} />
        <Route path="/vet/appointments" element={<VetPortal />} />
        <Route path="/vet/records" element={<VetPortal />} />
        <Route path="/vet/reminders" element={<VetPortal />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !storedUser) {
        setUser(firebaseUser);
      } else if (!storedUser) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent user={user} setUser={setUser} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;