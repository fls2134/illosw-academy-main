import React from "react";
import { FiPhone } from "react-icons/fi";
import { SiNaver } from "react-icons/si";
import logo from "../assets/img/logo.svg";
import {
  COMPANY_NAME,
  COMPANY_NAME_EN,
  PHONE_NUMBER,
  KAKAO_TALK_LINK,
  BLOG_URL,
} from "../constants";

function Footer() {
  return (
    <footer className="w-full mt-auto pt-12 pb-8 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* 로고 및 회사명 */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <img
                src={logo}
                alt={`${COMPANY_NAME} 로고`}
                className="w-6 sm:w-7 h-auto"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />
              <h3 className="text-sm sm:text-base font-bold text-white">
                {COMPANY_NAME}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/80">
              {COMPANY_NAME_EN}
            </p>
          </div>

          {/* 연락처 정보 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* 전화번호 */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white transition-colors"
              aria-label={`전화 걸기 ${PHONE_NUMBER}`}
            >
              <FiPhone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{PHONE_NUMBER}</span>
            </a>

            {/* 카카오톡 상담 */}
            <a
              href={KAKAO_TALK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white transition-colors"
              aria-label="카카오톡 상담하기"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
              </svg>
              <span>카카오톡 상담</span>
            </a>

            {/* 학원 블로그 */}
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white transition-colors"
              aria-label={`${COMPANY_NAME} 네이버 블로그 방문`}
            >
              <SiNaver className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>학원 블로그</span>
            </a>
          </div>

          {/* 저작권 */}
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} {COMPANY_NAME_EN}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

