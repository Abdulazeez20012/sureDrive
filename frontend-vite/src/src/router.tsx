import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage';
import InspectionsPage from './pages/inspections/InspectionsPage';
import InspectionDetailPage from './pages/inspections/InspectionDetailPage';
import BookInspectionPage from './pages/inspections/BookInspectionPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth guard
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppRouter = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
    </Route>

    {/* Auth routes */}
    <Route path="/auth" element={<AuthLayout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>

    {/* Protected routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="vehicles" element={<VehiclesPage />} />
      <Route path="vehicles/:id" element={<VehicleDetailPage />} />
      <Route path="inspections" element={<InspectionsPage />} />
      <Route path="inspections/:id" element={<InspectionDetailPage />} />
      <Route path="book-inspection" element={<BookInspectionPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    {/* 404 route */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
