import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ReactKeycloakProvider } from '@react-keycloak/web';
import AppRoutes from './routes/AppRoutes';
import keycloak from './services/keycloak';
function App() {
  const [count, setCount] = useState(0)

  return (
    <ReactKeycloakProvider authClient={keycloak} 
     initOptions={{
    onLoad: 'check-sso', // silently check if user is logged in
    silentCheckSsoRedirectUri: window.location.origin + '/login',
  }}>
      <AppRoutes />
    </ReactKeycloakProvider>
  )
}

export default App
