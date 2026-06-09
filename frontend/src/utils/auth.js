export const setAuthData = ({ token, role, email, fullName }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);
  localStorage.setItem("fullName", fullName);
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getEmail = () => localStorage.getItem("email");
export const getFullName = () => localStorage.getItem("fullName");

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("fullName");
};

export const isAuthenticated = () => !!localStorage.getItem("token");