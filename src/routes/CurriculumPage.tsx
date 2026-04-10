import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  type CurriculumStageKey,
  CURRICULUM_STAGE_DEFAULT,
  CURRICULUM_STAGE_FULL,
} from "../constants";
import ip1 from "../assets/img/IP-1.png";
import ip2 from "../assets/img/IP-2.png";
import ip3 from "../assets/img/IP-3.png";
import ai1 from "../assets/img/AI-1.png";
import ai2 from "../assets/img/AI-2.png";
import da1 from "../assets/img/DA-1.png";
import da2 from "../assets/img/DA-2.png";
import eg1 from "../assets/img/EG-1.png";
import eg2 from "../assets/img/EG-2.png";
import { HiChevronDown } from "react-icons/hi";

function CurriculumPage() {
  const { stage } = useParams<{ stage: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = (stage as CurriculumStageKey) || CURRICULUM_STAGE_DEFAULT;
  const [imageDialog, setImageDialog] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [progLangExpanded, setProgLangExpanded] = useState<
    Record<string, boolean>
  >({});

  const toggleProgLang = (key: string) => {
    setProgLangExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const goToSection = (sectionId: string) => {
    const basePath = `/curriculum/${activeTab}`;
    navigate(`${basePath}#${sectionId}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Handle hash-based scrolling
  useEffect(() => {
    const raw = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.hash;
    const hash = raw ? decodeURIComponent(raw) : "";
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = window.innerWidth >= 768 ? 215 : 200;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash, activeTab]);

  const heroTitle =
    activeTab in CURRICULUM_STAGE_FULL
      ? CURRICULUM_STAGE_FULL[activeTab as CurriculumStageKey]
      : CURRICULUM_STAGE_FULL[CURRICULUM_STAGE_DEFAULT];
  const heroSubtitle: string | null =
    activeTab === "비기너"
      ? "학생의 적성과 흥미 분야를 찾아드립니다"
      : activeTab === "주니어"
        ? "학생의 최종 목표에 맞는 기초를 탄탄하게"
        : activeTab === "특강"
          ? null
          : "전문성 있는 활동으로 입시 경쟁력 확보";

  return (
    <div className="min-h-screen bg-white pt-[200px] md:pt-[215px]">
      {/* Image Dialog */}
      {imageDialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="이미지 미리보기"
          onClick={() => setImageDialog(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageDialog.src}
              alt={imageDialog.alt}
              className="max-h-[80vh] w-full object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* Hero Section — 개요(/curriculum) 페이지와 동일한 스타일 */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 relative z-0">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            {heroTitle}
          </h1>
          {heroSubtitle != null && (
            <p className="text-sm md:text-xl text-slate-300 mb-3 md:mb-4 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* 비기너 클래스 */}
          {activeTab === "비기너" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  커리큘럼 목록
                </h2>
                <div className="mt-3 space-y-2 text-sm md:text-base text-slate-700 leading-relaxed">
                  <p>
                    컴퓨터 과학이 다루는 영역은 넓으며 각 영역이 요구하는 역량이
                    다릅니다. 일로 SW 입시 연구소에서는 처음부터 한 분야를
                    고정하지 않고, 단기간에 학생이 여러 분야를 직접 경험하게
                    하여 자신에게 맞는 방향을 찾아 올바른 커리큘럼을 제안합니다.
                  </p>
                </div>

                {/* 인덱스(목차) 칩 */}
                <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => goToSection("cse이해")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    CSE 이해
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("적성탐구")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    적성 탐구
                  </button>
                </div>
              </div>

              {/* 체험: CSE의 이해 */}
              <div id="cse이해" className="mb-12 scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    체험: CSE(Computer Science Engineering)의 이해
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      개발을 시작하기 전, 전체적인 개발 흐름과 필수 도구를
                      이해하는 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Agent 개발 도구 사용법
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            AI 기반 코딩 도구(Vibe Coding)를 활용하여 간단한
                            프로그램 구현
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Git & GitHub 사용법
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            버전 관리 개념을 이해하고 코드 저장 및 협업 흐름
                            경험
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 적성 탐구 */}
              <div id="적성탐구" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    적성 탐구: AI 기반 코딩 도구(Vibe Coding) 실습
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-4">
                    <p className="text-sm md:text-base text-slate-700">
                      AI 개발도구를 활용하여 다양한 개발 분야를 직접 체험하여
                      적성과 흥미를 탐색하는 과정
                    </p>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 mb-6">
                    ※ 학습 항목 중 일부를 선택하여 진행
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            서버
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            간단한 API 또는 데이터 처리 로직 구현 체험을 통한
                            개발 프로세스의 이해
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            엔진(게임 개발)
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            게임 엔진을 활용한 기초 게임 제작을 통한 기하적
                            지식의 활용
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            데이터(AI)
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            데이터 처리 및 간단한 AI 모델 활용 체험을 통한
                            분석적 사고 함양
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            컴퓨터 비전(AI)
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            이미지 처리 및 OpenCV 기반 실습을 통한 영상 인식
                            기술 이해
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            웹 퍼블리싱
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            HTML/CSS 기반 화면 구성 및 UI 구현을 통한 디자인
                            창의력 함양
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 주니어 클래스 */}
          {activeTab === "주니어" && (
            <div className="animate-fade-in space-y-12">
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  커리큘럼 목록
                </h2>
                <div className="mt-3 space-y-2 text-sm md:text-base text-slate-700 leading-relaxed">
                  <p>방향이 잡혔다면 그에 맞는 기초 역량을 쌓습니다.</p>
                </div>

                {/* 인덱스(목차) 칩 */}
                <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => goToSection("프로그래밍언어")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    프로그래밍 언어
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("자료구조알고리즘")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    자료구조·알고리즘
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("비즈니스")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    비즈니스
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("디자인도구")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    디자인 도구
                  </button>
                </div>
              </div>

              {/* 프로그래밍 언어 커리큘럼 */}
              <div id="프로그래밍언어" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    프로그래밍 언어 커리큘럼
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      선택한 분야에 맞춰 프로그래밍 언어의 기초부터 심화까지
                      학습하는 과정
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* C */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <button
                        type="button"
                        aria-expanded={!!progLangExpanded.c}
                        onClick={() => toggleProgLang("c")}
                        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <h4 className="text-base md:text-lg font-bold text-slate-900">
                            C
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            게임 프로그래밍, 임베디드 시스템
                          </span>
                        </div>
                        <HiChevronDown
                          className={`mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${progLangExpanded.c ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {progLangExpanded.c && (
                        <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                          <p className="mb-4 text-sm md:text-base text-slate-700">
                            메모리 구조 및 저수준 프로그래밍 기초 이해
                            <span className="ml-1 whitespace-nowrap text-xs text-blue-600">
                              * 저수준 = 고난이도
                            </span>
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 단계
                                  </th>
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 내용
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    기초
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    표준 입출력, 변수와 자료형, 조건문, 반복문,
                                    배열과 문자열, 함수
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    고급
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    포인터, 구조체, 재귀 함수, 동적 메모리 할당,
                                    파일 입출력
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Python */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <button
                        type="button"
                        aria-expanded={!!progLangExpanded.python}
                        onClick={() => toggleProgLang("python")}
                        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <h4 className="text-base md:text-lg font-bold text-slate-900">
                            Python
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            AI/데이터 분석
                          </span>
                        </div>
                        <HiChevronDown
                          className={`mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${progLangExpanded.python ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {progLangExpanded.python && (
                        <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                          <p className="text-sm md:text-base text-slate-700 mb-4">
                            빠른 구현 및 데이터/AI 활용 중심 학습
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 단계
                                  </th>
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 내용
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    기초
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    변수, 자료형, 조건문, 반복문,
                                    리스트/딕셔너리, 함수
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    고급
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    클래스(OOP), 모듈 활용, 파일 처리, 데이터
                                    분석 기초 라이브러리(numpy, pandas,
                                    matplotlib.pyplot)
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Java */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <button
                        type="button"
                        aria-expanded={!!progLangExpanded.java}
                        onClick={() => toggleProgLang("java")}
                        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <h4 className="text-base md:text-lg font-bold text-slate-900">
                            Java
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            백엔드 서버 개발
                          </span>
                        </div>
                        <HiChevronDown
                          className={`mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${progLangExpanded.java ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {progLangExpanded.java && (
                        <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                          <p className="text-sm md:text-base text-slate-700 mb-4">
                            객체지향 설계 및 안정적인 구조 학습
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 단계
                                  </th>
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 내용
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    기초
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    변수, 조건문, 반복문, 배열, 클래스, 메서드
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    고급
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    상속, 인터페이스, 컬렉션, 예외 처리, 파일
                                    입출력
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* JavaScript */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <button
                        type="button"
                        aria-expanded={!!progLangExpanded.javascript}
                        onClick={() => toggleProgLang("javascript")}
                        className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <h4 className="text-base md:text-lg font-bold text-slate-900">
                            JavaScript
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            웹 개발
                          </span>
                        </div>
                        <HiChevronDown
                          className={`mt-0.5 h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${progLangExpanded.javascript ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {progLangExpanded.javascript && (
                        <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                          <p className="text-sm md:text-base text-slate-700 mb-4">
                            웹 기반 인터랙션 및 프론트엔드 기초
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 단계
                                  </th>
                                  <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold">
                                    학습 내용
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    기초
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    변수, 조건문, 반복문, 함수
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-4 py-2 text-sm font-medium">
                                    고급
                                  </td>
                                  <td className="border border-slate-200 px-4 py-2 text-sm">
                                    이벤트 처리, 비동기 처리(Promise,
                                    async/await), API 활용
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 자료구조 / 알고리즘 */}
              <div id="자료구조알고리즘" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    프로그래밍 심화: 자료구조 / 알고리즘
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      문제 해결 능력과 효율적인 데이터 처리 능력을 강화하는 CSE
                      핵심 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Stack
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            LIFO 구조 이해 및 활용
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Queue
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            FIFO 구조 및 처리 흐름 이해
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Tree
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            계층 구조 데이터 표현 및 탐색
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            Graph
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            복잡한 관계 표현 및 탐색 알고리즘
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            알고리즘 기초
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            문제 해결을 위한 논리적 접근 방식 학습 및 코딩
                            테스트 대비
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 비즈니스 */}
              <div id="비즈니스" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    IT 계열 관련: 비즈니스
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      개발 결과물 & 기획을 실제 문서와 발표 형태로 정리하고
                      전달하는 능력 강화 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            docs
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            문서 작성 및 기획서 구성 능력 강화
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            ppt
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            발표 자료 제작 및 전달력 향상
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            markup language
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            Markdown 등 문서 구조화 능력 학습
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            협업 도구
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            Notion, Git 등 협업 환경 활용 능력
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 디자인 도구 - 퍼블리싱 */}
              <div id="디자인도구" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    디자인 도구 - 퍼블리싱
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      사용자 경험을 고려한 UI 설계 및 웹 화면 구현 능력을
                      학습하는 과정
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-base md:text-lg font-bold text-slate-900">
                          메인 도구
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          Figma
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-slate-700">
                        UI 설계 및 프로토타이핑(화면 흐름, 컴포넌트 설계,
                        와이어프레임/프로토타입 제작)
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-base md:text-lg font-bold text-slate-900">
                          개념
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          UI/UX
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-slate-700">
                        사용자 경험 기반 설계 이해(정보 구조, 사용자 플로우,
                        사용성 관점)
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h4 className="text-base md:text-lg font-bold text-slate-900">
                          부가 요소
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["CSS", "Tailwind"].map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-slate-700">
                        <li>CSS: 스타일링 기초 및 레이아웃 구성</li>
                        <li>Tailwind: 유틸리티 기반 CSS로 빠른 UI 구현</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 시니어 클래스 */}
          {activeTab === "시니어" && (
            <div className="animate-fade-in space-y-12">
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  커리큘럼 목록
                </h2>
                <div className="mt-3 space-y-2 text-sm md:text-base text-slate-700 leading-relaxed">
                  <p>
                    기술 역량을 쌓은 학생의 진로와 입시 방향에 맞춘 전문성 있는
                    프로젝트 활동을 시작합니다
                  </p>
                </div>

                {/* 인덱스(목차) 칩 */}
                <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => goToSection("생기부프로젝트")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    생기부 프로젝트
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("공모전")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    공모전
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("특성화고특기자대비")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    특성화고 대비
                  </button>
                </div>

                {/* 숙련 과정 지도 기술 스택 */}
                <div id="기술스택" className="scroll-mt-[220px]">
                  <div className="py-8">
                    <h3 className="text-lg md:text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                      시니어 과정 지도 분야
                    </h3>
                    <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                      <p className="text-sm md:text-base text-slate-700 mb-2">
                        시니어 클래스는 다음과 같은 컴퓨터 공학 분야들이
                        포함되어 있습니다.
                      </p>
                      <p className="text-sm md:text-base text-slate-700">
                        ※ 학생 진로에 맞춰 선별적으로 지도합니다. 모든 내용은 중
                        / 고등학생 수준에 맞춰 단순화된 형태로 진행됩니다.
                      </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {/* 영상처리 */}
                      <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                        <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                          <span>📷</span>
                          <span className="flex-1">
                            영상처리 (Image Processing, Computer Vision)
                          </span>
                          <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                            펼치기
                          </span>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm md:text-base text-slate-700">
                            OpenCV를 활용하여 이미지 데이터를 처리하고, 기초적인
                            영상 인식 기술까지 확장하는 과정
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    지도 범위
                                  </th>
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    설명
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    이미지 처리 기초
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    이미지 로드, 색상 변환, 필터 적용 등 기본
                                    처리
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    특징 추출
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    에지 검출, 코너 검출 등 이미지 특징 분석
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    특징점 매칭
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    SIFT 기반 특징점 추출 및 매칭
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    응용 프로젝트
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    이미지 인식, 간단한 객체 추적 프로그램 구현
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2.5">
                            <div className="flex flex-wrap items-start gap-2 text-sm font-medium leading-relaxed text-slate-800">
                              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                결과 예시
                              </span>
                              <span className="text-slate-700">
                                이미지 보정, 영상에서 특징점 검출
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {[ip1, ip2, ip3].map((src, idx) => (
                                <div
                                  key={src}
                                  className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-zoom-in"
                                >
                                  <img
                                    src={src}
                                    alt={`영상처리 결과 예시 이미지 ${idx + 1}`}
                                    className="h-24 w-full object-cover md:h-28"
                                    loading="lazy"
                                    onClick={() =>
                                      setImageDialog({
                                        src,
                                        alt: `영상처리 결과 예시 이미지 ${idx + 1}`,
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>

                      {/* AI */}
                      <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                        <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                          <span>🤖</span>
                          <span className="flex-1">
                            인공지능 (Vision AI, NLP)
                          </span>
                          <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                            펼치기
                          </span>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm md:text-base text-slate-700">
                            최신 AI 기술을 이해하고, 이미지 및 텍스트 데이터를
                            다루는 모델을 직접 구현하는 과정
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    지도 범위
                                  </th>
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    설명
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    AI 기초 이해
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    인공지능 개념 및 최신 트렌드 이해
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    Vision AI
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    이미지 분류, 객체 탐지, 생성 모델 개념 이해
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    NLP 기초
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    자연어 처리 개념 및 활용 이해
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    모델 실습 (Vision)
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    CNN, YOLO 기반 이미지 처리 모델 실습
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    모델 실습 (NLP)
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    BERT 기반 텍스트 처리 모델 실습
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    프로젝트
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    데이터 기반 AI 모델 구현 및 결과 분석
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2.5">
                            <div className="flex flex-wrap items-start gap-2 text-sm font-medium leading-relaxed text-slate-800">
                              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                결과 예시
                              </span>
                              <span className="text-slate-700">
                                이미지 인식 프로그램, 문장 분석/생성 기능 구현
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {[ai1, ai2].map((src, idx) => (
                                <div
                                  key={src}
                                  className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-zoom-in"
                                >
                                  <img
                                    src={src}
                                    alt={`AI 결과 예시 이미지 ${idx + 1}`}
                                    className="h-28 w-full object-cover md:h-32"
                                    loading="lazy"
                                    onClick={() =>
                                      setImageDialog({
                                        src,
                                        alt: `AI 결과 예시 이미지 ${idx + 1}`,
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>

                      {/* 웹/앱 */}
                      <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                        <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                          <span>🌐</span>
                          <span className="flex-1">웹 / 앱</span>
                          <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                            펼치기
                          </span>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm md:text-base text-slate-700">
                            프론트엔드부터 서버, 데이터베이스까지 전체 서비스
                            구조를 구현하는 과정
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    지도 범위
                                  </th>
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    설명
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    프론트엔드
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    React 기반 UI 구현 (필요 시 기본 HTML/CSS/JS
                                    포함)
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    백엔드
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    Node.js / Flask 기반 서버 개발
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    데이터베이스
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    MariaDB를 활용한 데이터 저장 및 관리
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    API 연동
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    클라이언트-서버 데이터 통신 구현
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    프로젝트
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    웹 서비스 또는 간단한 앱 개발
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-3 flex flex-wrap items-start gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800">
                            <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              결과 예시
                            </span>
                            <span className="text-slate-700">
                              로그인 기능 웹사이트, 게시판, 간단한 웹 서비스
                            </span>
                          </p>
                        </div>
                      </details>

                      {/* 데이터 분석 */}
                      <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                        <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                          <span>📊</span>
                          <span className="flex-1">데이터 분석</span>
                          <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                            펼치기
                          </span>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm md:text-base text-slate-700">
                            실제 데이터를 기반으로 분석 및 예측 모델을 만드는
                            과정
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    지도 범위
                                  </th>
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    설명
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    데이터 수집
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    공공 데이터 및 Kaggle 데이터 활용
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    데이터 전처리
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    결측치 처리 및 데이터 정리
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    기초 분석
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    데이터 시각화 및 통계 분석
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    모델 학습
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    선형 회귀, 랜덤 포레스트 등 기초 모델
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    결과 해석
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    분석 결과 도출 및 의미 해석
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2.5">
                            <div className="flex flex-wrap items-start gap-2 text-sm font-medium leading-relaxed text-slate-800">
                              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                결과 예시
                              </span>
                              <span className="text-slate-700">
                                데이터 기반 예측 프로그램, 분석 보고서 작성
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {[da1, da2].map((src, idx) => (
                                <div
                                  key={src}
                                  className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-zoom-in"
                                >
                                  <img
                                    src={src}
                                    alt={`데이터 분석 결과 예시 이미지 ${idx + 1}`}
                                    className="h-28 w-full object-cover md:h-32"
                                    loading="lazy"
                                    onClick={() =>
                                      setImageDialog({
                                        src,
                                        alt: `데이터 분석 결과 예시 이미지 ${idx + 1}`,
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>

                      {/* Unity 엔진 */}
                      <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                        <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                          <span>🎮</span>
                          <span className="flex-1">물리 엔진 (Unity)</span>
                          <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                            펼치기
                          </span>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm md:text-base text-slate-700">
                            수학적 지식을 활용하여 Unity 엔진을 통해 2D/3D
                            게임을 설계하고 구현하는 과정
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    지도 범위
                                  </th>
                                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    설명
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    Unity 기초
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    inspector를 활용한 Object 컨트롤
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    C# 스크립트
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    게임 로직 구현
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    물리 시스템
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    충돌, 이동, 중력 처리
                                  </td>
                                </tr>
                                <tr className="bg-slate-50">
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    UI 구성
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    게임 인터페이스 설계
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-slate-200 px-3 py-2 font-medium">
                                    프로젝트
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2">
                                    2D 또는 3D 게임 제작
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2.5">
                            <div className="flex flex-wrap items-start gap-2 text-sm font-medium leading-relaxed text-slate-800">
                              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                결과 예시
                              </span>
                              <span className="text-slate-700">
                                점프 게임, 퍼즐 게임, 3D 캐릭터 게임 제작
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {[eg1, eg2].map((src, idx) => (
                                <div
                                  key={src}
                                  className="overflow-hidden rounded-lg border border-slate-200 bg-white cursor-zoom-in"
                                >
                                  <img
                                    src={src}
                                    alt={`게임 개발 결과 예시 이미지 ${idx + 1}`}
                                    className="h-28 w-full object-cover md:h-32"
                                    loading="lazy"
                                    onClick={() =>
                                      setImageDialog({
                                        src,
                                        alt: `게임 개발 결과 예시 이미지 ${idx + 1}`,
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>

              {/* 생기부 프로젝트 */}
              <div id="생기부프로젝트" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">
                      생기부 프로젝트
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["세특 융합", "자율", "전공", "동아리"].map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs md:text-sm font-semibold text-slate-700"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      학교 생활기록부와 연계된 실전 프로젝트를 설계하고 완성하는
                      과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            프로젝트 설계
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            전공 및 진로 기반 주제 선정
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            프로젝트 진행
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            활동과 연결된 프로그램 개발
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            결과물 제작
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            보고서 및 산출물 완성
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            기록 관리
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            학교의 수정 요구 사항 반영
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-slate-500 mt-4">
                    ※ 프로젝트 완성 이후 제출 및 최종 활용 과정은 학생 주도로
                    진행됩니다
                  </p>
                </div>
              </div>

              {/* 공모전 */}
              <div id="공모전" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    공모전
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      외부 대회를 통해 실전 경험과 결과물을 확보하는 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            주제 선정
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            공모전 요구사항 분석
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            (개인이 아닐 경우) 팀 구성
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            역할 분담 및 협업
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            개발 및 제작
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            결과물 완성
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            제출 및 발표
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            공모전 형식에 따른 모의 발표
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 특성화고 특기자 대비 */}
              <div id="특성화고특기자대비" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    특성화고 특기자 대비
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      특성화고 및 관련 전형 합격을 위한 전략적 준비 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            목표 학교 선정 및 전략 수립
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            지원 가능 학교 분석 및 전형별 맞춤 준비 전략 설계
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            관련 이론 강의 및 프로젝트 진행
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            전공 관련 이론 학습과 이를 기반으로 한 프로젝트 수행
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            면접 대비
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            예상 질문 정리 및 답변 구조화, 모의 면접 진행
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* (중복) 숙련 과정 지도 기술 스택 - 상단 섹션 사용 */}
              <div id="기술스택_legacy" className="hidden scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    시니어 과정 지도 분야
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700 mb-2">
                      시니어 클래스는 다음과 같은 컴퓨터 공학 분야들이 포함되어
                      있습니다.
                    </p>
                    <p className="text-sm md:text-base text-slate-700">
                      ※ 학생 진로에 맞춰 선별적으로 지도합니다. 모든 내용은
                      중/고등학생 수준에 맞춰 단순화된 형태로 진행됩니다.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* 영상처리 */}
                    <details className="bg-white rounded-lg border border-slate-200 p-6">
                      <summary className="text-lg font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span>📷</span>
                        영상처리 (OpenCV)
                      </summary>
                      <div className="mt-4 space-y-3">
                        <p className="text-sm md:text-base text-slate-700">
                          OpenCV를 활용하여 이미지 데이터를 처리하고, 기초적인
                          영상 인식 기술까지 확장하는 과정
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  지도 범위
                                </th>
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  설명
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  이미지 처리 기초
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  이미지 로드, 색상 변환, 필터 적용 등 기본 처리
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  특징 추출
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  에지 검출, 코너 검출 등 이미지 특징 분석
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  특징점 매칭
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  SIFT 기반 특징점 추출 및 매칭
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  응용 프로젝트
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  이미지 인식, 간단한 객체 추적 프로그램 구현
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
                          결과 예시: 사진에서 특정 물체 찾기, 영상에서 움직임
                          감지 프로그램 제작
                        </p>
                      </div>
                    </details>

                    {/* AI */}
                    <details className="bg-white rounded-lg border border-slate-200 p-6">
                      <summary className="text-lg font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span>🤖</span>
                        AI (Vision AI, NLP)
                      </summary>
                      <div className="mt-4 space-y-3">
                        <p className="text-sm md:text-base text-slate-700">
                          최신 AI 기술을 이해하고, 이미지 및 텍스트 데이터를
                          다루는 모델을 직접 구현하는 과정
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  지도 범위
                                </th>
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  설명
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  AI 기초 이해
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  인공지능 개념 및 최신 트렌드 이해
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  Vision AI
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  이미지 분류, 객체 탐지, 생성 모델 개념 이해
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  NLP 기초
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  자연어 처리 개념 및 활용 이해
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  모델 실습 (Vision)
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  CNN, YOLO 기반 이미지 처리 모델 실습
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  모델 실습 (NLP)
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  BERT 기반 텍스트 처리 모델 실습
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  프로젝트
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  데이터 기반 AI 모델 구현 및 결과 분석
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
                          결과 예시: 이미지 인식 프로그램, 문장 분석/생성 기능
                          구현
                        </p>
                      </div>
                    </details>

                    {/* 웹/앱 */}
                    <details className="bg-white rounded-lg border border-slate-200 p-6">
                      <summary className="text-lg font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span>🌐</span>웹 / 앱
                      </summary>
                      <div className="mt-4 space-y-3">
                        <p className="text-sm md:text-base text-slate-700">
                          프론트엔드부터 서버, 데이터베이스까지 전체 서비스
                          구조를 구현하는 과정
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  지도 범위
                                </th>
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  설명
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  프론트엔드
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  React 기반 UI 구현 (필요 시 기본 HTML/CSS/JS
                                  포함)
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  백엔드
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  Node.js / Flask 기반 서버 개발
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  데이터베이스
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  MariaDB를 활용한 데이터 저장 및 관리
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  API 연동
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  클라이언트-서버 데이터 통신 구현
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  프로젝트
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  웹 서비스 또는 간단한 앱 개발
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
                          결과 예시: 로그인 기능 웹사이트, 게시판, 간단한 웹
                          서비스
                        </p>
                      </div>
                    </details>

                    {/* 데이터 분석 */}
                    <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                      <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span>📊</span>
                        <span className="flex-1">데이터 분석</span>
                        <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                          펼치기
                        </span>
                        <span className="text-slate-400 transition-transform group-open:rotate-180">
                          ▾
                        </span>
                      </summary>
                      <div className="mt-3 space-y-3">
                        <p className="text-sm md:text-base text-slate-700">
                          실제 데이터를 기반으로 분석 및 예측 모델을 만드는 과정
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  지도 범위
                                </th>
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  설명
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  데이터 수집
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  공공 데이터 및 Kaggle 데이터 활용
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  데이터 전처리
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  결측치 처리 및 데이터 정리
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  기초 분석
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  데이터 시각화 및 통계 분석
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  모델 학습
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  선형 회귀, 랜덤 포레스트 등 기초 모델
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  결과 해석
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  분석 결과 도출 및 의미 해석
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
                          결과 예시: 데이터 기반 예측 프로그램, 분석 보고서 작성
                        </p>
                      </div>
                    </details>

                    {/* Unity 엔진 */}
                    <details className="group bg-white rounded-lg border border-slate-200 p-3 md:p-4 hover:border-slate-300 hover:bg-slate-50/30 transition-colors">
                      <summary className="text-sm md:text-base font-bold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span>🎮</span>
                        <span className="flex-1">Unity 엔진 (게임 개발)</span>
                        <span className="text-[11px] md:text-xs font-medium text-slate-500 group-open:hidden">
                          펼치기
                        </span>
                        <span className="text-slate-400 transition-transform group-open:rotate-180">
                          ▾
                        </span>
                      </summary>
                      <div className="mt-3 space-y-3">
                        <p className="text-sm md:text-base text-slate-700">
                          수학적 지식을 활용하여 Unity 엔진을 통해 2D/3D 게임을
                          설계하고 구현하는 과정
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  지도 범위
                                </th>
                                <th className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                  설명
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  Unity 기초
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  inspector를 활용한 Object 컨트롤
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  C# 스크립트
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  게임 로직 구현
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  물리 시스템
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  충돌, 이동, 중력 처리
                                </td>
                              </tr>
                              <tr className="bg-slate-50">
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  UI 구성
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  게임 인터페이스 설계
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-slate-200 px-3 py-2 font-medium">
                                  프로젝트
                                </td>
                                <td className="border border-slate-200 px-3 py-2">
                                  2D 또는 3D 게임 제작
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2.5 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
                          결과 예시: 점프 게임, 퍼즐 게임, 3D 캐릭터 게임 제작
                        </p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 특강 */}
          {activeTab === "특강" && (
            <div className="animate-fade-in space-y-12">
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  커리큘럼 목록
                </h2>

                {/* 인덱스(목차) 칩 */}
                <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => goToSection("논문분석")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    논문·이슈 분석
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("해커톤")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    해커톤
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSection("컨설팅")}
                    className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    컨설팅
                  </button>
                </div>
              </div>

              {/* 최신 논문 / 이슈 분석 */}
              <div id="논문분석" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    최신 논문 / 이슈 분석
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      최신 기술 트렌드를 이해하고 심화 학습으로 연결하여
                      프로젝트 아이디어 도출
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-purple-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            논문/뉴스 선정
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            최신 기술 트렌드 기반 선택
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            내용 분석
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            핵심 아이디어 및 구조 파악
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            요약 정리
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            발표 및 문서화
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 자체 해커톤 */}
              <div id="해커톤" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    자체 해커톤
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      제한된 시간 내 문제 해결 및 협업 능력을 강화하는 집중
                      프로젝트
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-purple-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            문제 정의
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            주제 기반 문제 설정
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            아이디어 도출
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            팀 단위 기획
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            구현
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            제한 시간 내 개발
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            발표
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            결과 공유 및 피드백
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 생기부 컨설팅 */}
              <div id="컨설팅" className="scroll-mt-[220px]">
                <div className="py-8 border-t border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                    생기부 컨설팅
                  </h3>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6">
                    <p className="text-sm md:text-base text-slate-700">
                      학생 활동을 입시 전략에 맞게 정리하고 최적화하는 과정
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-purple-50">
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            학습 항목
                          </th>
                          <th className="border border-slate-200 px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-900">
                            설명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            활동 점검
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            현재 활동 상태 분석
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            방향 설계
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            진로 기반 전략 수립
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700 font-medium">
                            문장 첨삭
                          </td>
                          <td className="border border-slate-200 px-4 py-3 text-sm md:text-base text-slate-700">
                            생기부 문장 개선
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CurriculumPage;
