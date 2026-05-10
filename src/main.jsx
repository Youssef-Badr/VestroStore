

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { LanguageProvider } from "../src/contexts/LanguageContext";
import { CartProvider } from "../src/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";



createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
</React.StrictMode>
);
