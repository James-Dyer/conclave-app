import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {}
});

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    localStorage.getItem('authToken') || null
  );
  const [user, setUserState] = useState(() => {
    const u = localStorage.getItem('authUser');
    return u ? JSON.parse(u) : null;
  });

  const setToken = (tok) => {
    setTokenState(tok);
  };

  const setUser = (usr) => {
    setUserState(usr);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('cachedCharges');
      localStorage.removeItem('cachedPayments');
      localStorage.removeItem('cachedPendingPayments');
      localStorage.removeItem('cachedAdminMembers');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
