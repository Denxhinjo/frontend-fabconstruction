import React, { useState, useEffect } from "react";
import { parseJwt } from "./auth.js";
import { LanguageProvider } from "./i18n.jsx";

// Import all the components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import HomePage from "./components/HomePage";
import ReportingDashboard from "./components/ReportingDashboard";
import UserDashboard from "./components/UserDashboard";

// Helper function to parse JWT
// In a larger app, you would move this to a separate utility file e.g., src/utils/auth.js
// export function parseJwt(token) {
//     if (!token) { return null; }
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
//         return JSON.parse(jsonPayload);
//     } catch (e) {
//         console.error("Error parsing JWT:", e);
//         return null;
//     }
// }

// This is the main application component that contains the logic
function MainApp() {
  const [view, setView] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = parseJwt(token);
      if (userData) {
        setIsLoggedIn(true);
        setAuthToken(token);
        setUserPermissions(userData.permissions || []);
        setView("dashboard");
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("authToken", token);
    const userData = parseJwt(token);
    if (userData) {
      setIsLoggedIn(true);
      setAuthToken(token);
      setUserPermissions(userData.permissions || []);
      setView("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserPermissions([]);
    setView("home");
  };

  const renderView = () => {
    if (isLoggedIn) {
      switch (view) {
        case "dashboard":
          return (
            <UserDashboard
              authToken={authToken}
              userPermissions={userPermissions}
            />
          );
        case "reports":
          return <ReportingDashboard authToken={authToken} />;
        default:
          return (
            <UserDashboard
              authToken={authToken}
              userPermissions={userPermissions}
            />
          );
      }
    }
    switch (view) {
      case "login":
        return (
          <LoginForm setView={setView} onLoginSuccess={handleLoginSuccess} />
        );
      case "signup":
        return <SignUpForm setView={setView} />;
      case "home":
      default:
        return <HomePage setView={setView} />;
    }
  };
  console.log("User permissions from JWT:", userPermissions);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        setView={setView}
      />
      <main className="flex-grow">{renderView()}</main>
      {!isLoggedIn && <Footer />}
    </div>
  );
}

// The root App component's only job is to provide the language context
export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
