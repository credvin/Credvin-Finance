import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AIChat from './pages/AIChat';
import UnderwritingDashboard from './pages/UnderwritingDashboard';
import BorrowerDashboard from './pages/BorrowerDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import LenderPortal from './pages/LenderPortal';
import AdminLOS from './pages/AdminLOS';
import AuthRedirect from './pages/AuthRedirect';
import AdminUserManagement from './pages/AdminUserManagement';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/AIChat" element={<LayoutWrapper currentPageName="AIChat"><AIChat /></LayoutWrapper>} />
      <Route path="/UnderwritingDashboard" element={<LayoutWrapper currentPageName="UnderwritingDashboard"><UnderwritingDashboard /></LayoutWrapper>} />
      <Route path="/BorrowerDashboard" element={<LayoutWrapper currentPageName="BorrowerDashboard"><BorrowerDashboard /></LayoutWrapper>} />
      <Route path="/MerchantDashboard" element={<LayoutWrapper currentPageName="MerchantDashboard"><MerchantDashboard /></LayoutWrapper>} />
      <Route path="/LenderPortal" element={<LayoutWrapper currentPageName="LenderPortal"><LenderPortal /></LayoutWrapper>} />
      <Route path="/AdminLOS" element={<LayoutWrapper currentPageName="AdminLOS"><AdminLOS /></LayoutWrapper>} />
      <Route path="/portal" element={<AuthRedirect />} />
      <Route path="/AdminUserManagement" element={<LayoutWrapper currentPageName="AdminUserManagement"><AdminUserManagement /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
