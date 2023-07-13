import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Profile } from '../pages/Profile'
import { ResetPassword } from '../pages/ResetPassword'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import { ProtectedRouteWrapper } from './ProtectedRouteWrapper'
import { PublicRouteWrapper } from './PublicRouteWrapper'

const RoutesApp: React.FC = () => (
  <Routes>
    <Route element={<PublicRouteWrapper />}>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Route>

    <Route element={<ProtectedRouteWrapper />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
)

export default RoutesApp
