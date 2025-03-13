import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MapContextProvider from "./components/MapContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MapContextProvider>
      <App />
    </MapContextProvider>
  </StrictMode>
);
