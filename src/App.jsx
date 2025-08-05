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
// This is the main application component that contains the logic
function MainApp() {
  const [view, setView] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  // --- NEW: State to manage the fade transition ---
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      // Use the transition handler to switch to the dashboard
      handleSetView("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserPermissions([]);
    // Use the transition handler to go home
    handleSetView("home");
  };

  // --- NEW: Function to handle view changes with a fade effect ---
  const handleSetView = (newView) => {
    if (view === newView) return; // Don't transition if the view is the same

    setIsTransitioning(true); // Start fade-out

    // After the fade-out duration, change the component and fade it back in
    setTimeout(() => {
      setView(newView);
      setIsTransitioning(false); // Start fade-in
    }, 300); // This duration should match the CSS transition duration
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
          <LoginForm
            setView={handleSetView}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "signup":
        return <SignUpForm setView={handleSetView} />;
      case "home":
      default:
        return <HomePage setView={handleSetView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        setView={handleSetView} // Pass the new handler to the Navbar
      />
      {/* --- UPDATED: Added transition classes to the main content area --- */}
      <main
        className={`flex-grow transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderView()}
      </main>
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
