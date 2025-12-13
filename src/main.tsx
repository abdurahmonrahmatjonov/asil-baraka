import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import "./i18n/i18n.ts";
import { ModalProvider } from "./context/RequestModalContext.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
