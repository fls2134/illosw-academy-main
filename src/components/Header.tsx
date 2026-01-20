import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import logo from "../assets/img/logo.svg";
import { COMPANY_NAME } from "../constants";

const navItems = [
  { id: "hero", label: "홈" },
  { id: "about", label: "학원 소개" },
  { id: "location", label: "위치" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "apply", label: "강의 신청" },
  { id: "inquiry", label: "상담 문의" },
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();
  const location = useLocation();

  // 메인 페이지가 아닐 때는 헤더를 단순하게 표시
  const isMainPage = location.pathname === "/";

  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // 현재 섹션 감지
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainPage]);

  const handleNavClick = (sectionId: string) => {
    if (!isMainPage) {
      navigate(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackClick = () => {
    if (location.pathname === "/form") {
      navigate("/#apply");
    } else {
      navigate("/");
    }
  };

  // 페이지 타이틀 가져오기
  const getPageTitle = () => {
    if (location.pathname === "/form") {
      return "강의 신청";
    }
    return null;
  };

  const pageTitle = getPageTitle();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isMainPage
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            {/* 뒤로가기 버튼 (메인 페이지가 아닐 때만 표시) */}
            {!isMainPage && (
              <button
                onClick={handleBackClick}
                className="flex items-center justify-center w-8 h-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="뒤로가기"
              >
                <IoIosArrowBack className="w-6 h-6" />
              </button>
            )}
            {/* 로고 (메인 페이지일 때만 표시) */}
            {isMainPage && (
              <button
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label="홈으로 이동"
              >
                <img
                  src={logo}
                  alt={`${COMPANY_NAME} 로고`}
                  className="w-6 sm:w-7 h-auto transition-all duration-300"
                  style={{
                    filter: isScrolled 
                      ? "brightness(0) saturate(100%) invert(10%) sepia(10%) saturate(200%) hue-rotate(180deg) brightness(90%) contrast(80%)"
                      : "brightness(0) saturate(100%) invert(100%)",
                  }}
                />
              </button>
            )}
            {/* 페이지 타이틀 (서브 페이지일 때만 표시) */}
            {pageTitle && (
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {pageTitle}
              </h1>
            )}
          </div>

          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  activeSection === item.id && isMainPage
                    ? isScrolled
                      ? "bg-slate-900 text-white"
                      : "bg-white/20 text-white"
                    : isScrolled
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={`${item.label} 섹션으로 이동`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 mt-2">
            <div className="flex flex-col gap-1 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    activeSection === item.id && isMainPage
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  aria-label={`${item.label} 섹션으로 이동`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

