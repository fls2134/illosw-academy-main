import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import LoadingPage from "../components/LoadingPage";
import { useJsonp } from "../hooks/useJsonp";
import {
  Timetable,
  TimetableRaw,
  Class,
  Current,
  Student,
  SelectedTimeSlot,
} from "../types";
import { formatTimeToAMPM } from "../utils/formatTime";

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
  const [timetablesRaw, setTimetablesRaw] = useState<TimetableRaw[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [current, setCurrent] = useState<Current[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<SelectedTimeSlot | null>(null);
  const [displayClasses, setDisplayClasses] = useState<Class[]>([]);
  const [selectedTimetableSerial, setSelectedTimetableSerial] = useState<
    number | null
  >(null);

  const hasFetched = useRef(false);
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

  const updateLoading = (increment: number) => {
    loadingCount.current += increment;
    if (loadingCount.current === 0) {
      setLoading(false);
    } else if (loadingCount.current > 0 && !loading) {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    loadingCount.current = 4;

    // Timetables
    fetchJsonp({
      action: "timetables",
      onSuccess: (data) => {
        setTimetablesRaw(data);
        updateLoading(-1);
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        updateLoading(-1);
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
        updateLoading(-1);
      },
      onError: () => {
        setClasses([]);
        updateLoading(-1);
      },
    });

    // Current
    fetchJsonp({
      action: "current",
      onSuccess: (data) => {
        setCurrent(Array.isArray(data) ? data : []);
        updateLoading(-1);
      },
      onError: () => {
        setCurrent([]);
        updateLoading(-1);
      },
    });

    // Students
    fetchJsonp({
      action: "students",
      onSuccess: (data) => {
        setStudents(Array.isArray(data) ? data : []);
        updateLoading(-1);
      },
      onError: () => {
        setStudents([]);
        updateLoading(-1);
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

  // 요일 순서
  const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // 시간대 생성 (10:00부터 21:00까지 1시간 단위)
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

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className="p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <header className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-700/50">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            일로SW입시연구소 시간표
          </h1>
        </header>

        {/* Description */}
        <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8">
          원하시는 시간대를 선택하여 강의를 신청해주세요
        </p>

        <div className="bg-white rounded-lg p-1 md:p-4">
          <div className="w-full">
            <table
              className="w-full border-collapse"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "70px", minWidth: "70px" }} />
                {dayOrder.map((_, index) => (
                  <col
                    key={index}
                    style={{
                      width: `calc((100% - 70px) / ${dayOrder.length})`,
                    }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-xs md:text-xs lg:text-sm font-bold text-gray-700 pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1"></th>
                  {dayOrder.map((day) => (
                    <th
                      key={day}
                      className="text-xs md:text-xs lg:text-sm font-bold text-gray-700 text-center pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1 border-l border-gray-100 first:border-l-0"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, timeIndex) => {
                  return (
                    <tr
                      key={time}
                      className={`h-7 md:h-7 lg:h-8 ${
                        timeIndex < times.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* 시간 라벨 */}
                      <td className="text-xs md:text-xs lg:text-sm font-normal py-0 px-1 text-left align-middle h-7 md:h-7 lg:h-8 whitespace-nowrap">
                        {(() => {
                          const formattedTime = formatTimeToAMPM(time);
                          const parts = formattedTime.split(" ");
                          const period = parts[0]; // "오전" 또는 "오후"
                          const timeStr = parts[1]; // "10:00"

                          const parts2 = time.split(":");
                          const hour = parseInt(parts2[0], 10);
                          const isAfternoon = hour >= 12;
                          const periodColor = isAfternoon
                            ? "text-rose-300"
                            : "text-blue-300";

                          return (
                            <>
                              <span className={periodColor}>{period}</span>{" "}
                              <span className="text-gray-900">{timeStr}</span>
                            </>
                          );
                        })()}
                      </td>

                      {/* 각 요일별 셀 */}
                      {dayOrder.map((day) => {
                        const key = `${day}-${time}`;
                        const cell = cellData[key];

                        // rowspan=0인 셀은 렌더링하지 않음 (이전 행의 rowspan=2가 차지)
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
                              className={`py-0 px-0 ${cellHeight} border-l border-gray-100`}
                              rowSpan={rowspan}
                            ></td>
                          );
                        }

                        let buttonClass = "";
                        let buttonText = "";

                        if (timetable.is_full) {
                          // 마감 - slate-300
                          buttonClass =
                            "bg-slate-300 text-slate-700 cursor-not-allowed";
                          buttonText = "마감";
                        } else {
                          // 인원이 차있는 항목 - slate 톤
                          buttonClass =
                            "bg-slate-700 text-white hover:bg-slate-600";
                          buttonText = `${timetable.current_count}/${timetable.fullcount}`;
                        }

                        return (
                          <td
                            key={day}
                            className={`py-0 px-0 ${cellHeight} border-l border-gray-100 relative`}
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
                              className={`h-full w-full rounded-lg text-xs md:text-xs lg:text-sm font-medium transition-colors ${buttonClass}`}
                            >
                              {buttonText}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 선택한 시간대의 클래스 정보 카드 */}
        {selectedTimeSlot && displayClasses.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayClasses.map((cls) => (
                <div
                  key={cls.serial}
                  className="bg-slate-800 backdrop-blur-sm rounded-lg p-4 border border-slate-700"
                >
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-200 bg-slate-700 rounded-full mb-3">
                    {cls.category}
                  </span>
                  <div className="text-base font-medium text-white mb-4">
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
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="bg-slate-800 backdrop-blur-sm rounded-lg p-4 border border-slate-700 text-center">
              <HiInformationCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <p className="text-sm text-slate-300 font-normal mb-4">
                해당 시간대에 운영 중인 클래스가 없습니다.
              </p>
              <button
                onClick={() => {
                  if (selectedTimetableSerial) {
                    navigate(`/form?timetable=${selectedTimetableSerial}`);
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                신청하러가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
