/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIChat from './pages/AIChat';
import AboutUs from './pages/AboutUs';
import ApplyLoan from './pages/ApplyLoan';
import Contact from './pages/Contact';
import Home from './pages/Home';
import HowItWorksPage from './pages/HowItWorksPage';
import LoanProducts from './pages/LoanProducts';
import PartnerWithUs from './pages/PartnerWithUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PartnerOnboarding from './pages/PartnerOnboarding';
import DealerDashboard from './pages/DealerDashboard';
import AdminOnboarding from './pages/AdminOnboarding';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIChat": AIChat,
    "AboutUs": AboutUs,
    "ApplyLoan": ApplyLoan,
    "Contact": Contact,
    "Home": Home,
    "HowItWorksPage": HowItWorksPage,
    "LoanProducts": LoanProducts,
    "PartnerWithUs": PartnerWithUs,
    "PrivacyPolicy": PrivacyPolicy,
    "TermsOfService": TermsOfService,
    "PartnerOnboarding": PartnerOnboarding,
    "DealerDashboard": DealerDashboard,
    "AdminOnboarding": AdminOnboarding,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
