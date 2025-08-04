import React, { useState } from "react";
import { useTranslation } from "../i18n";

// We will get this from the App component later
const API_URL = "https://inventory-management-system-yxam.onrender.com";

export default function SignUpForm({ setView }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        setMessage(t("signup_success"));
        setTimeout(() => setView("login"), 2000);
      } else {
        const errorData = await response.json();
        let errorMessage = t("signup_fail") + " ";
        for (const key in errorData) {
          errorMessage += `${key}: ${errorData[key].join(" ")} `;
        }
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage(t("login_error"));
    }
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "/accounts/microsoft/login/";
  };
  const handleGoogleLogin = () => {
    window.location.href = "/accounts/google/login/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.png"
            alt="Fab Construction Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("signup_title")}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                placeholder={t("signup_usernamePlaceholder")}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                placeholder={t("login_emailPlaceholder")}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                placeholder={t("login_passwordPlaceholder")}
              />
            </div>
          </div>
          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("sukses") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {t("signup_button")}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              {t("signup_continueWith")}
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={handleMicrosoftLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Sign up with Microsoft</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 21 21">
              <path d="M1 1h9v9H1zM11 1h9v9h-9zM1 11h9v9H1zM11 11h9v9h-9z"></path>
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("signup_haveAccount")}{" "}
          <button
            onClick={() => setView("login")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("signup_signIn")}
          </button>
        </p>
        <div className="mt-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
