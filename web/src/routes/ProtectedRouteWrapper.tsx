import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedRouteWrapper = () => {
  const { user } = useAuth()

  const location = useLocation()

  if (user) {
    return <Outlet />
  }

  return <Navigate to="/" state={{ from: location }} replace />
}
