import {LoaderPage} from '@/Routes/LoaderPage';
import { useAuth } from '@clerk/clerk-react';
import React from 'react'
import { useNavigate } from 'react-router';

function ProtectedRoutes({children} : {children : React.ReactNode}) {
  const navigate = useNavigate();

  const {isLoaded, isSignedIn} = useAuth();

  if(!isLoaded)
  {
     return (
      <LoaderPage/>
     );

  }

  if(!isSignedIn)
    {
       return (
        navigate("/signin")
       );
  
    }


  return  children;
}

export default ProtectedRoutes;