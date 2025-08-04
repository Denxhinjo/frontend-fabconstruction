import React, { useState } from "react";
import { parseJwt } from "../auth.js";
import { useTranslation } from "../i18n";

export default function LoginForm({ setView, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Use the environment variable for the API URL
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/token/`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = parseJwt(data.access);

        if (userData && userData.is_staff) {
          setMessage(
            <span>
              {t("login_adminFail")}{" "}
              <a
                href="/admin"
                className="font-bold text-indigo-600 hover:underline"
              >
                {t("login_clickHere")}
              </a>
              .
            </span>
          );
        } else {
          onLoginSuccess(data.access);
        }
      } else {
        setMessage(t("login_fail"));
      }
    } catch (error) {
      setMessage(t("login_error"));
    }
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "/accounts/microsoft/login/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/static/img/logo.png"
            alt="Fab Construction Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("login_title")}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t("login_passwordPlaceholder")}
              />
            </div>
          </div>
          {message && (
            <p className="text-sm text-center text-red-600">{message}</p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("login_button")}
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              {t("login_continueWith")}
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={handleMicrosoftLogin}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 21 21"
            >
              <path d="M1 1h9v9H1zM11 1h9v9h-9zM1 11h9v9H1zM11 11h9v9h-9z"></path>
            </svg>
            Outlook
          </button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("login_or")}{" "}
          <button
            onClick={() => setView("signup")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("login_createAccount")}
          </button>
        </p>
      </div>
    </div>
  );
}
