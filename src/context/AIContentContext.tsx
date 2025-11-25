// src/context/AIContentContext.tsx

import React, { createContext, useContext, useState } from "react";
import {
  generateContent,
  GenerateContentPayload,
  GenerateContentResponse,
} from "../api/generateContent";

interface AIContentContextType {
  content: string;
  isLoading: boolean;
  error: string | null;
  fetchContent: (payload: GenerateContentPayload) => Promise<void>;
}

const AIContentContext = createContext<AIContentContextType | undefined>(
  undefined
);

export const AIContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (payload: GenerateContentPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: GenerateContentResponse = await generateContent(payload);
      setContent(response.content);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate content";
      setError(errorMessage);
      console.error("Error fetching content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContentContext.Provider value={{ content, isLoading, error, fetchContent }}>
      {children}
    </AIContentContext.Provider>
  );
};

export const useAIContent = () => {
  const context = useContext(AIContentContext);
  if (!context)
    throw new Error("useAIContent must be used within AIContentProvider");
  return context;
};
