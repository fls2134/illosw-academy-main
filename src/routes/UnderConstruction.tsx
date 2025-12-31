import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import Footer from "../components/Footer";

function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-900">
      {/* 메인 컨텐츠 */}
      <div className="text-center max-w-2xl w-full flex-1 flex flex-col justify-center">
        {/* 중앙 아이콘 */}
        <div className="mb-8 sm:mb-12 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-white">
              <HiOutlineComputerDesktop className="w-12 h-12 sm:w-16 sm:h-16 text-slate-900" />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500 backdrop-blur-sm flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">
          페이지 점검중
        </h1>

        {/* 설명 텍스트 */}
        <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 sm:mb-12">
          현재 페이지를 수정 중입니다.
        </p>

        {/* 정보 박스 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 sm:p-8 text-left max-w-md mx-auto mb-6 sm:mb-8">
          <div className="space-y-3 text-sm sm:text-base text-white/90">
            <div>
              <span className="font-semibold">· 작업 내용:</span> 시스템 점검 및
              업데이트
            </div>
            <div>
              <span className="font-semibold">· 작업 영향:</span> 일시적인
              서비스 이용 제한
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default UnderConstruction;
