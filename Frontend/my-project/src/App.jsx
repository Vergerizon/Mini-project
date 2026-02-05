import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Transactions
import TransactionList from './pages/transactions/TransactionList';
import TransactionDetail from './pages/transactions/TransactionDetail';
import TransactionForm from './pages/transactions/TransactionForm';

// Products
import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import ProductForm from './pages/products/ProductForm';

// Categories
import CategoryList from './pages/categories/CategoryList';
import CategoryForm from './pages/categories/CategoryForm';

// Reports (Admin)
import ReportPage from './pages/reports/ReportPage';

// Users (Admin)
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
      />

      {/* Protected Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Transactions */}
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/transactions/add" element={<TransactionForm />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
        <Route path="/transactions/:id/edit" element={<TransactionForm />} />

        {/* Products */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/add" element={
          <ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>
        } />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/edit" element={
          <ProtectedRoute adminOnly><ProductForm /></ProtectedRoute>
        } />

        {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/add" element={
          <ProtectedRoute adminOnly><CategoryForm /></ProtectedRoute>
        } />
        <Route path="/categories/:id/edit" element={
          <ProtectedRoute adminOnly><CategoryForm /></ProtectedRoute>
        } />

        {/* Reports - Admin Only */}
        <Route path="/reports" element={
          <ProtectedRoute adminOnly><ReportPage /></ProtectedRoute>
        } />

        {/* Users - Admin Only */}
        <Route path="/users" element={
          <ProtectedRoute adminOnly><UserList /></ProtectedRoute>
        } />
        <Route path="/users/add" element={
          <ProtectedRoute adminOnly><UserForm /></ProtectedRoute>
        } />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute adminOnly><UserForm /></ProtectedRoute>
        } />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
