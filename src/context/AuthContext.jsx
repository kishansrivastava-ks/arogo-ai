/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data using React Query
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const { data } = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Login function
  const login = async (token) => {
    localStorage.setItem("token", token);
    await refetch(); // Re-fetch user data immediately
    navigate(
      user?.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"
    );
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    queryClient.invalidateQueries(["user"]); // Clear cache
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth state
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
