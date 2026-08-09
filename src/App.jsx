import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import EntityList from './pages/EntityList';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, checkAppState } = useAuth();

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
    // Any other app-state failure (bad app id, unreachable backend, etc.) used to fall
    // through silently here and render the full admin UI with no data — every entity
    // fetch then failed the same way and got swallowed by its own try/catch, so it just
    // showed "no records yet" everywhere with no indication anything was actually wrong.
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-6">
          <h1 className="text-lg font-semibold text-red-600 mb-2">Couldn't load the app</h1>
          <p className="text-sm text-gray-600 mb-4">{authError.message || "Unknown error"}</p>
          <button
            type="button"
            onClick={checkAppState}
            className="px-4 py-2 rounded-md bg-emerald-800 text-white text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/:entityName" element={<EntityList />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
