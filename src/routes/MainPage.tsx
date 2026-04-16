import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { COMPANY_NAME, CURRICULUM_STAGE_FULL } from "../constants";
import { SiNaver } from "react-icons/si";
import il1 from "../assets/img/IL-1.png";
import il2 from "../assets/img/IL-2.png";
import il3 from "../assets/img/IL-3.png";
import il4 from "../assets/img/IL-4.png";
import mascot from "../assets/img/mascot.png";
import bn1 from "../assets/img/BN-1.png";
import bn2 from "../assets/img/BN-2.png";
import bn3 from "../assets/img/BN-3.png";
import bn4 from "../assets/img/BN-4.png";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
}

function MainPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  // 캐로셀 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: bn1,
      link: "/curriculum/비기너",
      alt: `${CURRICULUM_STAGE_FULL.비기너} 소개 배너`,
    },
    {
      image: bn2,
      link: "/curriculum/주니어",
      alt: `${CURRICULUM_STAGE_FULL.주니어} 소개 배너`,
    },
    {
      image: bn3,
      link: "/curriculum/시니어",
      alt: `${CURRICULUM_STAGE_FULL.시니어} 소개 배너`,
    },
    {
      image: bn4,
      link: "/curriculum/특강",
      alt: `${CURRICULUM_STAGE_FULL.특강} 소개 배너`,
    },
  ];
  const totalSlides = slides.length;

  // 캐로셀 자동 재생
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // 블로그 게시글 가져오기 (RSS 피드)
  useEffect(() => {
    const RSS_URL = "https://rss.blog.naver.com/illosw-it-academy.xml";

    // 여러 CORS 프록시 서버 목록 (폴백용)
    const PROXY_URLS = [
      `https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(RSS_URL)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`,
    ];

    const parseRSS = (xmlText: string) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const items = xml.querySelectorAll("item");

      return Array.from(items)
        .slice(0, 4)
        .map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
        }));
    };

    const fetchWithFallback = async () => {
      for (let i = 0; i < PROXY_URLS.length; i++) {
        try {
          const response = await fetch(PROXY_URLS[i], {
            signal: AbortSignal.timeout(5000), // 5초 타임아웃
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const xmlText = await response.text();
          const posts = parseRSS(xmlText);

          if (posts.length > 0) {
            setBlogPosts(posts);
            setBlogLoading(false);
            return; // 성공하면 종료
          }
        } catch (error) {
          console.warn(`Proxy ${i + 1} failed:`, error);
          // 마지막 프록시도 실패하면 에러 처리
          if (i === PROXY_URLS.length - 1) {
            console.error("All proxies failed");
            setBlogLoading(false);
          }
        }
      }
    };

    fetchWithFallback();
  }, []);

  // 날짜 포맷 함수 (RFC822 형식 -> YYYY.MM.DD)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section
          id="hero"
          ref={(el) => {
            sectionsRef.current["hero"] = el;
          }}
          className="pt-40 pb-16 md:pb-24 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50"
        >
          <div className="max-w-7xl mx-auto">
            {/* 상단: 메시지 영역 (전체 폭, 중앙 정렬) */}
            <div className="text-center mb-12 mt-8 py-8 space-y-6">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                SW·AI 입시 전문 교육
              </div>
              <h1 className="leading-tight">
                <div className="text-xl md:text-3xl text-slate-600 font-normal mb-4">
                  같은 등급에도 다른 결과로 향하는
                </div>
                <div className="text-3xl md:text-6xl text-green-600 font-bold">
                  단 하나의 길(一路)
                </div>
              </h1>
            </div>

            {/* 하단: 2컬럼 콘텐츠 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* 좌측: 강의 캐로셀 */}
              <div
                className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => navigate(slides[currentSlide].link)}
              >
                {/* 슬라이드 컨테이너 */}
                <div className="relative aspect-[16/9] bg-slate-900">
                  {slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        idx === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="h-full w-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>

                {/* 좌측 화살표 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(
                      (prev) => (prev - 1 + totalSlides) % totalSlides,
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center z-10 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* 우측 화살표 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % totalSlides);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center z-10 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlide
                          ? "bg-white w-6"
                          : "bg-white/50 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 우측: 최신 블로그 게시글 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <SiNaver className="w-5 h-5 text-[#28c762]" />
                  최신 소식
                </h3>
                {blogLoading ? (
                  <div className="divide-y divide-slate-100">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse py-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : blogPosts.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {blogPosts.map((post, idx) => (
                      <a
                        key={idx}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <p className="text-sm text-slate-900 truncate flex-1 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </p>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {formatDate(post.pubDate)}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">
                      블로그 게시글을 불러올 수 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 프로그래밍 교육의 효과 */}
        <section
          id="programming-effects"
          ref={(el) => {
            sectionsRef.current["programmingEffects"] = el;
          }}
          className="relative overflow-hidden border-t border-white/10 py-12 md:py-16 px-4 md:px-8"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-stone-950"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-900/35 via-transparent to-amber-900/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-950/20 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            aria-hidden
          >
            <div className="absolute -right-1/4 top-1/2 h-[140%] w-[70%] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(180,83,9,0.5)_0%,transparent_68%)]" />
            <div
              className="absolute right-0 top-0 h-full w-1/2"
              style={{
                backgroundImage: [
                  "radial-gradient(circle at 80% 40%, rgba(251,191,36,0.08) 0%, transparent 45%)",
                  `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='rgba(251,191,36,0.15)' stroke-width='0.5'/%3E%3C/svg%3E")`,
                ].join(", "),
                backgroundSize: "auto, 48px 48px",
              }}
            />
          </div>

          <div className="relative z-[1] mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-12">
            <div className="flex justify-center md:justify-start">
              <img
                src={mascot}
                alt={`${COMPANY_NAME} 프로그래밍 교육 안내 마스코트`}
                className="h-auto w-full max-w-[220px] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:max-w-[260px] md:max-w-[300px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-200/90 md:text-sm">
                SW·AI 입시 전문 교육
              </p>
              <h2 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                프로그래밍 교육의 효과
              </h2>
              <div className="space-y-2 text-sm leading-snug text-slate-200 md:text-base md:leading-relaxed">
                <p>
                  프로그래밍은 문제를 정의하고 해결 절차를 설계하는 사고
                  훈련으로 논리적 사고와 문제 해결 능력을 키우는 데
                  효과적입니다.
                </p>
                <p>
                  또한 생성된 결과물을 통해 생활기록부에 적용하기 용이하며
                  수시에 있어 유리한 지점 확보가 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 커리큘럼 개요 Section */}
        <section
          id="curriculum"
          ref={(el) => {
            sectionsRef.current["curriculum"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-slate-50 border-t border-slate-200 !opacity-100 !transform-none"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-4xl font-semibold mb-12 text-center bg-gradient-to-r from-slate-900 to-gray-400 bg-clip-text text-transparent">
              커리큘럼
            </h2>

            {/* 커리큘럼 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 비기너 클래스 카드 */}
              <div
                onClick={() => navigate("/curriculum/비기너")}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-400 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex flex-col items-center p-6 flex-grow">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <img
                      src={il1}
                      alt={CURRICULUM_STAGE_FULL.비기너}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">
                    {CURRICULUM_STAGE_FULL.비기너}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 text-center">
                    체험 수업 & 적성 탐구
                  </p>
                  <p className="text-xs text-slate-500 mb-4 text-center">
                    다양한 분야를 체험하고 적성에 맞는 방향 찾기
                  </p>
                  <div className="w-full border-t border-slate-200 pt-4">
                    <ul className="text-xs text-slate-700 space-y-2 text-left">
                      <li>• 체험 수업</li>
                      <li>• 프로젝트 관리 도구</li>
                      <li>• 분야별 적성 탐구</li>
                    </ul>
                  </div>
                </div>
                <button className="w-full py-3 bg-orange-600 text-white text-sm font-medium group-hover:bg-orange-700 transition-colors">
                  자세히 보기
                </button>
              </div>

              {/* 주니어 클래스 카드 */}
              <div
                onClick={() => navigate("/curriculum/주니어")}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-green-400 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex flex-col items-center p-6 flex-grow">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <img
                      src={il2}
                      alt={CURRICULUM_STAGE_FULL.주니어}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">
                    {CURRICULUM_STAGE_FULL.주니어}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 text-center">
                    기초 실력 구축
                  </p>
                  <p className="text-xs text-slate-500 mb-4 text-center">
                    프로그래밍 언어와 컴퓨터 사고력 강화
                  </p>
                  <div className="w-full border-t border-slate-200 pt-4">
                    <ul className="text-xs text-slate-700 space-y-2 text-left">
                      <li>• 프로그래밍 언어</li>
                      <li>• 자료구조 & 알고리즘</li>
                      <li>• 비즈니스</li>
                      <li>• 디자인 도구</li>
                    </ul>
                  </div>
                </div>
                <button className="w-full py-3 bg-green-600 text-white text-sm font-medium group-hover:bg-green-700 transition-colors">
                  자세히 보기
                </button>
              </div>

              {/* 시니어 클래스 카드 */}
              <div
                onClick={() => navigate("/curriculum/시니어")}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex flex-col items-center p-6 flex-grow">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <img
                      src={il3}
                      alt={CURRICULUM_STAGE_FULL.시니어}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">
                    {CURRICULUM_STAGE_FULL.시니어}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 text-center">
                    심층 프로젝트
                  </p>
                  <p className="text-xs text-slate-500 mb-4 text-center">
                    완성형 프로젝트로 실전 경험 쌓기
                  </p>
                  <div className="w-full border-t border-slate-200 pt-4">
                    <ul className="text-xs text-slate-700 space-y-2 text-left">
                      <li>• 완성형 프로젝트</li>
                      <li>• 생기부/세특 연계</li>
                      <li>• 실전 개발 프로세스</li>
                    </ul>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white text-sm font-medium group-hover:bg-blue-700 transition-colors">
                  자세히 보기
                </button>
              </div>

              {/* 특강 카드 */}
              <div
                onClick={() => navigate("/curriculum/특강")}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex flex-col items-center p-6 flex-grow">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <img
                      src={il4}
                      alt={CURRICULUM_STAGE_FULL.특강}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">
                    {CURRICULUM_STAGE_FULL.특강}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 text-center">
                    해커톤 & 컨설팅
                  </p>
                  <p className="text-xs text-slate-500 mb-4 text-center">
                    특성화고 대비 및 진로 상담
                  </p>
                  <div className="w-full border-t border-slate-200 pt-4">
                    <ul className="text-xs text-slate-700 space-y-2 text-left">
                      <li>• 해커톤</li>
                      <li>• 컨설팅</li>
                      <li>• 특성화고 대비</li>
                    </ul>
                  </div>
                </div>
                <button className="w-full py-3 bg-purple-600 text-white text-sm font-medium group-hover:bg-purple-700 transition-colors">
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainPage;
