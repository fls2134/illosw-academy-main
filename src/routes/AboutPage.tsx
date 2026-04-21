import React, { useEffect } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { COMPANY_NAME } from "../constants";
import avatar from "../assets/img/avatar.png";
import profit1 from "../assets/img/profit-1.jpg";
import profit2 from "../assets/img/profit-2.jpg";
import profit3 from "../assets/img/profit-3.jpg";

function AboutPage() {
  const experienceYears = new Date().getFullYear() - 2017;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-40">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            학원 소개
          </h1>
          <p className="text-base md:text-2xl text-slate-300">
            같은 등급에도 다른 결과를 만드는
            <span className="text-green-400 font-bold"> 전략의 차이</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {/* 1. 교육 이념 */}
        <section
          className="space-y-10"
          aria-labelledby="about-section-ideology"
        >
          <div className="space-y-6 text-center">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <img
                src={profit1}
                alt={`${COMPANY_NAME} 전략과 결과를 함께 설계하는 교육`}
                className="aspect-[10/3] w-full object-cover sm:aspect-[4/1]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-base font-bold text-slate-900 md:text-xl">
              같은 등급이라도 같은 결과를 말하지 않습니다. 전략이 다르면, 결과는
              달라집니다.
            </p>
            <p className="text-lg font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent md:text-2xl">
              {COMPANY_NAME}가 그 차이를 만듭니다.
            </p>
          </div>
          <div className="space-y-6 text-left">
            <p className="text-sm leading-relaxed text-slate-700 md:text-lg">
              ✅ {COMPANY_NAME}는 2025년 12월 1일 설립된 SW 입시 전문 교육
              기관입니다.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 md:text-lg">
              ✅ 단순한 코딩 교습에 더해 전략의 차이가 곧 결과의 차이라는 교육
              철학 아래 같은 성적, 같은 출발선의 학생이라도 입시 결과에서 분명한
              차이를 만들어내는 교습을 지향합니다.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 md:text-lg">
              ✅ 대형 IT 입시 학원 출신 원장의 실제 입시 사례와 교육 노하우를
              바탕으로 학생 개개인에게 가장 합리적이고 효율적인 학습 전략을
              제시합니다.
            </p>
          </div>
        </section>

        {/* 2. 대상 */}
        <section
          className="mt-16 space-y-6 border-t border-slate-200 pt-16"
          aria-labelledby="about-section-audience"
        >
          <p className="text-sm font-medium leading-relaxed text-slate-900 md:text-lg">
            {COMPANY_NAME}는 광명시 전역의
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <li className="flex items-center gap-2 text-slate-700">
                <HiCheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                초등학생
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <HiCheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                중학생
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <HiCheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                특성화고·마이스터고 진학 희망 학생
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <HiCheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                IT·SW 계열 진학을 목표로 하는 고등학생
              </li>
            </ul>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-900 md:text-lg">
            에게 실질적인 결과로 증명되는 교습을 약속드립니다.
          </p>
        </section>

        {/* 3. 강사 */}
        <section
          className="mt-16 border-t border-slate-200 pt-16"
          aria-labelledby="about-section-instructor"
        >
          <h2
            id="about-section-instructor"
            className="scroll-mt-28 mb-8 text-center text-lg font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent md:text-3xl md:scroll-mt-32"
          >
            강사 소개
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-loose text-slate-700 md:text-base">
            {COMPANY_NAME}의 모든 수업은 대표 원장이 직접 지도합니다.
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-5 md:gap-6">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <img
                src={avatar}
                alt={`${COMPANY_NAME} 전문성과 현장 경험을 겸비한 대표 원장`}
                className="h-auto w-full max-w-[150px] rounded-2xl object-cover sm:max-w-[200px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                id="about-instructor-name"
                className="mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-slate-200 pb-3"
              >
                <span className="text-2xl font-bold leading-tight md:text-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  설경석
                </span>
                <span className="text-base font-medium leading-tight text-slate-600 md:text-lg">
                  연구소장
                </span>
              </h3>
              <ul
                className="space-y-3 text-sm leading-relaxed text-slate-500"
                aria-labelledby="about-instructor-name"
              >
                <li>
                  • 프로그래밍 강의 (
                  <span className="text-base font-bold text-green-600">
                    {experienceYears}년
                  </span>
                  )
                </li>
                <li>• 성균관대학교 소프트웨어학과 석사 졸업</li>
                <li>• 現 일로 SW 입시연구소장</li>
                <li className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <span>• 現 스타트업 대표이사</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 md:text-xs">
                      Vision AI
                    </span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 md:text-xs">
                      Software Solution
                    </span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 md:text-xs">
                      Live Broadcast
                    </span>
                  </span>
                </li>
                <li>• 前 Unitsoft 대치점 강사</li>
                <li>• 前 메가스터디 SW 입시센터 강사</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. 강점 */}
        <section
          className="mt-16 border-t border-slate-200 pt-16"
          aria-labelledby="about-section-strengths"
        >
          <h3 className="mb-8 text-center text-lg font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent md:text-3xl">
            {COMPANY_NAME}만의 압도적인 강점
          </h3>
          <div className="flex flex-col gap-12 md:gap-14">
            <article className="space-y-5">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <img
                  src={profit2}
                  alt={`${COMPANY_NAME} 소수 정예 집중 관리 수업 환경`}
                  className="aspect-[10/3] w-full object-cover sm:aspect-[4/1]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-4 text-left">
                <h4 className="text-xl font-bold leading-relaxed text-slate-900 md:text-2xl">
                  ✨ 학습 효과를 극대화하는 소수 정예 집중 관리
                </h4>
                <p className="leading-loose text-slate-700">
                  {COMPANY_NAME}는 3명 이내의 극소수 정예 그룹 수업만을
                  운영합니다.
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-500">
                  <li>• 주 1회 수업, 회당 120분 집중 수업</li>
                  <li>• 학생별 이해도·목표에 맞춘 밀착 관리</li>
                  <li>• github 관리로 보이는 프로젝트 결과물</li>
                  <li>• 수업 이해도 저하 방지, 학습 누락 최소화</li>
                </ul>
              </div>
            </article>

            <article className="space-y-5">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <img
                  src={profit3}
                  alt={`${COMPANY_NAME} 진로에 맞춘 단계별 커리큘럼`}
                  className="aspect-[10/3] w-full object-cover sm:aspect-[4/1]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-4 text-left">
                <h4 className="text-xl font-bold leading-relaxed text-slate-900 md:text-2xl">
                  ✨ 진로에 맞춘 단계별 커리큘럼
                </h4>
                <p className="leading-loose text-slate-700">
                  커리큘럼 개요에서 강조하듯, 무엇을 배우기에 앞서 왜
                  배우는지부터 방향을 잡습니다. 비기너·주니어·시니어로 이어지는
                  과정 속에서 목표에 맞는 학습 경로를 설계합니다.
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-500">
                  <li>
                    • 비기너 : 체험 수업과 적성 탐구로 흥미와 진로 적합성을
                    점검합니다
                  </li>
                  <li>
                    • 주니어 : 프로그래밍 언어·기초 CS로 실력의 토대를 쌓습니다
                  </li>
                  <li>
                    • 시니어 : 심층 프로젝트와 특성화고·입시 목표에 맞는 심화
                    학습으로 이어집니다
                  </li>
                  <li>• 진로에 따라 단계 최적화된 커리큘럼을 제공합니다</li>
                </ul>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
