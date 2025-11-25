import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AIContentProvider } from "./context/AIContentContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AIContentProvider>
      <App />
    </AIContentProvider>
  </React.StrictMode>
);
