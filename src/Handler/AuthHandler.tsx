import { db } from "@/Config/firebase.config";
import { LoaderPage } from "@/Routes/LoaderPage";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type  { User } from "@/Types/index"; 
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {

          const userSnap = await getDoc(doc(db, "users", user.id));

          if (!userSnap.exists()) { // If user document does NOT exist
            const userData: User = { // Create user data based on the User interface
              id: user.id,
              name: user.fullName || user.firstName || "Anonymous", // Get name from Clerk user object
              email: user.primaryEmailAddress?.emailAddress || "N/A", // Get email
              imageUrl: user.imageUrl, // Get image URL
              createdAt: serverTimestamp(), // Firestore timestamp for creation
              updatedAt: serverTimestamp(), // Firestore timestamp for last update
            };
            await setDoc(doc(db, "users", user.id), userData); // Set the user document in Firestore
          }
        } 
        catch (error) {
          console.log("Error on storing the user data : ", error); // Log any errors
        } 
        finally {
          setLoading(false); // Hide loader regardless of success or failure
        }
      }
    };

    storeUserData();
    
  }, [isSignedIn, user, pathname, navigate]); // Added navigate to dependency array as it's used inside useEffect

  if (loading) {
    return <LoaderPage />;
  }

  return null;
};

export default AuthHandler;