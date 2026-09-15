import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToolsListPage } from './pages/ToolsListPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { PlatformPage } from './pages/PlatformPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthModal } from './components/AuthModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { Toast } from './components/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#6E56CF]/30 selection:text-white w-full overflow-x-hidden">
          <Navbar />

          <div className="flex-1">
            <Routes>
              {/* Primary Listing Routes */}
              <Route path="/" element={<ToolsListPage />} />
              <Route path="/tools" element={<ToolsListPage />} />

              {/* Tool Detail Route */}
              <Route path="/tools/:slug" element={<ToolDetailPage />} />

              {/* Platform Documentation & Governance Routes */}
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/platform/:tab" element={<PlatformPage />} />
              <Route path="/api-docs" element={<PlatformPage />} />
              <Route path="/docs" element={<PlatformPage />} />
              <Route path="/api" element={<PlatformPage />} />
              <Route path="/badging" element={<PlatformPage />} />
              <Route path="/verified" element={<PlatformPage />} />
              <Route path="/terms" element={<PlatformPage />} />
              <Route path="/terms-of-service" element={<PlatformPage />} />
              <Route path="/privacy" element={<PlatformPage />} />
              <Route path="/privacy-policy" element={<PlatformPage />} />

              {/* 404 Route */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <Footer />

          {/* Global Modals, Drawers and Feedback Notifications */}
          <AuthModal />
          <BookmarksDrawer />
          <Toast />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
