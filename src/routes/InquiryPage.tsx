import React, { useState, useEffect } from "react";
import { COMPANY_NAME, GOOGLE_SCRIPT_URL } from "../constants";
import { formatPhoneNumber } from "../utils/formatPhone";

function InquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquiryChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
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
    <div className="bg-slate-50 min-h-screen pt-40">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            상담 문의
          </h1>
          <p className="text-sm md:text-xl text-slate-300">
            궁금한 사항이 있으시면 언제든지 문의해주세요
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
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
    </div>
  );
}

export default InquiryPage;
