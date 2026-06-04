import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CertificateDetail from "./pages/CertificateDetail";
import IssueCertificate from "./pages/IssueCertificate";
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/certificate/:id"
          element={<CertificateDetail />}
        />

        <Route
          path="/issue"
          element={<IssueCertificate />}
        />

        <Route
          path="/verify"
          element={<VerifyCertificate />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;