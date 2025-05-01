import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
const Login = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + '/dashboard'
    });
  };
  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
};

export default Login;
