import { LoaderPage } from '@/Routes/LoaderPage';
import { useAuth } from '@clerk/clerk-react';
import React from 'react';
import { Navigate } from 'react-router-dom'; // ✅ Correct import

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoaderPage />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />; // ✅ Safe JSX redirect
  }

  return <>{children}</>; // ✅ Wrap children in fragment
}

export default ProtectedRoutes;
