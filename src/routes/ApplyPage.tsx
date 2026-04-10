import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
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
import { COMPANY_NAME } from "../constants";

const dayMap: { [key: string]: string } = {
  mon: "Mo",
  tue: "Tu",
  wed: "We",
  thu: "Th",
  fri: "Fr",
  sat: "Sa",
  sun: "Su",
};

function ApplyPage() {
  const navigate = useNavigate();
  const { fetchJsonp } = useJsonp();

  const [timetablesRaw, setTimetablesRaw] = useState<TimetableRaw[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [current, setCurrent] = useState<Current[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<SelectedTimeSlot | null>(null);
  const [displayClasses, setDisplayClasses] = useState<Class[]>([]);
  const [selectedTimetableSerial, setSelectedTimetableSerial] = useState<number | null>(null);

  const hasFetchedTimetable = useRef(false);
  const loadingCount = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timetables: Timetable[] = useMemo(() => {
    if (
      !Array.isArray(timetablesRaw) ||
      !Array.isArray(current) ||
      !Array.isArray(students)
    ) {
      return [];
    }

    const registeredStudentSerials = new Set(
      students.filter((s) => s.is_register === 1).map((s) => s.serial)
    );

    const timetableCounts: { [key: number]: number } = {};
    current.forEach((c) => {
      if (registeredStudentSerials.has(c.student_serial)) {
        const serial = Number(c.timetable_serial);
        if (serial) {
          timetableCounts[serial] = (timetableCounts[serial] || 0) + 1;
        }
      }
    });

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

  const updateTimetableLoading = (increment: number) => {
    loadingCount.current += increment;
    if (loadingCount.current === 0) {
      setTimetableLoading(false);
    } else if (loadingCount.current > 0 && !timetableLoading) {
      setTimetableLoading(true);
    }
  };

  useEffect(() => {
    if (hasFetchedTimetable.current) return;
    hasFetchedTimetable.current = true;

    setTimetableLoading(true);
    loadingCount.current = 4;

    fetchJsonp({
      action: "timetables",
      onSuccess: (data) => {
        setTimetablesRaw(data);
        updateTimetableLoading(-1);
      },
      onError: (errorMsg) => {
        setTimetableError(errorMsg);
        updateTimetableLoading(-1);
      },
    });

    fetchJsonp({
      action: "classes",
      onSuccess: (data) => {
        const activeClasses = Array.isArray(data)
          ? data.filter((cls: Class) => cls.is_active === 1)
          : [];
        setClasses(activeClasses);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setClasses([]);
        updateTimetableLoading(-1);
      },
    });

    fetchJsonp({
      action: "current",
      onSuccess: (data) => {
        setCurrent(Array.isArray(data) ? data : []);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setCurrent([]);
        updateTimetableLoading(-1);
      },
    });

    fetchJsonp({
      action: "students",
      onSuccess: (data) => {
        setStudents(Array.isArray(data) ? data : []);
        updateTimetableLoading(-1);
      },
      onError: () => {
        setStudents([]);
        updateTimetableLoading(-1);
      },
    });
  }, [fetchJsonp]);

  const handleTimetableSelect = useCallback(
    (timetableSerial: number, day: string, time: string) => {
      if (
        !Array.isArray(timetables) ||
        !Array.isArray(current) ||
        !Array.isArray(classes) ||
        !Array.isArray(students)
      ) {
        return;
      }

      const registeredStudentSerials = new Set(
        students.filter((s) => s.is_register === 1).map((s) => s.serial)
      );

      setSelectedTimetableSerial(timetableSerial);

      const dayKey = dayMap[day.toLowerCase()] || day;
      setSelectedTimeSlot({ day: dayKey, time });

      const matchingTimetables = timetables.filter(
        (t) => t.day.toLowerCase() === day.toLowerCase() && t.time === time
      );
      const timetableSerials = [
        ...new Set([
          ...matchingTimetables.map((t) => Number(t.serial)),
          Number(timetableSerial),
        ]),
      ];

      const matchingCurrent = current.filter(
        (c) =>
          timetableSerials.includes(Number(c.timetable_serial)) &&
          registeredStudentSerials.has(c.student_serial)
      );
      const classSerials = [
        ...new Set(matchingCurrent.map((c) => Number(c.class_serial))),
      ];

      const matchingClasses = classes.filter((cls) =>
        classSerials.includes(Number(cls.serial))
      );
      setDisplayClasses(matchingClasses);
    },
    [timetables, current, classes, students]
  );

  return (
    <div className="bg-white min-h-screen pt-40">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            시간표
          </h1>
          <p className="text-sm md:text-xl text-slate-300">
            원하시는 시간대를 선택하여 세부 강의 상담 문의가 가능합니다
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {timetableLoading ? (
          <div className="bg-slate-50 rounded-lg p-1 md:p-4 border border-slate-200 shadow-sm">
            <div className="w-full overflow-x-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="space-y-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-7 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : timetableError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 text-base font-medium mb-2">
              데이터를 불러오는 중 오류가 발생했습니다
            </p>
            <p className="text-red-600 text-sm">{timetableError}</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 rounded-lg p-1 md:p-4 border border-slate-200 shadow-sm">
              <div className="w-full overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ tableLayout: "fixed" }}
                >
                  <colgroup>
                    <col style={{ width: "70px", minWidth: "70px" }} />
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                      (_, index) => (
                        <col
                          key={index}
                          style={{
                            width: `calc((100% - 70px) / 7)`,
                          }}
                        />
                      )
                    )}
                  </colgroup>
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-xs md:text-xs lg:text-sm font-bold text-slate-700 pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1"></th>
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                        (day) => (
                          <th
                            key={day}
                            className="text-xs md:text-xs lg:text-sm font-bold text-slate-700 text-center pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1 border-l border-slate-200 first:border-l-0"
                          >
                            {day}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
                      const times: string[] = [];
                      for (let hour = 9; hour <= 21; hour++) {
                        times.push(`${hour.toString().padStart(2, "0")}:00`);
                      }

                      const gridData: { [key: string]: Timetable } = {};
                      timetables.forEach((timetable) => {
                        const dayKey = dayMap[timetable.day.toLowerCase()] || timetable.day;
                        const key = `${dayKey}-${timetable.time}`;
                        gridData[key] = timetable;
                      });

                      const cellData: {
                        [key: string]: { timetable: Timetable | null; rowspan: number };
                      } = {};

                      times.forEach((time) => {
                        dayOrder.forEach((day) => {
                          const key = `${day}-${time}`;
                          cellData[key] = { timetable: null, rowspan: 1 };
                        });
                      });

                      timetables.forEach((timetable) => {
                        const dayKey = dayMap[timetable.day.toLowerCase()] || timetable.day;
                        const key = `${dayKey}-${timetable.time}`;
                        cellData[key] = { timetable, rowspan: 2 };

                        const timeIndex = times.indexOf(timetable.time);
                        if (timeIndex >= 0 && timeIndex < times.length - 1) {
                          const nextTime = times[timeIndex + 1];
                          const nextKey = `${dayKey}-${nextTime}`;
                          cellData[nextKey] = { timetable: null, rowspan: 0 };
                        }
                      });

                      return times.map((time, timeIndex) => {
                        return (
                          <tr
                            key={time}
                            className={`h-7 md:h-7 lg:h-8 ${
                              timeIndex < times.length - 1
                                ? "border-b border-slate-200"
                                : ""
                            }`}
                          >
                            <td className="text-xs md:text-xs lg:text-sm font-normal py-0 px-1 text-left align-middle h-7 md:h-7 lg:h-8 whitespace-nowrap">
                              {(() => {
                                const formattedTime = formatTimeToAMPM(time);
                                const parts = formattedTime.split(" ");
                                const period = parts[0];
                                const timeStr = parts[1];

                                const parts2 = time.split(":");
                                const hour = parseInt(parts2[0], 10);
                                const isAfternoon = hour >= 12;
                                const periodColor = isAfternoon
                                  ? "text-rose-500"
                                  : "text-blue-500";

                                return (
                                  <>
                                    <span className={periodColor}>{period}</span>{" "}
                                    <span className="text-slate-900">{timeStr}</span>
                                  </>
                                );
                              })()}
                            </td>

                            {dayOrder.map((day) => {
                              const key = `${day}-${time}`;
                              const cell = cellData[key];

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
                                    className={`py-0 px-0 ${cellHeight} border-l border-slate-200`}
                                    rowSpan={rowspan}
                                  ></td>
                                );
                              }

                              let buttonClass = "";
                              let buttonText = "";

                              if (timetable.is_full) {
                                buttonClass =
                                  "bg-slate-300 text-slate-700 cursor-not-allowed";
                                buttonText = "마감";
                              } else {
                                buttonClass =
                                  "bg-slate-700 text-white hover:bg-slate-600";
                                buttonText = `${timetable.current_count}/${timetable.fullcount}`;
                              }

                              return (
                                <td
                                  key={day}
                                  className={`py-0 px-0 ${cellHeight} border-l border-slate-200 relative`}
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
                                    className={`h-full w-full rounded-lg text-xs md:text-xs lg:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${buttonClass}`}
                                    aria-label={
                                      timetable.is_full
                                        ? `${timetable.day} ${timetable.time} 시간대 마감됨`
                                        : `${timetable.day} ${timetable.time} 시간대 선택 (${timetable.current_count}/${timetable.fullcount})`
                                    }
                                  >
                                    {buttonText}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedTimeSlot && displayClasses.length > 0 && (
              <div className="mt-6">
                <div className="space-y-4">
                  {displayClasses.map((cls) => (
                    <div
                      key={cls.serial}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm w-full"
                    >
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-200 rounded-full mb-3">
                        {cls.category}
                      </span>
                      <div className="text-base font-medium text-slate-900 mb-4">
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
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label={`${cls.class} 신청하기`}
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
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                  <HiInformationCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <p className="text-sm text-slate-600 font-normal mb-4">
                    해당 시간대에 운영 중인 클래스가 없습니다.
                  </p>
                  <button
                    onClick={() => {
                      if (selectedTimetableSerial) {
                        navigate(`/form?timetable=${selectedTimetableSerial}`);
                      }
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="강의 신청 페이지로 이동"
                  >
                    신청하러가기
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ApplyPage;
