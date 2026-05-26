import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import SolutionsPage from "./pages/NexoraAISolutionsPage.tsx";
import "./index.css";
import NexoraAIAboutPage from "./pages/NexoraAIAboutPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/about" element={<NexoraAIAboutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);