import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({ token: null, setToken: () => {} });

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    localStorage.getItem('authToken') || null
  );

  const setToken = (tok) => {
    setTokenState(tok);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
