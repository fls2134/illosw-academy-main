import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./routes/MainPage";
import FormPage from "./routes/FormPage";
import CurriculumPage from "./routes/CurriculumPage";
import CurriculumDefaultPage from "./routes/CurriculumDefaultPage";
import AboutPage from "./routes/AboutPage";
import LocationPage from "./routes/LocationPage";
import ApplyPage from "./routes/ApplyPage";
import InquiryPage from "./routes/InquiryPage";
import UnderConstruction from "./routes/UnderConstruction";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PosterOverlay from "./components/PosterOverlay";
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
    <>
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
          path="/about"
          element={
            <>
              <Header />
              <AboutPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/location"
          element={
            <>
              <Header />
              <LocationPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/curriculum"
          element={
            <>
              <Header />
              <CurriculumDefaultPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/curriculum/입문"
          element={<Navigate to="/curriculum/비기너" replace />}
        />
        <Route
          path="/curriculum/학습"
          element={<Navigate to="/curriculum/주니어" replace />}
        />
        <Route
          path="/curriculum/숙련"
          element={<Navigate to="/curriculum/시니어" replace />}
        />
        <Route
          path="/curriculum/:stage"
          element={
            <>
              <Header />
              <CurriculumPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/apply"
          element={
            <>
              <Header />
              <ApplyPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/inquiry"
          element={
            <>
              <Header />
              <InquiryPage />
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
    <PosterOverlay />
    </>
  );
}

export default App;
