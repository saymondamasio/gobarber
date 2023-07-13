import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const PublicRouteWrapper = () => {
  const { user } = useAuth()

  const location = useLocation()

  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return <Outlet />
}
