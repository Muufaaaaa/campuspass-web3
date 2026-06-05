import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CertificateDetail from "./pages/CertificateDetail";
import IssueCertificate from "./pages/IssueCertificate";
import VerifyCertificate from "./pages/VerifyCertificate";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/certificate/:id"
            element={
              <ProtectedRoute>
                <CertificateDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/issue"
            element={
              <ProtectedRoute>
                <IssueCertificate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <VerifyCertificate />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;