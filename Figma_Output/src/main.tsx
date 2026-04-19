
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Prevent browser from restoring scroll position on navigation
history.scrollRestoration = 'manual';

createRoot(document.getElementById("root")!).render(<App />);
