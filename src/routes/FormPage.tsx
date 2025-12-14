import React, { useState } from 'react'

function FormPage() {
  // Google Apps Script 웹 앱 URL
  const GOOGLE_SCRIPT_URL = 
    (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL || 
    'https://script.google.com/macros/s/AKfycbxyeuMO9Zab2LWQJOF71maSGLW9BNQfk3HDGQdhNw2Wa-Ygez_3pKhYZBQAJutisJvB/exec'

  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    school: '',
    studentType: '',
    grade: '',
    content: '',
  })

  const [errors, setErrors] = useState({
    phone: '',
    name: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // 필수 필드 에러 초기화
    if (name === 'phone' || name === 'name') {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    const newErrors = {
      phone: '',
      name: '',
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.'
    }
    if (!formData.name.trim()) {
      newErrors.name = '신청인 성함을 입력해주세요.'
    }

    setErrors(newErrors)

    // 에러가 없으면 제출
    if (!newErrors.phone && !newErrors.name) {
      if (!GOOGLE_SCRIPT_URL) {
        setSubmitMessage({
          type: 'error',
          text: 'Google Apps Script URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.'
        })
        return
      }

      setIsSubmitting(true)
      setSubmitMessage(null)

      try {
        // POST 방식으로 전송 (더 확실한 방법)
        // Google Apps Script는 POST를 더 잘 지원합니다
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // CORS 문제 우회
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        // no-cors 모드에서는 response를 읽을 수 없지만, 요청은 전송됨
        // Google Apps Script가 데이터를 받아서 처리함
        setSubmitMessage({
          type: 'success',
          text: '신청이 완료되었습니다!'
        })
        // 폼 초기화
        setFormData({
          phone: '',
          name: '',
          school: '',
          studentType: '',
          grade: '',
          content: '',
        })
        setIsSubmitting(false)
      } catch (error) {
        console.error('Submit error:', error)
        setSubmitMessage({
          type: 'error',
          text: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8">
          신청서 작성
        </h1>

        <div className="bg-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 전화번호 (필수) */}
            <div>
              <label htmlFor="phone" className="block text-white font-semibold mb-2">
                전화번호 <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                  errors.phone ? 'border-red-400' : 'border-white/20'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* 신청인 성함 (필수) */}
            <div>
              <label htmlFor="name" className="block text-white font-semibold mb-2">
                신청인 성함 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                  errors.name ? 'border-red-400' : 'border-white/20'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* 학생 학교 */}
            <div>
              <label htmlFor="school" className="block text-white font-semibold mb-2">
                학생 학교
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="예: 서울고등학교"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 학생 구분 */}
            <div>
              <label htmlFor="studentType" className="block text-white font-semibold mb-2">
                학생 구분
              </label>
              <select
                id="studentType"
                name="studentType"
                value={formData.studentType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-slate-800">선택해주세요</option>
                <option value="middle" className="bg-slate-800">중학생</option>
                <option value="high" className="bg-slate-800">고등학생</option>
              </select>
            </div>

            {/* 학생 학년 */}
            <div>
              <label htmlFor="grade" className="block text-white font-semibold mb-2">
                학생 학년
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-slate-800">선택해주세요</option>
                <option value="prep1" className="bg-slate-800">예비 1학년</option>
                <option value="1" className="bg-slate-800">1학년</option>
                <option value="2" className="bg-slate-800">2학년</option>
              </select>
            </div>

            {/* 상담/설명회에서 듣고싶은 내용 */}
            <div>
              <label htmlFor="content" className="block text-white font-semibold mb-2">
                상담/설명회에서 듣고싶은 내용
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="궁금한 내용을 입력해주세요"
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* 제출 메시지 */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-500/20 border border-green-500 text-green-300'
                    : 'bg-red-500/20 border border-red-500 text-red-300'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
              >
                {isSubmitting ? '제출 중...' : '제출하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormPage
