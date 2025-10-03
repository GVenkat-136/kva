import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainOutlet from '../layouts/MainOutlet.jsx';
import Login from '../pages/Login.jsx';
import Home from '../pages/Home.jsx';
import Godowns from '../pages/Godowns.jsx';
import Stores from '../pages/Stores.jsx';
import Stocks from '../pages/Stocks.jsx';
import Reports from '../pages/Reports.jsx';
import Account from '../pages/Account.jsx';
import { useAuth } from '../hooks/useAuth.js';

function PrivateRoute({ children, roles, redirect }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={redirect || "/stores"} replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainOutlet />
          </PrivateRoute>
        }
      >
        <Route 
          index 
          element={
            isManager ? (
              <Navigate to="/stores" replace />
            ) : (
              <Home />
            )
          } 
        />
        <Route 
          path="godowns" 
          element={
            <PrivateRoute roles={['admin']} redirect="/stores">
              <Godowns />
            </PrivateRoute>
          } 
        />
        <Route path="stores" element={<Stores />} />
        <Route path="stocks" element={<Stocks />} />
            <Route path="reports" element={<Reports />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to={isManager ? "/stores" : "/"} replace />} />
    </Routes>
  );
}



