import React from "react";
import { useNavigate } from "react-router-dom";
import {
  COMPANY_NAME,
  type CurriculumStageKey,
  CURRICULUM_STAGE_FULL,
} from "../constants";
import il1 from "../assets/img/IL-1.png";
import il2 from "../assets/img/IL-2.png";
import il3 from "../assets/img/IL-3.png";
import il4 from "../assets/img/IL-4.png";

const stages: {
  id: CurriculumStageKey;
  label: string;
  description: string;
  image: string;
}[] = [
  {
    id: "비기너",
    label: CURRICULUM_STAGE_FULL.비기너,
    description: "체험 수업 & 적성 탐구",
    image: il1,
  },
  {
    id: "주니어",
    label: CURRICULUM_STAGE_FULL.주니어,
    description: "기초 실력 구축",
    image: il2,
  },
  {
    id: "시니어",
    label: CURRICULUM_STAGE_FULL.시니어,
    description: "심층 프로젝트",
    image: il3,
  },
  {
    id: "특강",
    label: CURRICULUM_STAGE_FULL.특강,
    description: "해커톤, 컨설팅, 특성화고 대비 등",
    image: il4,
  },
];

function scrollToCurriculumSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CurriculumDefaultPage() {
  const navigate = useNavigate();

  const handleStageClick = (stageId: CurriculumStageKey) => {
    navigate(`/curriculum/${stageId}`);
  };

  return (
    <div className="min-h-screen bg-white pt-[200px] md:pt-[215px]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 relative z-0">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            커리큘럼
          </h1>
          <p className="text-sm md:text-xl text-slate-300 mb-3 md:mb-4">
            학생의 전공 적합성을 찾아 진행되는 체계적인 교육 과정
          </p>
          <p className="text-sm md:text-xl text-slate-300 mb-4 md:mb-5">
            단순 코딩을 넘어 컴퓨터 과학으로 입시까지 이어지는 교육 과정
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() =>
                scrollToCurriculumSection("curriculum-anchor-intro")
              }
              className="inline-flex items-center rounded-full border border-gray-500/70 bg-gray-600 px-4 py-2 text-sm font-medium text-gray-50 shadow-sm transition hover:border-gray-400 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              인트로
            </button>
            <button
              type="button"
              onClick={() =>
                scrollToCurriculumSection("curriculum-anchor-guide")
              }
              className="inline-flex items-center rounded-full border border-gray-500/70 bg-gray-600 px-4 py-2 text-sm font-medium text-gray-50 shadow-sm transition hover:border-gray-400 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              가이드
            </button>
          </div>
        </div>
      </div>

      {/* 커리큘럼 섹션 */}
      <section className="py-16 px-4 bg-slate-50 relative z-10 !opacity-100 !transform-none">
        <div className="max-w-6xl mx-auto">
          <h2
            id="curriculum-anchor-intro"
            className="scroll-mt-28 text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-amber-600 via-amber-500 to-pink-600 bg-clip-text text-transparent [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.1))] md:scroll-mt-32"
          >
            일관된 방향성이 좋은 결과를 만든다
          </h2>
          <div className="bg-white rounded-lg border-2 border-slate-200 shadow-sm p-6 md:p-8 mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">
              교육의 첫걸음은 방향을 잡는 것에서 시작합니다.
            </h2>
            <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
              <p>
                프로그래밍을 시작하며 커리큘럼의 방향이 어디에 도달하는지
                이해하지 못한 채 수업이 시작되며 겪는 혼란을 보아왔습니다.
              </p>
              <p>
                그 결과 AI에 관심 있는 학생이 이론 중심의 언어부터 배우거나
                웹·앱 개발에 흥미가 있음에도 알고리즘 풀이 위주로만 학습하는 등,
                진로와 맞지 않는 방향으로 시작하는 경우가 발생합니다.
              </p>
              <p>
                {COMPANY_NAME}는 무엇을 배우는지에 앞서, 왜 배우는지부터
                설계합니다.
              </p>
              <p className="font-medium text-slate-800">
                학생의 진로에 맞춘 정확한 시작을 제공합니다.
              </p>
            </div>
          </div>
          {/* 4단계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {stages.map((stage, index) => {
              const hoverBorder =
                index === 0
                  ? "hover:border-orange-400"
                  : index === 1
                    ? "hover:border-green-400"
                    : index === 2
                      ? "hover:border-blue-400"
                      : "hover:border-purple-400";
              return (
                <div
                  key={stage.id}
                  onClick={() => navigate(`/curriculum/${stage.id}`)}
                  className={`bg-white rounded-lg border-2 border-slate-200 shadow-sm hover:shadow-lg ${hoverBorder} transition-all cursor-pointer group`}
                >
                  <div className="flex flex-col items-center p-4 md:p-6">
                    <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                      <img
                        src={stage.image}
                        alt={stage.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 text-center">
                      {stage.label}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 진로별 커리큘럼 로드맵 */}
          <div>
            <div className="text-center mb-12">
              <h2
                id="curriculum-anchor-guide"
                className="scroll-mt-28 text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:scroll-mt-32"
              >
                진로별 커리큘럼 구성 가이드
              </h2>
              <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto">
                비기너 클래스를 통해 학생의 진로 적합성을 판단합니다
                <br />
                목표에 따라 아래와 같이 체계적인 학습 경로를 설계합니다
              </p>
            </div>
            <p className="text-center text-sm md:text-base font-semibold text-pink-500 max-w-3xl mx-auto mb-12 px-2">
              아래 구성은 예시이며, 진로별 자유로운 조합이 가능합니다
            </p>
            {/* 취미 영역 및 적성 판단 */}
            <div className="mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                취미 영역 및 적성 판단
              </h3>
              <div className="bg-slate-100 border-l-4 border-slate-500 p-4 mb-6">
                <p className="text-sm text-slate-700">
                  짧은 기간 안에 다양한 분야를 경험하고, 흥미와 적성을 바탕으로
                  공학적인 사고를 발현합니다
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div
                  onClick={() => navigate("/curriculum/비기너#적성탐구")}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-200"
                >
                  <span className="text-slate-600 font-medium mr-3">1.</span>
                  <span className="text-slate-700">
                    비기너 클래스 - 적성 탐구
                  </span>
                  <span className="ml-auto text-slate-400">→</span>
                </div>
                <div
                  onClick={() => navigate("/curriculum/특강#논문분석")}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <span className="text-slate-600 font-medium mr-3">2.</span>
                  <span className="text-slate-700">
                    특강 - 논문 / 이슈 분석
                  </span>
                  <span className="ml-auto text-slate-400">→</span>
                </div>
              </div>
            </div>

            {/* 고등학교 입시 (고입) */}
            <div className="mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                고등학교 입시
              </h3>
              <div className="bg-slate-100 border-l-4 border-orange-500 p-4 mb-6">
                <p className="text-sm text-slate-700">
                  특성화고 및 특기자 전형 대비
                </p>
              </div>

              <div className="space-y-8">
                {/* 게임 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    게임 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(C)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#자료구조알고리즘")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 자료구조 / 알고리즘
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/시니어#특성화고특기자대비")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 특성화고 특기자 대비
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-300" />

                {/* 미디어 / 웹 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    미디어 / 웹 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(JavaScript)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() => navigate("/curriculum/주니어#디자인도구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 디자인 도구 - 퍼블리싱
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() => navigate("/curriculum/시니어#공모전")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 공모전 또는 생기부 프로젝트
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-300" />

                {/* 취창업 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    취·창업 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(Python)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() => navigate("/curriculum/주니어#비즈니스")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 비즈니스
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/시니어#특성화고특기자대비")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 특성화고 특기자 대비
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-300" />

                {/* 인공지능 / 데이터 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    인공지능 / 데이터 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(Python)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#자료구조알고리즘")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 자료구조 / 알고리즘
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() => navigate("/curriculum/시니어#기술스택")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 데이터 분석 또는 AI 프로젝트
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-400 my-12" />

            {/* 대학교 입시 (대입) */}
            <div className="mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                대학교 입시
              </h3>
              <div className="bg-slate-100 border-l-4 border-purple-500 p-4 mb-6">
                <p className="text-sm text-slate-700">
                  학생부 종합 전형 전공 역량 강화를 목표하여 입시 경쟁력을
                  향상합니다
                </p>
              </div>

              <div className="space-y-8">
                {/* 인공지능 / 데이터 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    인공지능 / 데이터 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(Python)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#자료구조알고리즘")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 자료구조 / 알고리즘
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/시니어#생기부프로젝트")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 생기부 프로젝트
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-300" />

                {/* 소프트웨어 / 개발 계열 */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">
                    소프트웨어 / 개발 계열
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => navigate("/curriculum/비기너#적성탐구")}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        1.
                      </span>
                      <span className="text-slate-700">
                        비기너 클래스 - 적성 탐구
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#프로그래밍언어")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        2.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 프로그래밍 언어(Java)
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/주니어#자료구조알고리즘")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-200"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        3.
                      </span>
                      <span className="text-slate-700">
                        주니어 클래스 - 자료구조 / 알고리즘
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate("/curriculum/시니어#생기부프로젝트")
                      }
                      className="flex items-center px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                    >
                      <span className="text-orange-600 font-medium mr-3">
                        4.
                      </span>
                      <span className="text-slate-700">
                        시니어 클래스 - 생기부 프로젝트
                      </span>
                      <span className="ml-auto text-slate-400">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CurriculumDefaultPage;
