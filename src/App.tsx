import { Routes, Route } from "react-router-dom";
import MainPage from "./routes/MainPage";
import FormPage from "./routes/FormPage";
import UnderConstruction from "./routes/UnderConstruction";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  // 공사 중 페이지 표시 여부
  // true: 모든 경로에서 공사 중 페이지 표시
  // false: 정상 라우트 동작
  const isUnderConstruction = false;

  if (isUnderConstruction) {
    return <UnderConstruction />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/form" element={<FormPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
