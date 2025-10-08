"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase-config';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe(); // Cleanup when component unmounts
  }, []);

  // Function to sign in with Google
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        // use token if needed
      }
      // The signed-in user info.
      const user = result.user;
      console.log('User signed in:', user);
    } catch (error: any) {
      // Handle Errors here.
      console.error('Error signing in:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  // Function to sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Portfolio View</h1>
          
          {/* Sign in/out button */}
          {user ? (
            <img 
              src={user.photoURL || ''}
              alt="Profile" 
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <button 
              onClick={handleSignIn}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </header>

        {/* Main content */}
        <main>
          {user ? (
            <div>
              <p className="text-lg mb-4">
                Welcome, <span className="font-semibold">{user.displayName}</span>!
              </p>
              {/* Your portfolio content goes here */}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Please sign in to view your portfolio
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}