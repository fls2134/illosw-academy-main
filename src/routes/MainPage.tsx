import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiCheckCircle, HiInformationCircle } from "react-icons/hi";
import Header from "../components/Header";
import { formatPhoneNumber } from "../utils/formatPhone";
import { useJsonp } from "../hooks/useJsonp";
import { useCountUp } from "../hooks/useCountUp";
import { useScrollReveal } from "../hooks/useScrollReveal";
import {
  GOOGLE_SCRIPT_URL,
  COMPANY_NAME,
  NAVER_MAP_LINK,
} from "../constants";
import {
  Timetable,
  TimetableRaw,
  Class,
  Current,
  Student,
  SelectedTimeSlot,
} from "../types";
import { formatTimeToAMPM } from "../utils/formatTime";
import academy1 from "../assets/img/academy-1.jpg";
import academy2 from "../assets/img/academy-2.jpg";
import profit1 from "../assets/img/profit-1.jpg";
import profit2 from "../assets/img/profit-2.jpg";
import profit3 from "../assets/img/profit-3.jpg";
import hero from "../assets/img/hero.jpg";
import logo from "../assets/img/logo.svg";
import location from "../assets/img/location.png";

  // 요일 매핑
  const dayMap: { [key: string]: string } = {
    mon: "Mo",
    tue: "Tu",
    wed: "We",
    thu: "Th",
    fri: "Fr",
    sat: "Sa",
    sun: "Su",
  };

function MainPage() {
  const navigate = useNavigate();
  const { fetchJsonp } = useJsonp();
  
  // Number counter for "9년"
  const { count: yearsCount, ref: yearsRef } = useCountUp(9, 2000);
  
  // Image reveals (only for academy images)
  const academy1Reveal = useScrollReveal(0.2, 0);
  const academy2Reveal = useScrollReveal(0.2, 100);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 시간표 관련 state
  const [timetablesRaw, setTimetablesRaw] = useState<TimetableRaw[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [current, setCurrent] = useState<Current[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<SelectedTimeSlot | null>(null);
  const [displayClasses, setDisplayClasses] = useState<Class[]>([]);
  const [selectedTimetableSerial, setSelectedTimetableSerial] = useState<
    number | null
  >(null);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const hasFetchedTimetable = useRef(false);
  const loadingCount = useRef(0);

  // is_register=1인 학생만 카운트하여 timetables 계산
  const timetables: Timetable[] = useMemo(() => {
    if (
      !Array.isArray(timetablesRaw) ||
      !Array.isArray(current) ||
      !Array.isArray(students)
    ) {
      return [];
    }

    // is_register=1인 student_serial Set 생성
    const registeredStudentSerials = new Set(
      students.filter((s) => s.is_register === 1).map((s) => s.serial)
    );

    // current에서 is_register=1인 학생만 필터링하여 timetable_serial별 count 계산
    const timetableCounts: { [key: number]: number } = {};
    current.forEach((c) => {
      if (registeredStudentSerials.has(c.student_serial)) {
        const serial = Number(c.timetable_serial);
        if (serial) {
          timetableCounts[serial] = (timetableCounts[serial] || 0) + 1;
        }
      }
    });

    // timetables에 count와 is_full 추가
    return timetablesRaw.map((t) => {
      const currentCount = timetableCounts[t.serial] || 0;
      const isFull = currentCount >= t.fullcount;
      return {
        ...t,
        current_count: currentCount,
        is_full: isFull,
      };
    });
  }, [timetablesRaw, current, students]);

  const updateTimetableLoading = (increment: number) => {
    loadingCount.current += increment;
    if (loadingCount.current === 0) {
      setTimetableLoading(false);
    } else if (loadingCount.current > 0 && !timetableLoading) {
      setTimetableLoading(true);
    }
  };

  // 시간표 데이터 fetch
  useEffect(() => {
    if (hasFetchedTimetable.current) return;
    hasFetchedTimetable.current = true;

    setTimetableLoading(true);
    loadingCount.current = 4;

    // Timetables
    fetchJsonp({
      action: "timetables",
      onSuccess: (data) => {
        setTimetablesRaw(data);
        updateTimetableLoading(-1);
      },
      onError: (errorMsg) => {
        setTimetableError(errorMsg);
        updateTimetableLoading(-1);
      },
    });

    // Classes
    fetchJsonp({
      action: "classes",
      onSuccess: (data) => {
        const activeClasses = Array.isArray(data)
          ? data.filter((cls: Class) => cls.is_active === 1)
          : [];
        setClasses(activeClasses);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setClasses([]);
        updateTimetableLoading(-1);
      },
    });

    // Current
    fetchJsonp({
      action: "current",
      onSuccess: (data) => {
        setCurrent(Array.isArray(data) ? data : []);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setCurrent([]);
        updateTimetableLoading(-1);
      },
    });

    // Students
    fetchJsonp({
      action: "students",
      onSuccess: (data) => {
        setStudents(Array.isArray(data) ? data : []);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setStudents([]);
        updateTimetableLoading(-1);
      },
    });
  }, [fetchJsonp]);

  const handleTimetableSelect = useCallback(
    (timetableSerial: number, day: string, time: string) => {
      // 데이터가 아직 로드되지 않았으면 리턴
      if (
        !Array.isArray(timetables) ||
        !Array.isArray(current) ||
        !Array.isArray(classes) ||
        !Array.isArray(students)
      ) {
        return;
      }

      // is_register=1인 student_serial Set 생성
      const registeredStudentSerials = new Set(
        students.filter((s) => s.is_register === 1).map((s) => s.serial)
      );

      // 선택한 timetable serial 저장
      setSelectedTimetableSerial(timetableSerial);

      // 선택한 시간대 저장 (표시용으로 변환)
      const dayKey = dayMap[day.toLowerCase()] || day;
      setSelectedTimeSlot({ day: dayKey, time });

      // 해당 시간대의 모든 timetable serial 찾기 (선택한 serial 포함)
      const matchingTimetables = timetables.filter(
        (t) => t.day.toLowerCase() === day.toLowerCase() && t.time === time
      );
      const timetableSerials = [
        ...new Set([
          ...matchingTimetables.map((t) => Number(t.serial)),
          Number(timetableSerial),
        ]),
      ];

      // current에서 해당 timetable serial들에 연결된 class serial 찾기
      // is_register=1인 학생만 포함
      const matchingCurrent = current.filter(
        (c) =>
          timetableSerials.includes(Number(c.timetable_serial)) &&
          registeredStudentSerials.has(c.student_serial)
      );
      const classSerials = [
        ...new Set(matchingCurrent.map((c) => Number(c.class_serial))),
      ];

      // class serial들로 class 정보 찾기
      const matchingClasses = classes.filter((cls) =>
        classSerials.includes(Number(cls.serial))
      );
      setDisplayClasses(matchingClasses);
    },
    [timetables, current, classes, students]
  );

  // Hero 이미지 preload
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = hero;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    // URL 해시가 있으면 해당 섹션으로 스크롤
    const hash = window.location.hash.slice(1);
    if (hash && sectionsRef.current[hash]) {
      setTimeout(() => {
        const headerHeight = 80;
        const elementPosition =
          sectionsRef.current[hash]!.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }, 100);
    }

    // Intersection Observer로 섹션 진입 애니메이션
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
      }
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

  const handleInquiryChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    // 전화번호 필드인 경우 자동 포맷팅
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.inquiryType) {
      setError("모든 필수 필드를 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // FormPage와 동일한 방식으로 POST 요청 전송
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "inquiry",
          name: formData.name,
          phone: formData.phone,
          inquiryType: formData.inquiryType,
          message: formData.message || "",
        }),
      });

      // no-cors 모드에서는 response를 읽을 수 없지만 요청은 전송됨
      
      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        inquiryType: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setError("문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error("Inquiry submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

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
          className="min-h-screen flex items-end md:items-center pt-20 md:pt-24 pb-12 md:pb-0 px-6 md:px-12 lg:px-20 relative bg-slate-900"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          role="img"
          aria-label={`${COMPANY_NAME} Hero Section 배경`}
        >
          {/* 다크 오버레이 - 좌우 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          
          {/* 상단 그라데이션 - 헤더 가독성 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl w-full relative z-10">
            <div className="max-w-2xl">
              {/* 큰 타이틀 */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 md:mb-8 leading-tight animate-fade-in">
                {COMPANY_NAME}
              </h1>
              
              {/* 서브타이틀 */}
              <p className="text-lg md:text-2xl text-white/90 mb-12 md:mb-16 font-medium leading-relaxed animate-fade-in-delay">
                같은 등급에도 다른 결과를 만드는<br className="md:hidden" />
                <span className="text-green-400 font-bold"> 전략의 차이</span>
              </p>
              
              {/* 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-delay-2">
                <button
                  onClick={() => {
                    const element = document.getElementById("curriculum");
                    if (element) {
                      const headerHeight = 80;
                      window.scrollTo({
                        top: element.offsetTop - headerHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="px-5 py-2.5 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-sm md:text-lg hover:bg-white/20 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30 hover:scale-105"
                  aria-label="커리큘럼 섹션으로 이동"
                >
                  커리큘럼
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById("apply");
                    if (element) {
                      const headerHeight = 80;
                      window.scrollTo({
                        top: element.offsetTop - headerHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="px-5 py-2.5 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold text-sm md:text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 hover:shadow-green-500/50"
                  aria-label="강의 신청 섹션으로 이동"
                >
                  강의 신청
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById("inquiry");
                    if (element) {
                      const headerHeight = 80;
                      window.scrollTo({
                        top: element.offsetTop - headerHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="px-5 py-2.5 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold text-sm md:text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 hover:shadow-green-500/50"
                  aria-label="상담 문의 섹션으로 이동"
                >
                  상담 문의
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 학원 소개 Section */}
        <section
          id="about"
          ref={(el) => {
            sectionsRef.current["about"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-white border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-center">
              <div className="text-sm md:text-lg text-slate-500 font-normal mb-2">
                같은 등급에도 다른 결과를 만드는
              </div>
              <div className="text-xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                전략의 차이
              </div>
            </h2>

            <div className="mb-12 space-y-6">
              {/* 첫 3개 문단 - 별도 카드 */}
              <div className="bg-slate-50 rounded-lg p-6 md:p-8 border border-slate-200">
                <div className="prose prose-slate max-w-none text-left space-y-6">
                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                    <span className="text-2xl mr-2">🏫</span>
                    일로 SW 입시센터는 2025년 12월 1일 설립된 SW 입시 전문 교육
                    기관입니다.
                  </p>
                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                    <span className="text-2xl mr-2">🎯</span>
                    단순한 코딩 교습에 더해 전략의 차이가 곧 결과의 차이라는
                    교육 철학 아래 같은 성적, 같은 출발선의 학생이라도 입시
                    결과에서 분명한 차이를 만들어내는 교습을 지향합니다.
                  </p>
                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                    <span className="text-2xl mr-2">👨‍💼</span>
                    대형 IT 입시센터 출신 원장의 실제 입시 사례와 교육 노하우를
                    바탕으로 학생 개개인에게 가장 합리적이고 효율적인 학습
                    전략을 제시합니다.
                  </p>
                </div>
              </div>

              {/* 대상 학생 섹션 - 별도 카드 */}
              <div className="bg-slate-50 rounded-lg p-6 md:p-8 border border-slate-200">
                <div className="prose prose-slate max-w-none text-left space-y-6">
                  <p className="text-xs md:text-lg text-slate-900 font-semibold leading-relaxed">
                    일로 SW 입시센터는 광명시 전역의
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2 text-slate-700">
                      <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      초등학생
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      중학생
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      특성화고·마이스터고 진학 희망 학생
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      IT·SW 계열 진학을 목표로 하는 고등학생
                    </li>
                  </ul>
                  <p className="text-xs md:text-lg text-slate-900 font-semibold leading-relaxed">
                    에게 실질적인 결과로 증명되는 교습을 약속드립니다.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              일로 SW 입시센터만의 압도적인 강점
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* 강점 카드 1 */}
              <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={profit1}
                    alt="일로 SW 입시센터 전문성과 현장 경험을 겸비한 대표 원장 직강"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 leading-relaxed">
                    <span className="text-2xl mr-2">👨‍💼</span>
                    전문성과 현장 경험을 겸비한 대표 원장 직강
                  </h4>
                  <p className="text-slate-700 mb-6 leading-loose">
                    일로 SW 입시센터의 모든 수업은 현직 IT 스타트업 개발사
                    대표이자 AI 석사 학위를 보유한 대표 원장이 직접 지도합니다.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-500 leading-relaxed">
                    <li ref={yearsRef as React.RefObject<HTMLLIElement>}>
                      • 2017년부터의 코딩 강의 경력 (
                      <span className="font-bold text-green-600 text-base">{yearsCount}년</span>
                      )
                    </li>
                    <li>• 대치동 코딩학원 및 대형 학원 강사 경력</li>
                    <li>• 입시와 교육 현장을 모두 경험한 실무형 교육자</li>
                    <li>• 실제 개발사 운영으로 최신 기술 트렌드 반영</li>
                  </ul>
                </div>
              </div>

              {/* 강점 카드 2 */}
              <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={profit2}
                    alt={`${COMPANY_NAME} 소수 정예 집중 관리 수업 환경`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 leading-relaxed">
                    <span className="text-2xl mr-2">🎯</span>
                    학습 효과를 극대화하는 소수 정예 집중 관리
                  </h4>
                  <p className="text-slate-700 mb-6 leading-loose">
                    일로 SW 입시센터는 3명 이내의 극소수 정예 그룹 수업만을
                    운영합니다.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-500 leading-relaxed">
                    <li>• 주 1회 수업, 회당 120분 집중 수업</li>
                    <li>• 학생별 이해도·목표에 맞춘 사실상 1:1 수준의 관리</li>
                    <li>• github 관리로 보이는 프로젝트 결과물</li>
                    <li>• 수업 이해도 저하 방지, 학습 누락 최소화</li>
                  </ul>
                </div>
              </div>

              {/* 강점 카드 3 */}
              <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={profit3}
                    alt={`${COMPANY_NAME} 실전 개발력 향상을 위한 특강 프로그램`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 leading-relaxed">
                    <span className="text-2xl mr-2">🚀</span>
                    실전 개발력을 키우는 차별화된 특강 프로그램
                  </h4>
                  <p className="text-slate-700 mb-6 leading-loose">
                    정규 수업 외에도 학생들의 실전 역량과 입시 경쟁력 강화를 위한
                    특강을 주기적으로 운영합니다.
                  </p>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <div>
                      <span className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <span className="text-lg">💻</span>
                        해커톤 (단기 집중 개발 대회)
                      </span>
                      <ul className="mt-2 space-y-2 text-slate-500">
                        <li>• 단기간 집중 실습</li>
                        <li>• 프로젝트 완성도 향상</li>
                        <li>• 협업 경험 및 문제 해결 능력 강화</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <span className="text-lg">📚</span>
                        최신 논문 분석
                      </span>
                      <ul className="mt-2 space-y-2 text-slate-500">
                        <li>• AI, 빅데이터 등 최신 기술 트렌드 분석</li>
                        <li>• 연구 주제 이해 및 확장</li>
                        <li>• 생기부·세특·탐구 활동과의 연계 가능</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center space-y-6">
              <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                일로 SW 입시센터는 단순히 SW 지식을 전달하는 학원이 아닙니다.
              </p>
              <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
                학생의 현재 위치의 정확한 진단을 통해 가장 합리적인 전략을
                설계하며 입시 결과로 이어질 수 있도록 끝까지 함께하는
                파트너입니다.
              </p>
              <p className="text-base md:text-xl font-bold text-slate-900">
                같은 등급이라도 같은 결과가 나올 필요는 없습니다.
              </p>
              <p className="text-base md:text-xl font-bold text-slate-900">
                전략이 다르면, 결과는 달라집니다.
              </p>
              <p className="text-base md:text-xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                일로 SW 입시센터가 그 차이를 만듭니다.
              </p>
            </div>
            </div>
        </section>

        {/* 위치 Section */}
        <section
          id="location"
          ref={(el) => {
            sectionsRef.current["location"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-white border-t border-slate-200"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-slate-900 to-gray-400 bg-clip-text text-transparent">
              위치
            </h2>
            
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-3xl">
                <img
                  src={location}
                  alt={`${COMPANY_NAME} 위치`}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <a
                    href={NAVER_MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`네이버 지도에서 ${COMPANY_NAME} 위치 보기`}
                  >
                    네이버 지도에서 보기
                    <HiArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:gap-6 max-w-3xl mx-auto">
              <div 
                ref={academy1Reveal.ref as React.RefObject<HTMLDivElement>}
                className={`rounded-lg overflow-hidden shadow-md transition-all duration-700 ${
                  academy1Reveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <img
                  src={academy1}
                  alt={`${COMPANY_NAME} 강의실 내부 1`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div 
                ref={academy2Reveal.ref as React.RefObject<HTMLDivElement>}
                className={`rounded-lg overflow-hidden shadow-md transition-all duration-700 ${
                  academy2Reveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
              >
                <img
                  src={academy2}
                  alt={`${COMPANY_NAME} 강의실 내부 2`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 커리큘럼 Section */}
        <section
          id="curriculum"
          ref={(el) => {
            sectionsRef.current["curriculum"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-slate-900 to-gray-400 bg-clip-text text-transparent">
              커리큘럼
            </h2>
            <p className="text-sm md:text-base text-slate-400 mb-8 text-center">
              다양한 개발 분야를 체험하고, 기초 실력을 쌓은 뒤, 심층 프로젝트로 연결하는 구조
            </p>

            <div className="relative space-y-12">
              {/* Timeline vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-green-500 via-blue-500 to-purple-500"></div>
              
              {/* 입문 단계 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-2 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    입문 단계 : 체험 수업 & 적성 탐구
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-700 mb-6 leading-relaxed">
                  SW·AI 분야는 영역이 매우 넓습니다. 웹, 게임, 서버, AI, 데이터 등 각 분야는 성격과 요구 역량이 다릅니다. 
                  일로 SW 입시 연구소에서는 처음부터 한 분야를 고정하지 않고, 단기간에 학생이 여러 분야를 직접 경험하게 하여 
                  자신에게 맞는 방향을 찾아 올바른 커리큘럼을 제안합니다.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 체험 수업 + 프로젝트 관리 도구 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🛠️</span>
                      체험 수업 + 프로젝트 관리 도구
                    </h4>
                    <ul className="space-y-2 text-sm md:text-base text-slate-700">
                      <li>• Agent 개발 도구 사용법</li>
                      <li>• Git & GitHub 사용법</li>
                      <li>• 실제 개발 프로세스의 이해</li>
                    </ul>
                  </div>

                  {/* 적성 탐구 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🔍</span>
                      적성 탐구
                    </h4>
                    <p className="text-sm md:text-base text-slate-700 mb-3">
                      분야별 프로젝트 체험
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["서버", "엔진(게임 개발)", "데이터(AI)", "컴퓨터 비전(AI)", "웹 퍼블리싱"].map((field) => (
                        <span
                          key={field}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs md:text-sm font-medium"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 학습 단계 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    학습 단계 : 기초 실력 구축
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-700 mb-6 leading-relaxed">
                  체험을 통해 방향이 잡혔다면 이제 개발자로서 반드시 필요한 기초 역량을 쌓습니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 프로그래밍 언어 학습 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">💻</span>
                      프로그래밍 언어 학습
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      학생의 수준과 목표에 맞춰 선택적으로 학습
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {["C", "C++", "C#", "Python", "Java", "JavaScript"].map((lang) => (
                        <span
                          key={lang}
                          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium ${
                            lang === "Java"
                              ? "bg-orange-100 text-orange-700"
                              : lang === "JavaScript"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      단순 문법 암기가 아니라 프로그램이 어떻게 동작하는지 이해하는 데 초점
                    </p>
                  </div>

                  {/* 컴퓨터 사고력 강화 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🧠</span>
                      컴퓨터 사고력 강화
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">자료구조 & 알고리즘</p>
                    <ul className="space-y-2 text-sm md:text-base text-slate-700">
                      <li>• 데이터를 효율적으로 다루는 방법</li>
                      <li>• 문제를 논리적으로 해결하는 과정 훈련</li>
                    </ul>
                    <p className="text-xs text-slate-500 italic mt-3">
                      프로젝트 수행의 기반 체력이 됩니다
                    </p>
                  </div>

                  {/* 비즈니스 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">💼</span>
                      비즈니스
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      사업에 대한 전반적인 이해와 기획서 작문, 발표 서식 등
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["docs", "ppt", "markup language", "협업 도구"].map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs md:text-sm font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic mt-3">
                      사업자(개인/법인)에 대한 이해와 등록 및 운영 (선택)
                    </p>
                  </div>

                  {/* 디자인 도구 - 퍼블리싱 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm md:col-span-2 lg:col-span-1">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🎨</span>
                      디자인 도구 - 퍼블리싱
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      UI/UX 감각이 뛰어난 학생들을 위한 웹 퍼블리싱 교습
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["figma", "UI/UX", "style 도구(css, tailwind 등)"].map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs md:text-sm font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 숙련 단계 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    숙련 단계 : 심층 프로젝트
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-700 mb-6 leading-relaxed">
                  기초 학습이 어느 정도 완성되면 학생의 진로와 입시 방향에 맞춘 심층 프로젝트로 들어갑니다.
                </p>

                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                  <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    심층 프로젝트
                  </h4>
                  <ul className="space-y-3 text-sm md:text-base text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>단순 실습이 아닌 완성형 프로젝트</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>생기부·세특·탐구 활동으로 연결 가능</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>전공 적합성을 드러낼 수 있는 주제 선정</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>실제 개발 흐름(기획 → 구현 → 개선) 경험</span>
                    </li>
                  </ul>
                  <p className="text-sm md:text-base text-slate-600 mt-4 italic">
                    이 단계에서 학생은 코딩 배움 학생을 넘어 무언가를 만들어본 경험이 있는 학생이 됩니다.
                  </p>
                </div>
              </div>

              {/* 비정기적 특강 */}
              <div className="relative pl-16">
                <div className="absolute left-0 top-2 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  +
                </div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    비정기적 특강
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 해커톤 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      해커톤
                    </h4>
                    <ul className="space-y-2 text-sm md:text-base text-slate-700">
                      <li>• 제한된 시간 안에 아이디어를 구현</li>
                      <li>• 문제 해결력·협업 능력 강화</li>
                    </ul>
                  </div>

                  {/* 컨설팅 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">📋</span>
                      컨설팅
                    </h4>
                    <ul className="space-y-2 text-sm md:text-base text-slate-700">
                      <li>• 진로 방향 설정</li>
                      <li>• 전공 선택 및 입시 전략 상담</li>
                    </ul>
                  </div>

                  {/* 특성화고 대비 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">🎓</span>
                      특성화고 대비
                    </h4>
                    <p className="text-sm md:text-base text-slate-700">
                      특성화고 및 관련 전형을 고려한 맞춤 준비
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 핵심 요약 - 타임라인 밖으로 분리 */}
            <div className="mt-12 bg-white border border-slate-200 rounded-xl p-8 md:p-10 shadow-sm">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-center text-slate-900">
                커리큘럼의 핵심
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed pt-1">
                    먼저 경험해보고
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed pt-1">
                    나에게 맞는 분야를 찾고
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed pt-1">
                    체계적으로 실력을 쌓아
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed pt-1">
                    입시와 연결되는 결과물까지 만든다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 강의 신청 Section */}
        <section
          id="apply"
          ref={(el) => {
            sectionsRef.current["apply"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-white border-t border-slate-200"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-slate-900 to-gray-400 bg-clip-text text-transparent">
              강의 신청
            </h2>
            <p className="text-sm md:text-lg text-slate-400 mb-8 text-center">
              원하시는 시간대를 선택하여 강의를 신청해주세요
            </p>

            {timetableLoading ? (
              /* 스켈레톤 UI */
              <div className="bg-slate-50 rounded-lg p-1 md:p-4 border border-slate-200 shadow-sm">
                <div className="w-full overflow-x-auto">
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded mb-2"></div>
                    <div className="space-y-2">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-7 bg-slate-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : timetableError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700 text-base font-medium mb-2">
                  데이터를 불러오는 중 오류가 발생했습니다
                </p>
                <p className="text-red-600 text-sm">{timetableError}</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-lg p-1 md:p-4 border border-slate-200 shadow-sm">
                  <div className="w-full overflow-x-auto">
                    <table
                      className="w-full border-collapse"
                      style={{ tableLayout: "fixed" }}
                    >
                      <colgroup>
                        <col style={{ width: "70px", minWidth: "70px" }} />
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                          (_, index) => (
                            <col
                              key={index}
                              style={{
                                width: `calc((100% - 70px) / 7)`,
                              }}
                            />
                          )
                        )}
                      </colgroup>
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-xs md:text-xs lg:text-sm font-bold text-slate-700 pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1"></th>
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                            (day) => (
                              <th
                                key={day}
                                className="text-xs md:text-xs lg:text-sm font-bold text-slate-700 text-center pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1 border-l border-slate-200 first:border-l-0"
                              >
                                {day}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
  const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const times: string[] = [];
  for (let hour = 10; hour <= 21; hour++) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
  }

  // 시간표를 그리드 형태로 변환
  const gridData: { [key: string]: Timetable } = {};
  timetables.forEach((timetable) => {
    const dayKey = dayMap[timetable.day.toLowerCase()] || timetable.day;
    const key = `${dayKey}-${timetable.time}`;
    gridData[key] = timetable;
  });

  // 각 셀의 rowspan 계산
  const cellData: {
    [key: string]: { timetable: Timetable | null; rowspan: number };
  } = {};

  // 먼저 모든 셀을 초기화
  times.forEach((time) => {
    dayOrder.forEach((day) => {
      const key = `${day}-${time}`;
      cellData[key] = { timetable: null, rowspan: 1 };
    });
  });

  // 시간표가 있는 셀에 rowspan=2 적용
  timetables.forEach((timetable) => {
    const dayKey = dayMap[timetable.day.toLowerCase()] || timetable.day;
    const key = `${dayKey}-${timetable.time}`;
    cellData[key] = { timetable, rowspan: 2 };

    // 다음 시간대의 같은 요일 셀은 건너뛰기
    const timeIndex = times.indexOf(timetable.time);
    if (timeIndex >= 0 && timeIndex < times.length - 1) {
      const nextTime = times[timeIndex + 1];
      const nextKey = `${dayKey}-${nextTime}`;
      cellData[nextKey] = { timetable: null, rowspan: 0 };
    }
  });

                          return times.map((time, timeIndex) => {
                return (
                  <tr
                    key={time}
                                className={`h-7 md:h-7 lg:h-8 ${
                      timeIndex < times.length - 1
                                    ? "border-b border-slate-200"
                        : ""
                    }`}
                  >
                    {/* 시간 라벨 */}
                                <td className="text-xs md:text-xs lg:text-sm font-normal py-0 px-1 text-left align-middle h-7 md:h-7 lg:h-8 whitespace-nowrap">
                      {(() => {
                        const formattedTime = formatTimeToAMPM(time);
                        const parts = formattedTime.split(" ");
                                    const period = parts[0];
                                    const timeStr = parts[1];

                        const parts2 = time.split(":");
                        const hour = parseInt(parts2[0], 10);
                        const isAfternoon = hour >= 12;
                        const periodColor = isAfternoon
                                      ? "text-rose-500"
                                      : "text-blue-500";

                        return (
                          <>
                            <span className={periodColor}>{period}</span>{" "}
                                        <span className="text-slate-900">{timeStr}</span>
                          </>
                        );
                      })()}
                    </td>

                    {/* 각 요일별 셀 */}
                    {dayOrder.map((day) => {
                      const key = `${day}-${time}`;
                      const cell = cellData[key];

                      if (cell?.rowspan === 0) {
                        return null;
                      }

                      const timetable = cell?.timetable || null;
                      const rowspan = cell?.rowspan || 1;
                                  const cellHeight =
                                    rowspan === 2
                                      ? "h-14 md:h-14 lg:h-16"
                                      : "h-7 md:h-7 lg:h-8";

                      if (!timetable) {
                        return (
                          <td
                            key={day}
                                        className={`py-0 px-0 ${cellHeight} border-l border-slate-200`}
                            rowSpan={rowspan}
                          ></td>
                        );
                      }

                      let buttonClass = "";
                      let buttonText = "";

                      if (timetable.is_full) {
                        buttonClass =
                                      "bg-slate-300 text-slate-700 cursor-not-allowed";
                        buttonText = "마감";
                      } else {
                        buttonClass =
                                      "bg-slate-700 text-white hover:bg-slate-600";
                        buttonText = `${timetable.current_count}/${timetable.fullcount}`;
                      }

                      return (
                        <td
                          key={day}
                                      className={`py-0 px-0 ${cellHeight} border-l border-slate-200 relative`}
                          rowSpan={rowspan}
                        >
                                      {timetable.is_new && !timetable.is_full && (
                                        <span className="absolute top-1 right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-400 rounded-full z-10"></span>
                                      )}
                          <button
                            onClick={() =>
                                          handleTimetableSelect(
                                            timetable.serial,
                                            timetable.day,
                                            timetable.time
                                          )
                            }
                            disabled={timetable.is_full}
                                        className={`h-full w-full rounded-lg text-xs md:text-xs lg:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${buttonClass}`}
                                        aria-label={
                                          timetable.is_full
                                            ? `${timetable.day} ${timetable.time} 시간대 마감됨`
                                            : `${timetable.day} ${timetable.time} 시간대 선택 (${timetable.current_count}/${timetable.fullcount})`
                                        }
                          >
                            {buttonText}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
                          });
                        })()}
            </tbody>
          </table>
        </div>
      </div>

                {/* 선택한 시간대의 클래스 정보 카드 */}
                {selectedTimeSlot && displayClasses.length > 0 && (
                  <div className="mt-6">
                    <div className="space-y-4">
                      {displayClasses.map((cls) => (
                        <div
                          key={cls.serial}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm w-full"
                        >
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-200 rounded-full mb-3">
                            {cls.category}
                          </span>
                          <div className="text-base font-medium text-slate-900 mb-4">
                            {cls.class}
    </div>
                          <button
                            onClick={() => {
                              if (selectedTimetableSerial) {
                                navigate(
                                  `/form?timetable=${selectedTimetableSerial}&class=${cls.serial}`
                                );
                              }
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={`${cls.class} 신청하기`}
                          >
                            신청하러가기
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTimeSlot && displayClasses.length === 0 && (
                  <div className="mt-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                      <HiInformationCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                      <p className="text-sm text-slate-600 font-normal mb-4">
                        해당 시간대에 운영 중인 클래스가 없습니다.
                      </p>
                      <button
                        onClick={() => {
                          if (selectedTimetableSerial) {
                            navigate(`/form?timetable=${selectedTimetableSerial}`);
                          }
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label="강의 신청 페이지로 이동"
                      >
                        신청하러가기
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* 상담 문의 Section */}
        <section
          id="inquiry"
          ref={(el) => {
            sectionsRef.current["inquiry"] = el;
          }}
          className="py-16 md:py-24 px-4 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-slate-900 to-gray-400 bg-clip-text text-transparent">
              상담 문의
            </h2>
            <p className="text-sm md:text-lg text-slate-400 mb-8 text-center">
              궁금한 사항이 있으시면 언제든지 문의해주세요
            </p>

            <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInquiryChange}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="이름을 입력해주세요"
                    aria-label="이름 입력"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInquiryChange}
                    required
                    maxLength={13}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="010-0000-0000"
                    aria-label="전화번호 입력"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInquiryChange}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    aria-label="문의 유형 선택"
                  >
                    <option value="">선택해주세요</option>
                    <option value="lecture">강의 문의</option>
                    <option value="consultation">상담 신청</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    메시지
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInquiryChange}
                    rows={4}
                    maxLength={500}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="문의 내용을 입력해주세요 (선택사항)"
                    aria-label="문의 메시지 입력"
                  />
                  {formData.message.length > 0 && (
                    <p className="mt-1 text-xs text-slate-500 text-right">
                      {formData.message.length}/500
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4" role="alert">
                    {error}
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4" role="status">
                    문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
                  </div>
                )}

                          <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label={submitting ? "전송 중" : "문의하기"}
                >
                  {submitting ? "전송 중..." : "문의하기"}
                          </button>
              </form>
        </div>
      </div>
        </section>

      </main>
    </div>
  );
}

export default MainPage;
