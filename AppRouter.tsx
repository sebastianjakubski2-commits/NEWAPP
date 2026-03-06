import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Etap1Guard: React.FC = () => {
  const { uczestnik, isLoading } = useAuth();

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (!uczestnik) {
    return <Navigate to="/" replace />;
  }

  if (uczestnik.Etap1.zakonczono) {
    return <div>Quiz został już rozwiązany</div>;
  }

  return <Outlet />;
};

const Etap2Guard: React.FC = () => {
  const { uczestnik, isLoading } = useAuth();

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (!uczestnik) {
    return <Navigate to="/" replace />;
  }

  if (!uczestnik.DopuszczonyDoEtapu2) {
    return <div>Brak uprawnień do drugiego etapu</div>;
  }

  return <Outlet />;
};

// Placeholder components for the actual routes
const Home: React.FC = () => <div>Strona Główna Logowania</div>;
const Etap1View: React.FC = () => <div>Widok Etapu 1</div>;
const Etap2View: React.FC = () => <div>Widok Etapu 2</div>;

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Protected routes for Etap 1 */}
        <Route element={<Etap1Guard />}>
          <Route path="/etap1" element={<Etap1View />} />
        </Route>

        {/* Protected routes for Etap 2 */}
        <Route element={<Etap2Guard />}>
          <Route path="/etap2" element={<Etap2View />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
