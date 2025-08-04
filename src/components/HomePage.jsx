import React from "react";
import { useTranslation } from "../i18n";

export default function HomePage({ setView }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white">
      <main>
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1-2 bg-gray-100"></div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-700 mix-blend-multiply"></div>
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">{t("home_title1")}</span>
                  <span className="block text-amber-100">
                    {t("home_title2")}
                  </span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-amber-50 sm:max-w-3xl">
                  {t("home_subtitle")}
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                    <button
                      onClick={() => setView("signup")}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-amber-800 bg-white hover:bg-amber-50 sm:px-8"
                    >
                      {t("home_getStarted")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
