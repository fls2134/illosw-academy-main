import React, { useEffect } from "react";
import { HiArrowRight } from "react-icons/hi";
import { COMPANY_NAME, NAVER_MAP_LINK } from "../constants";
import location from "../assets/img/location.png";
import academy1 from "../assets/img/academy-1.jpg";
import academy2 from "../assets/img/academy-2.jpg";

function LocationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-40">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            위치
          </h1>
          <p className="text-sm md:text-xl text-slate-300">
            {COMPANY_NAME}를 찾아오시는 길
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mx-auto mb-8 max-w-3xl rounded-lg border border-slate-200 bg-slate-50 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-slate-700 md:text-base">
            {COMPANY_NAME}는 광명, 하안, 철산, 소하 지역에서 코딩학원을 찾는
            학생·학부모가 편하게 방문할 수 있도록 접근성 좋은 위치에서 운영되고
            있습니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            상담 예약 후 방문하시면 진로 목표와 현재 학습 수준을 기준으로 맞춤형
            커리큘럼을 안내해 드립니다.
          </p>
        </div>
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
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={academy1}
              alt={`${COMPANY_NAME} 강의실 내부 1`}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={academy2}
              alt={`${COMPANY_NAME} 강의실 내부 2`}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
