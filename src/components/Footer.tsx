import React from "react";
import { FiPhone } from "react-icons/fi";
import logo from "../assets/img/logo.svg";

function Footer() {
  return (
    <footer className="w-full mt-auto pt-8 pb-6 border-t border-slate-700/50 bg-slate-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* 로고 및 회사명 */}
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3">
            <img
              src={logo}
              alt="로고"
              className="w-8 sm:w-10 h-auto"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(45%) sepia(8%) saturate(750%) hue-rotate(180deg) brightness(95%) contrast(88%)",
              }}
            />
            <p className="text-xs sm:text-sm text-slate-400">
              illo sw academy
            </p>
          </div>

          {/* 연락처 정보 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* 전화번호 */}
            <a
              href="tel:010-2070-6774"
              className="flex items-center gap-2 text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
            >
              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>010-2070-6774</span>
            </a>

            {/* 카카오톡 상담 */}
            <a
              href="https://open.kakao.com/o/sbrxUD6h"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm sm:text-base text-slate-300 hover:text-yellow-400 transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
              </svg>
              <span>카카오톡 상담</span>
            </a>
          </div>

          {/* 저작권 */}
          <p className="text-xs text-slate-500 text-center">
            © 2024 illo sw academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

