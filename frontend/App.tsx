import React, { useState, useEffect } from 'react'
import MainNavigation from './src/navigation/MainNavigation/MainNavigation'
import { AuthProvider, useAuth } from './src/context/AuthContext' 

// Create a wrapper component to handle auth initialization
function AppContent() {
  const { checkLoginStatus } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Check if user is already logged in
        await checkLoginStatus();
      } catch (error) {
        console.warn('Error checking login status:', error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, [checkLoginStatus]);

  if (!appIsReady) {
    return null; // Or a splash screen
  }

  return <MainNavigation />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}