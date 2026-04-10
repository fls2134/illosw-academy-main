import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { HiLocationMarker } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { SiNaver } from "react-icons/si";
import logo from "../assets/img/logo.svg";
import {
  COMPANY_NAME,
  BLOG_URL,
  NAVER_MAP_LINK,
  KAKAO_TALK_LINK,
  PHONE_NUMBER,
  CURRICULUM_STAGE_FULL,
  CURRICULUM_STAGE_SHORT,
} from "../constants";

const navItems = [
  { id: "", label: "홈", type: "page" as const },
  { id: "about", label: "학원 소개", type: "page" as const },
  { id: "location", label: "위치", type: "page" as const },
  { id: "curriculum", label: "커리큘럼", type: "page" as const },
  { id: "apply", label: "시간표", type: "page" as const },
  { id: "inquiry", label: "상담 문의", type: "page" as const },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileExpandedNav, setMobileExpandedNav] = useState<string | null>(null);
  const [isFloatingMinimized, setIsFloatingMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isMainPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, type: "anchor" | "page" = "anchor") => {
    if (type === "page") {
      navigate(`/${sectionId}`);
      setIsMobileMenuOpen(false);
      return;
    }

    if (!isMainPage) {
      navigate(`/#${sectionId}`);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 120;
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
    navigate("/");
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* 상단 바 - 버튼들 */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* 왼쪽: 네이버 블로그 + 카카오톡 + 전화 버튼 (데스크탑만) */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#28c762] text-white text-xs font-medium rounded hover:bg-[#20a550] transition-colors"
              >
                <SiNaver className="w-4 h-4" />
                <span>블로그</span>
              </a>
              <a
                href={KAKAO_TALK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE500] text-slate-900 text-xs font-medium rounded hover:bg-[#F5DC00] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                <span>카카오톡 상담</span>
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:text-slate-900 hover:border-slate-400 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>전화 문의</span>
              </a>
            </div>

            {/* 오른쪽: 위치 확인하기 (모바일/데스크탑 공통) */}
            <div className="flex items-center gap-2 ml-auto">
              <a
                href={NAVER_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:text-slate-900 hover:border-slate-400 transition-colors"
              >
                <HiLocationMarker className="w-4 h-4 text-red-500" />
                <span>위치 확인하기</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 중단 바 - 로고 + 회사명 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={logo}
                alt={`${COMPANY_NAME} 로고`}
                className="w-8 sm:w-9 md:w-10 h-auto"
                style={{
                  filter: "brightness(0) saturate(100%) invert(10%) sepia(10%) saturate(200%) hue-rotate(180deg) brightness(90%) contrast(80%)",
                }}
              />
              <span className="text-2xl md:text-3xl font-bold text-slate-900">
                {COMPANY_NAME}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div 
        className="bg-slate-700 relative"
        onMouseLeave={() => setHoveredNav(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between md:justify-center h-12">
            {/* 모바일: 왼쪽 - 햄버거 버튼 */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-slate-600 rounded transition-colors"
                aria-label="메뉴"
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-5 h-5" />
                ) : (
                  <HiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* 모바일: 오른쪽 - 연락 버튼들 */}
            <div className="flex md:hidden items-center gap-1.5">
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 bg-[#28c762] text-white text-xs font-medium rounded hover:bg-[#20a550] transition-colors"
              >
                <SiNaver className="w-3.5 h-3.5" />
              </a>
              <a
                href={KAKAO_TALK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 bg-[#FEE500] text-slate-900 text-xs font-medium rounded hover:bg-[#F5DC00] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-1 px-2 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:text-slate-900 hover:border-slate-400 transition-colors"
              >
                <FiPhone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 데스크탑 네비게이션 */}
            <div className="hidden md:flex items-center gap-1 mx-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.type)}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors min-w-[88px] text-center ${
                    location.pathname === `/${item.id}`
                      ? "text-orange-400"
                      : "text-white hover:text-slate-300"
                  }`}
                  aria-label={`${item.label} 섹션으로 이동`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-width 드롭다운 패널 (커리큘럼만) */}
          {hoveredNav === "curriculum" && (
            <div className="absolute left-0 right-0 top-full bg-white shadow-lg border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-center gap-1">
                  {navItems.map((item) => (
                    <div key={item.id} className="min-w-[88px]">
                      {item.id === "curriculum" && (
                        <div className="text-left">
                          <div className="text-sm font-semibold text-slate-900 mb-3">커리큘럼</div>
                          <div className="space-y-3">
                            <a href="/curriculum" className="block text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                              개요
                            </a>
                            <a href="/curriculum/비기너" className="block text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                              {CURRICULUM_STAGE_FULL.비기너}
                            </a>
                            <a href="/curriculum/주니어" className="block text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                              {CURRICULUM_STAGE_FULL.주니어}
                            </a>
                            <a href="/curriculum/시니어" className="block text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                              {CURRICULUM_STAGE_FULL.시니어}
                            </a>
                            <a href="/curriculum/특강" className="block text-sm font-medium text-slate-600 hover:text-green-600 transition-colors">
                              {CURRICULUM_STAGE_FULL.특강}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-600">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.id === "curriculum") {
                          setMobileExpandedNav(mobileExpandedNav === "curriculum" ? null : "curriculum");
                        } else {
                          handleNavClick(item.id, item.type);
                        }
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                        location.pathname === `/${item.id}` || location.pathname.startsWith(`/${item.id}/`)
                          ? "text-orange-400 bg-slate-600"
                          : "text-white hover:bg-slate-600"
                      }`}
                      aria-label={`${item.label} 섹션으로 이동`}
                    >
                      {item.label}
                    </button>
                    
                    {/* 커리큘럼 하위 메뉴 */}
                    {item.id === "curriculum" && mobileExpandedNav === "curriculum" && (
                      <div className="bg-slate-600 py-2">
                        <a
                          href="/curriculum"
                          className="block px-8 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          개요
                        </a>
                        <a
                          href="/curriculum/비기너"
                          className="block px-8 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {CURRICULUM_STAGE_FULL.비기너}
                        </a>
                        <a
                          href="/curriculum/주니어"
                          className="block px-8 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {CURRICULUM_STAGE_FULL.주니어}
                        </a>
                        <a
                          href="/curriculum/시니어"
                          className="block px-8 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {CURRICULUM_STAGE_FULL.시니어}
                        </a>
                        <a
                          href="/curriculum/특강"
                          className="block px-8 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {CURRICULUM_STAGE_FULL.특강}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 커리큘럼 탭 네비게이션 (커리큘럼 페이지에서만 표시, 데스크탑만) */}
      {location.pathname.startsWith("/curriculum") && (
        <div className="hidden md:block bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center">
              <button
                onClick={() => navigate("/curriculum")}
                className={`flex-1 max-w-[140px] px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  location.pathname === "/curriculum"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                개요
              </button>
              <button
                onClick={() => navigate("/curriculum/비기너")}
                className={`flex-1 max-w-[140px] px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  location.pathname === "/curriculum/비기너"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.비기너}
              </button>
              <button
                onClick={() => navigate("/curriculum/주니어")}
                className={`flex-1 max-w-[140px] px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  location.pathname === "/curriculum/주니어"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.주니어}
              </button>
              <button
                onClick={() => navigate("/curriculum/시니어")}
                className={`flex-1 max-w-[140px] px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  location.pathname === "/curriculum/시니어"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.시니어}
              </button>
              <button
                onClick={() => navigate("/curriculum/특강")}
                className={`flex-1 max-w-[140px] px-4 py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  location.pathname === "/curriculum/특강"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.특강}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 커리큘럼 탭 네비게이션 (모바일 전용) */}
      {location.pathname.startsWith("/curriculum") && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-2">
            <div className="flex justify-center items-center">
              <button
                onClick={() => navigate("/curriculum")}
                className={`flex-1 px-2 py-2.5 text-xs font-medium transition-all ${
                  location.pathname === "/curriculum"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                개요
              </button>
              <button
                onClick={() => navigate("/curriculum/비기너")}
                className={`flex-1 px-2 py-2.5 text-xs font-medium transition-all ${
                  location.pathname === "/curriculum/비기너"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.비기너}
              </button>
              <button
                onClick={() => navigate("/curriculum/주니어")}
                className={`flex-1 px-2 py-2.5 text-xs font-medium transition-all ${
                  location.pathname === "/curriculum/주니어"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.주니어}
              </button>
              <button
                onClick={() => navigate("/curriculum/시니어")}
                className={`flex-1 px-2 py-2.5 text-xs font-medium transition-all ${
                  location.pathname === "/curriculum/시니어"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.시니어}
              </button>
              <button
                onClick={() => navigate("/curriculum/특강")}
                className={`flex-1 px-2 py-2.5 text-xs font-medium transition-all ${
                  location.pathname === "/curriculum/특강"
                    ? "text-slate-900 border-b-[3px] border-orange-500 bg-orange-50"
                    : "text-slate-600 border-b-[3px] border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {CURRICULUM_STAGE_SHORT.특강}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating 버튼 영역 (데스크탑 스크롤 시) */}
      {isScrolled && (
        <div className={`hidden md:block fixed top-1/2 -translate-y-1/2 z-50 animate-fade-in transition-all duration-300 ${isFloatingMinimized ? 'right-0' : 'right-6'}`}>
          {isFloatingMinimized ? (
            // 최소화 상태
            <button
              onClick={() => setIsFloatingMinimized(false)}
              className="bg-white rounded-l-lg shadow-xl px-2 py-6 border border-r-0 border-slate-200 hover:bg-slate-50 transition-colors"
              title="펼치기"
            >
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            // 최대화 상태
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-xl p-2 border border-slate-200">
              {/* 최소화 버튼 */}
              <button
                onClick={() => setIsFloatingMinimized(true)}
                className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                title="최소화"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 bg-[#28c762] text-white rounded-md hover:bg-[#20a550] transition-all hover:scale-105"
                title="블로그"
              >
                <SiNaver className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">블로그</span>
              </a>
              <a
                href={KAKAO_TALK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 bg-[#FEE500] text-slate-900 rounded-md hover:bg-[#F5DC00] transition-all hover:scale-105"
                title="카카오톡 상담"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                <span className="text-xs font-medium">상담</span>
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-all hover:scale-105"
                title="전화 문의"
              >
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">전화</span>
              </a>
              <a
                href={NAVER_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-all hover:scale-105"
                title="위치 확인하기"
              >
                <HiLocationMarker className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs font-medium">위치</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;

