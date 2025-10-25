import { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (userData, jwtToken) => {
    console.log("🔐 Logging in with user:", userData);
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/*
  AuthContext.jsx — Manages User Authentication::
  createContext() — creates a “container” for shared auth data.
  useState() — stores token and user.
  localStorage — keeps user info saved even after refreshing.
  Provider — makes login/logout info available to all components.
  Flow:
    When a user logs in:
    The login() function saves the token and user data in both React state and localStorage.
    When the user logs out:
    The logout() function clears both.
    Any component can access this data using:
    const { user, token, login, logout } = useContext(AuthContext);
    This means your entire app always knows who’s logged in and can send authorized API requests using the token.
*/
