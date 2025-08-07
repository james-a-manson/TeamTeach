import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, CandidateResponse, LecturerResponse } from "../services/api";
import { useToast } from "@chakra-ui/react";

interface AuthContextType {
  user: CandidateResponse | LecturerResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: "candidate" | "lecturer";
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CandidateResponse | LecturerResponse | null>(
    null
  );

  const toast = useToast();

  useEffect(() => {
    // Check for an existing user in local storage on re-render
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting to log in with email:", email);
      const response = await authAPI.login({ email, password });
      const userData = response.user;
      console.log("Login successful, user data:", userData);
      if (userData.role === "candidate") {
        if (userData.isBlocked) {
          toast({
            title: "Login failed",
            description: "Your account is blocked.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return false;
        }
      }
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: "candidate" | "lecturer";
  }): Promise<boolean> => {
    try {
      let response;
      let newUser;

      if (userData.role === "candidate") {
        response = await authAPI.registerCandidate(userData);
        newUser = response.candidate;
      } else {
        response = await authAPI.registerLecturer(userData);
        newUser = response.lecturer;
      }

      newUser.role = userData.role;

      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setUser(newUser);

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
