import { createContext, useContext, useState, useEffect } from "react";

// Paste your entire 'translations' object here
// --- 1. TRANSLATIONS OBJECT ---
const translations = {
  en: {
    // Navbar
    navbar_dashboard: "Dashboard",
    navbar_reports: "Reports",
    navbar_logout: "Logout",
    navbar_home: "Home",
    navbar_userLogin: "User Login",
    // Footer
    footer_adminLogin: "Admin Login",
    // Login Form
    login_title: "User Sign In",
    login_emailPlaceholder: "Email address",
    login_passwordPlaceholder: "Password",
    login_button: "Sign in",
    login_continueWith: "Or continue with",
    login_createAccount: "create an account",
    login_or: "Or",
    login_fail: "Login failed. Please check your email and password.",
    login_adminFail:
      "Admin login is at a different page. Please use the link in the footer or",
    login_clickHere: "click here",
    login_error: "An error occurred. Please try again.",
    // Sign Up Form
    signup_title: "Create a New User Account",
    signup_usernamePlaceholder: "Username",
    signup_button: "Create Account",
    signup_continueWith: "Or sign up with",
    signup_haveAccount: "Already have an account?",
    signup_signIn: "Sign in",
    signup_success: "Account created successfully! Redirecting to login...",
    signup_fail: "Failed to create account.",
    // Home Page
    home_title1: "Inventory Management",
    home_getStarted: "Sign Up As a New User",
    // Reports Dashboard
    reports_title: "Low Stock Report",
    reports_loading: "Loading low stock report...",
    reports_error: "Error:",
    reports_productName: "Product Name",
    reports_sku: "SKU",
    reports_quantity: "Quantity on Hand",
    reports_threshold: "Low Stock Threshold",
    reports_allGoodTitle: "All Good!",
    reports_allGoodSubtitle: "No products are currently low in stock.",
    // User Dashboard
    dashboard_title: "Inventory Dashboard",
    dashboard_location: "Location:",
    dashboard_all: "All",
    dashboard_addProduct: "Add New Product",
    dashboard_uploadExcel: "Upload Excel",
    dashboard_uploading: "Uploading...",
    dashboard_uploadSuccess: "Upload successful! Refreshing list...",
    dashboard_uploadError: "Error:",
    dashboard_noLocation: "No Location",
    dashboard_inStock: "in stock",
    dashboard_updateStock: "Update Stock",
    dashboard_editDetails: "Edit Details",
    dashboard_delete: "Delete",
    dashboard_confirmDelete:
      "Are you sure you want to permanently delete this product?",
    dashboard_loading: "Loading dashboard...",
    // Modals
    modal_addTitle: "Add a New Product",
    modal_productName: "Product Name",
    modal_sku: "SKU",
    modal_location: "Location",
    modal_selectLocation: "-- Select Location --",
    modal_initialQuantity: "Initial Quantity",
    modal_productImage: "Product Image",
    modal_cancel: "Cancel",
    modal_addProductButton: "Add Product",
    modal_editTitle: "Edit Product Details",
    modal_noLocation: "-- No Location --",
    modal_saveChanges: "Save Changes",
    modal_updateTitle: "Update Stock for",
    modal_currentQuantity: "Current quantity:",
    modal_quantity: "Quantity",
    modal_transactionType: "Transaction Type",
    modal_stockOut: "Stock Out (Remove from Inventory)",
    modal_stockIn: "Stock In (Add to Inventory)",
    modal_updateStockButton: "Update Stock",
  },
  al: {
    // Navbar
    navbar_dashboard: "Paneli",
    navbar_reports: "Raportet",
    navbar_logout: "Dil",
    navbar_home: "Kryefaqja",
    navbar_userLogin: "Hyrja e Përdoruesit",
    // Footer
    footer_adminLogin: "Hyrja e Administratorit",
    // Login Form
    login_title: "Hyr në Llogari",
    login_emailPlaceholder: "Adresa e email-it",
    login_passwordPlaceholder: "Fjalëkalimi",
    login_button: "Hyr",
    login_continueWith: "Ose vazhdo me",
    login_createAccount: "krijo një llogari",
    login_or: "Ose",
    login_fail:
      "Hyrja dështoi. Ju lutem kontrolloni email-in dhe fjalëkalimin.",
    login_adminFail:
      "Hyrja e administratorit bëhet në një faqe tjetër. Ju lutem përdorni linkun në fund të faqes ose",
    login_clickHere: "klikoni këtu",
    login_error: "Ndodhi një gabim. Ju lutem provoni përsëri.",
    // Sign Up Form
    signup_title: "Krijo një Llogari të Re",
    signup_usernamePlaceholder: "Emri i përdoruesit",
    signup_button: "Krijo Llogarinë",
    signup_continueWith: "Ose regjistrohu me",
    signup_haveAccount: "Keni tashmë një llogari?",
    signup_signIn: "Hyr",
    signup_success:
      "Llogaria u krijua me sukses! Duke u ridrejtuar tek hyrja...",
    signup_fail: "Krijimi i llogarisë dështoi.",
    // Home Page
    home_title1: "Menaxhimi i Inventarit",
    home_getStarted: "Regjistrohu si Perdorues i Ri",
    // Reports Dashboard
    reports_title: "Raporti i Stokut të Ulët",
    reports_loading: "Duke ngarkuar raportin e stokut të ulët...",
    reports_error: "Gabim:",
    reports_productName: "Emri i Produktit",
    reports_sku: "SKU",
    reports_quantity: "Sasia në Gjendje",
    reports_threshold: "Pragu i Stokut të Ulët",
    reports_allGoodTitle: "Gjithçka në Rregull!",
    reports_allGoodSubtitle:
      "Asnjë produkt nuk është aktualisht me stok të ulët.",
    // User Dashboard
    dashboard_title: "Paneli i Inventarit",
    dashboard_location: "Vendndodhja:",
    dashboard_all: "Të gjitha",
    dashboard_addProduct: "Shto Produkt të Ri",
    dashboard_uploadExcel: "Ngarko Excel",
    dashboard_uploading: "Duke ngarkuar...",
    dashboard_uploadSuccess: "Ngarkimi i suksesshëm! Duke rifreskuar listën...",
    dashboard_uploadError: "Gabim:",
    dashboard_noLocation: "Pa Vendndodhje",
    dashboard_inStock: "në gjendje",
    dashboard_updateStock: "Përditëso Stokun",
    dashboard_editDetails: "Modifiko Detajet",
    dashboard_delete: "Fshi",
    dashboard_confirmDelete:
      "Jeni i sigurt që doni të fshini përgjithmonë këtë produkt?",
    dashboard_loading: "Duke ngarkuar panelin...",
    // Modals
    modal_addTitle: "Shto një Produkt të Ri",
    modal_productName: "Emri i Produktit",
    modal_sku: "SKU",
    modal_location: "Vendndodhja",
    modal_selectLocation: "-- Zgjidh Vendndodhjen --",
    modal_initialQuantity: "Sasia Fillestare",
    modal_productImage: "Imazhi i Produktit",
    modal_cancel: "Anulo",
    modal_addProductButton: "Shto Produkt",
    modal_editTitle: "Modifiko Detajet e Produktit",
    modal_noLocation: "-- Pa Vendndodhje --",
    modal_saveChanges: "Ruaj Ndryshimet",
    modal_updateTitle: "Përditëso Stokun për",
    modal_currentQuantity: "Sasia aktuale:",
    modal_quantity: "Sasia",
    modal_transactionType: "Lloji i Transaksionit",
    modal_stockOut: "Dalje (Hiqe nga Inventari)",
    modal_stockIn: "Hyrje (Shtoje në Inventar)",
    modal_updateStockButton: "Përditëso Stokun",
  },
};

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", locale);
  }, [locale]);

  const contextValue = { locale, setLocale };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const { locale } = useContext(LanguageContext);
  function t(key) {
    // ... (your t function logic)
    return translations[locale][key] || key;
  }
  return { t };
}
