import { Routes, Route } from "react-router-dom";
import MainPage from "./routes/MainPage";
import FormPage from "./routes/FormPage";
import UnderConstruction from "./routes/UnderConstruction";
import "./index.css";

function App() {
  // 공사 중 페이지 표시 여부
  // true: 모든 경로에서 공사 중 페이지 표시
  // false: 정상 라우트 동작
  const isUnderConstruction = true;

  if (isUnderConstruction) {
    return <UnderConstruction />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  );
}

export default App;
