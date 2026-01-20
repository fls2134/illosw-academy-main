import { Routes, Route } from "react-router-dom";
import MainPage from "./routes/MainPage";
import FormPage from "./routes/FormPage";
import UnderConstruction from "./routes/UnderConstruction";
import Header from "./components/Header";
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
    <div className="min-h-screen flex flex-col bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/form"
          element={
            <>
              <Header />
              <FormPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
