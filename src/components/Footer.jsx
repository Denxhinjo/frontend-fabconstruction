import React from "react";
import { useTranslation } from "../i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {t("footer_adminLogin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
