import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/auth-context';
import { LoginPage } from './auth/login-page';
import { ProductsPage } from './products/products-page';

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
