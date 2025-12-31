import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import LoadingPage from "../components/LoadingPage";
import { useJsonp } from "../hooks/useJsonp";
import { GOOGLE_SCRIPT_URL } from "../constants";
import { Class } from "../types";

function FormPage() {
  const navigate = useNavigate();
  const { fetchJsonp } = useJsonp();
  const [searchParams] = useSearchParams();
  const timetableSerial = searchParams.get("timetable");
  const classSerial = searchParams.get("class");

  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    category: "",
    class_serial: "",
  });

  useEffect(() => {
    if (!timetableSerial) {
      navigate("/");
      return;
    }
    fetchClasses();
  }, [timetableSerial, navigate]);

  const fetchClasses = () => {
    setLoading(true);
    setError(null);

    fetchJsonp({
      action: "classes",
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          // is_active=1인 클래스만 필터링
          const activeClasses = data.filter(
            (cls: Class) => cls.is_active === 1
          );
          setAllClasses(activeClasses);

          // class 파라미터가 있으면 해당 클래스의 카테고리를 자동 선택
          if (classSerial) {
            const selectedClass = activeClasses.find(
              (cls: Class) => cls.serial === Number(classSerial)
            );
            if (selectedClass) {
              setFormData((prev) => ({
                ...prev,
                category: selectedClass.category,
                class_serial: selectedClass.serial.toString(),
              }));
              // 해당 카테고리의 클래스들만 표시
              const categoryClasses = activeClasses.filter(
                (cls: Class) => cls.category === selectedClass.category
              );
              setAvailableClasses(categoryClasses);
            } else {
              setAvailableClasses([]);
            }
          } else {
            setAvailableClasses([]);
          }
        } else {
          setError("클래스를 불러오는데 실패했습니다.");
        }
        setLoading(false);
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setLoading(false);
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // 카테고리가 변경되면 클래스 선택 초기화
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        class_serial: "",
      }));

      // 선택한 카테고리의 클래스만 필터링
      if (value) {
        const categoryClasses = allClasses.filter(
          (cls) => cls.category === value
        );
        setAvailableClasses(categoryClasses);
      } else {
        setAvailableClasses([]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 카테고리 목록 (중등부, 고등부)
  const categories = Array.from(
    new Set(allClasses.map((cls) => cls.category))
  ).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.number ||
      !formData.category ||
      !formData.class_serial
    ) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!timetableSerial) {
      setError("시간표가 선택되지 않았습니다.");
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
          action: "register",
          name: formData.name,
          number: formData.number,
          class_serial: parseInt(formData.class_serial),
          timetable_serial: parseInt(timetableSerial),
        }),
      });

      // no-cors 모드에서는 response를 읽을 수 없지만 요청은 전송됨
      setSuccess(true);
      setFormData({
        name: "",
        number: "",
        category: "",
        class_serial: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("제출 중 오류가 발생했습니다.");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (success) {
    return (
      <div className="p-2 md:p-4 min-h-[60vh] flex items-center justify-center">
        <div className="bg-slate-800 backdrop-blur-sm rounded-lg p-6 border border-slate-700 text-center max-w-md">
          <p className="text-white text-lg font-medium mb-4">
            등록이 완료되었습니다!
          </p>
          <p className="text-slate-300 text-sm">
            잠시 후 메인 페이지로 이동합니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 영역 */}
        <header className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-8 h-8 text-slate-300 hover:text-white transition-colors group"
            >
              <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              강의 신청
            </h1>
          </div>
        </header>

        {/* Description */}
        <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8">
          원하시는 강의를 선택하고 정보를 입력해주세요
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-slate-800 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="이름을 입력해주세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="전화번호를 입력해주세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                카테고리 선택
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={classSerial !== null}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">선택해주세요</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                클래스 선택
              </label>
              <select
                name="class_serial"
                value={formData.class_serial}
                onChange={handleChange}
                required
                disabled={
                  !formData.category ||
                  (classSerial !== null && availableClasses.length === 1)
                }
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">선택해주세요</option>
                {availableClasses.map((classItem) => (
                  <option key={classItem.serial} value={classItem.serial}>
                    {classItem.class}
                  </option>
                ))}
              </select>
              {!formData.category && (
                <p className="mt-2 text-xs text-slate-400">
                  먼저 카테고리를 선택해주세요.
                </p>
              )}
              {classSerial !== null && availableClasses.length === 1 && (
                <p className="mt-2 text-xs text-slate-400">
                  운영 중인 클래스가 선택되어 있습니다.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {submitting ? "제출 중..." : "제출하기"}
            </button>

            {/* 안내 메시지 */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-300 text-center leading-relaxed">
                <span className="font-semibold text-green-400">
                  신청 후 2영업일 안으로
                </span>
                <br />
                작성해주신 번호로 직접 연락드리겠습니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
