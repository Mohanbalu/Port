/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from 'jwt-decode';
import { createContext, useState } from 'react';

export const AuthContext = createContext();

const normalizeRole = (roleValue) => {
  if (!roleValue || typeof roleValue !== 'string') return '';
  return roleValue.replace(/^ROLE_/, '').toUpperCase();
};

const buildUserFromToken = (token) => {
  const decoded = jwtDecode(token);
  const rawRole = decoded.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : decoded.roles);
  return {
    username: decoded.sub,
    role: normalizeRole(rawRole),
    token,
  };
};

const getInitialUser = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('authUser');

  if (token && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      return { ...parsedUser, token };
    } catch {
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
      return null;
    }
  }

  if (token) {
    try {
      return buildUserFromToken(token);
    } catch {
      localStorage.removeItem('token');
    }
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const loading = false;

  const login = (authPayload) => {
    const token = typeof authPayload === 'string' ? authPayload : authPayload?.token;
    if (!token) return;

    localStorage.setItem('token', token);

    let nextUser;
    if (typeof authPayload === 'object' && authPayload?.username) {
      nextUser = {
        username: authPayload.username,
        role: normalizeRole(authPayload.role),
        token,
      };
    } else {
      nextUser = buildUserFromToken(token);
    }

    localStorage.setItem('authUser', JSON.stringify({
      username: nextUser.username,
      role: nextUser.role,
    }));

    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        role: user?.role || '',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
