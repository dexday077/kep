"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Yükleniyor...");

  const setLoading = (loading: boolean, message: string = "Yükleniyor...") => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  const startLoading = (message: string = "Yükleniyor...") => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage("Yükleniyor...");
  };

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        loadingMessage, 
        setLoading, 
        startLoading, 
        stopLoading 
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
