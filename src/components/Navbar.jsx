import React, { useState, useContext } from "react";
import { LanguageContext, useTranslation } from "../i18n";

export default function Navbar({ isLoggedIn, onLogout, setView }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setLocale, locale } = useContext(LanguageContext);
  const { t } = useTranslation();

  const buttonStyle = (lang) =>
    `px-3 py-1 text-sm font-medium rounded-md ${
      locale === lang ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" onClick={() => setView("home")}>
              <img
                className="h-10"
                src="/logo.png"
                alt="Fab Construction Logo"
              />
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setView("dashboard")}
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t("navbar_dashboard")}
                  </button>
                  <button
                    onClick={() => setView("reports")}
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t("navbar_reports")}
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t("navbar_logout")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setView("home")}
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t("navbar_home")}
                  </button>
                  <button
                    onClick={() => setView("login")}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t("navbar_userLogin")}
                  </button>
                </>
              )}
              <div className="flex items-center space-x-2 pl-4">
                <button
                  onClick={() => setLocale("en")}
                  className={buttonStyle("en")}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale("al")}
                  className={buttonStyle("al")}
                >
                  AL
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setView("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t("navbar_dashboard")}
              </button>
              <button
                onClick={() => {
                  setView("reports");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t("navbar_reports")}
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t("navbar_logout")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setView("home");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t("navbar_home")}
              </button>
              <button
                onClick={() => {
                  setView("login");
                  setIsMobileMenuOpen(false);
                }}
                className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t("navbar_userLogin")}
              </button>
            </>
          )}
          <div className="flex items-center space-x-2 px-3 pt-4">
            <span className="text-gray-600 text-base font-medium">
              Language:
            </span>
            <button
              onClick={() => {
                setLocale("en");
                setIsMobileMenuOpen(false);
              }}
              className={buttonStyle("en")}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLocale("al");
                setIsMobileMenuOpen(false);
              }}
              className={buttonStyle("al")}
            >
              AL
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
