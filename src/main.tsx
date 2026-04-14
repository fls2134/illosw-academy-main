import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// GitHub Pages에서 새로고침/직접 진입 시 404.html이 남긴 경로를 복원한다.
if (window.location.search.startsWith("?p=")) {
  const encodedPath = window.location.search.slice(3);
  const decodedPath = decodeURIComponent(encodedPath);
  window.history.replaceState(null, "", decodedPath || "/");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
