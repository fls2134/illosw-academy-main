import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiInformationCircle,
  HiPhone,
  HiX,
} from "react-icons/hi";
import { IoMdCopy } from "react-icons/io";
import { useJsonp } from "../hooks/useJsonp";
import {
  Timetable,
  TimetableRaw,
  Class,
  Current,
  Student,
  SelectedTimeSlot,
  CalendarDayRow,
} from "../types";
import { formatTimeToAMPM } from "../utils/formatTime";
import { copyElementAsImageToClipboard } from "../utils/copyElementAsImageToClipboard";
import {
  COMPANY_NAME,
  CURRICULUM_STAGE_DEFAULT,
  CURRICULUM_STAGE_SHORT,
  KAKAO_TALK_LINK,
  PHONE_NUMBER,
  type CurriculumStageKey,
} from "../constants";

const PHONE_TEL_HREF = `tel:${PHONE_NUMBER.replace(/\D/g, "")}`;

/** class 시트 1행 기본 클래스 — 수강 0명일 때 모달 기본 선택 */
const DEFAULT_EMPTY_SLOT_CLASS_SERIAL = 1;

/** 슬롯 버튼: 진한 배경 + 흰 글자 (단계별 팔레트) */
const STAGE_ITEM_BG: Record<CurriculumStageKey, string> = {
  비기너: "bg-amber-500 text-white hover:bg-amber-600",
  주니어: "bg-green-500 text-white hover:bg-green-600",
  시니어: "bg-indigo-500 text-white hover:bg-indigo-600",
  특강: "bg-fuchsia-500 text-white hover:bg-fuchsia-600",
};

/** 복수 구분 그라데이션용 (Tailwind 팔레트에 맞춘 진한 톤) */
const STAGE_ITEM_BG_HEX: Record<CurriculumStageKey, string> = {
  비기너: "#f59e0b",
  주니어: "#22c55e",
  시니어: "#6366f1",
  특강: "#d946ef",
};

function slotStagesToItemSurface(stages: CurriculumStageKey[]): {
  className: string;
  style?: React.CSSProperties;
} {
  const ordered = CURRICULUM_STAGE_ORDER.filter((k) => stages.includes(k));
  if (ordered.length === 0) {
    return { className: STAGE_ITEM_BG[CURRICULUM_STAGE_DEFAULT] };
  }
  if (ordered.length === 1) {
    return { className: STAGE_ITEM_BG[ordered[0]] };
  }
  const stops = ordered.map((k) => STAGE_ITEM_BG_HEX[k]).join(", ");
  return {
    className:
      "text-white hover:brightness-110 transition-[filter] duration-150",
    style: { background: `linear-gradient(155deg, ${stops})` },
  };
}

const CURRICULUM_STAGE_ORDER: CurriculumStageKey[] = [
  "비기너",
  "주니어",
  "시니어",
  "특강",
];

type ApplyPageDataCache = {
  timetablesRaw: TimetableRaw[];
  classes: Class[];
  current: Current[];
  students: Student[];
  calendarClosedDateKeys: string[];
  calendarDataLoaded: boolean;
};

let applyPageDataCache: ApplyPageDataCache | null = null;

function categoryToStage(category: string): CurriculumStageKey | null {
  const c = (category ?? "").trim().toLowerCase();
  if (!c) return null;
  if (c.includes("비기너") || c.includes("beginner")) return "비기너";
  if (c.includes("주니어") || c.includes("junior")) return "주니어";
  if (c.includes("시니어") || c.includes("senior")) return "시니어";
  if (c.includes("특강") || c.includes("special")) return "특강";
  return null;
}

const dayMap: { [key: string]: string } = {
  mon: "Mo",
  tue: "Tu",
  wed: "We",
  thu: "Th",
  fri: "Fr",
  sat: "Sa",
  sun: "Su",
};

/** 일요일 시작(일~토) */
const CAL_WEEKDAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** YYYY-MM-DD — 휴무일 연동 시 동일 형식으로 `closedDateKeys`에 넣으면 됨 */
function calendarDateKey(
  year: number,
  monthIndex: number,
  day: number,
): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const DEFAULT_CLOSED_DATES: ReadonlySet<string> = new Set();

/** 주간 표 시간 열: `오전 9`, `오후 2`처럼 분 없이 오전·오후 + 시만 */
function formatTimetableHourLabel(timeStr: string): string {
  const parts = timeStr.split(":");
  const hours24 = parseInt(parts[0] ?? "", 10);
  if (Number.isNaN(hours24)) return timeStr;
  if (hours24 < 12) {
    const h12 = hours24 === 0 ? 12 : hours24;
    return `오전 ${h12}`;
  }
  if (hours24 === 12) {
    return "오후 12";
  }
  return `오후 ${hours24 - 12}`;
}

/** Date(year, monthIndex, day) → API 요일 키 (mon, tue, …) */
function timetableDayKeyFromCalendarDate(
  year: number,
  monthIndex: number,
  day: number,
): string {
  const wd = new Date(year, monthIndex, day).getDay();
  const keys: Record<number, string> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };
  return keys[wd] ?? "mon";
}

const WEEKDAY_LABELS_KO_FULL = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

function compareTimeStrings(a: string, b: string): number {
  const pa = a.split(":").map((x) => parseInt(x, 10));
  const pb = b.split(":").map((x) => parseInt(x, 10));
  const am = (pa[0] ?? 0) * 60 + (pa[1] ?? 0);
  const bm = (pb[0] ?? 0) * 60 + (pb[1] ?? 0);
  return am - bm;
}

/** 시간 문자열을 오전(h<12) / 오후(h>=12)로 분류 */
function splitTimesAmPm(times: string[]): { am: string[]; pm: string[] } {
  const am: string[] = [];
  const pm: string[] = [];
  for (const t of times) {
    const h = parseInt(t.split(":")[0] ?? "", 10);
    if (Number.isNaN(h)) continue;
    if (h < 12) am.push(t);
    else pm.push(t);
  }
  return { am, pm };
}

function uniqueSortedTimesForDay(
  timetables: Timetable[],
  dayKey: string,
): string[] {
  const k = dayKey.toLowerCase();
  const set = new Set<string>();
  for (const row of timetables) {
    if (row.day.toLowerCase() === k && row.time) {
      set.add(row.time.trim());
    }
  }
  return Array.from(set).sort(compareTimeStrings);
}

function getMonthDayCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const daysInMonth = last.getDate();
  const startPad = first.getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

type SchedulePaginatedMonthCalendarProps = {
  /** YYYY-MM-DD. 포함된 날짜는 휴무로 표시. 기본은 빈 Set(전체 운영일). */
  closedDateKeys?: ReadonlySet<string>;
  /** calendar JSONP 완료 후 true — 이전에는 카드 안을 스켈레톤만 표시 */
  calendarLoaded?: boolean;
  /** 주간 수업 일정표 데이터 — 날짜 클릭 시 해당 요일 시작 시간 표시 */
  timetables?: Timetable[];
  /** 이미지 복사 성공 시 상위 알림 */
  onCopySuccess?: () => void;
};

const DAY_MODAL_TIME_CHIP_CLASS =
  "inline-flex rounded-full bg-emerald-700/10 px-3 py-1.5 text-xs text-slate-900 md:text-sm";

function SchedulePaginatedMonthCalendar({
  closedDateKeys = DEFAULT_CLOSED_DATES,
  calendarLoaded = true,
  timetables = [],
  onCopySuccess,
}: SchedulePaginatedMonthCalendarProps) {
  const [now, setNow] = useState(() => new Date());
  const [page, setPage] = useState(0);
  const [dayModal, setDayModal] = useState<{
    year: number;
    monthIndex: number;
    day: number;
  } | null>(null);

  const monthCalCaptureRef = useRef<HTMLDivElement>(null);

  const handleCopyMonthScheduleImage = useCallback(async () => {
    try {
      await copyElementAsImageToClipboard(monthCalCaptureRef.current);
      onCopySuccess?.();
    } catch (e) {
      console.error(e);
      window.alert(
        "이미지를 클립보드에 복사하지 못했습니다.\nHTTPS 환경에서 다시 시도해 주세요.",
      );
    }
  }, [onCopySuccess]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!dayModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDayModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dayModal]);

  const months = useMemo(() => {
    const cur = new Date(now.getFullYear(), now.getMonth(), 1);
    const nxt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return [
      { year: cur.getFullYear(), monthIndex: cur.getMonth() },
      { year: nxt.getFullYear(), monthIndex: nxt.getMonth() },
    ];
  }, [now]);

  const { year, monthIndex } = months[page];
  const cells = getMonthDayCells(year, monthIndex);
  const title = new Date(year, monthIndex, 1).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const monthLabel = monthIndex + 1;

  const dayModalMeta = useMemo(() => {
    if (!dayModal) return null;
    const dk = timetableDayKeyFromCalendarDate(
      dayModal.year,
      dayModal.monthIndex,
      dayModal.day,
    );
    const times = uniqueSortedTimesForDay(timetables, dk);
    const { am, pm } = splitTimesAmPm(times);
    const wd = new Date(
      dayModal.year,
      dayModal.monthIndex,
      dayModal.day,
    ).getDay();
    const weekdayKo = WEEKDAY_LABELS_KO_FULL[wd];
    return { times, am, pm, weekdayKo };
  }, [dayModal, timetables]);

  return (
    <>
      <div className="mb-16 md:mb-20">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:mb-3">
          <h3 className="text-center text-xl font-bold text-slate-900 md:text-2xl">
            {monthLabel}월 월간 시간표
          </h3>
          <button
            type="button"
            disabled={!calendarLoaded}
            onClick={handleCopyMonthScheduleImage}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            title="클립보드에 이미지로 복사"
            aria-label="월간 시간표를 이미지로 클립보드에 복사"
          >
            <IoMdCopy className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
          </button>
        </div>
        <p className="mb-4 text-center text-sm text-slate-600 md:mb-5 md:text-base">
          클릭 시 해당 요일의 강의 시간표 확인 가능
        </p>
        <div className="relative overflow-hidden rounded-lg">
          <div
            ref={monthCalCaptureRef}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            {!calendarLoaded ? (
              <div aria-busy="true" aria-label="월간 일정 불러오는 중">
                <div className="mb-12 flex items-center justify-between gap-2">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200 animate-pulse" />
                  <div className="mx-2 h-5 min-w-0 flex-1 rounded bg-slate-200 animate-pulse" />
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200 animate-pulse" />
                </div>
                <div className="grid grid-cols-7 gap-0.5 md:gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={`sk-h-${i}`}
                      className="mb-1 h-4 rounded bg-slate-200 animate-pulse"
                    />
                  ))}
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={`sk-c-${i}`}
                      className="min-h-[3.25rem] rounded bg-slate-200 animate-pulse md:min-h-[3.75rem]"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="이전 달"
                  >
                    <HiChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <div className="min-w-0 flex-1 text-center text-sm font-semibold text-slate-800">
                    {title}
                  </div>
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.min(1, p + 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="다음 달"
                  >
                    <HiChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] md:gap-2 md:text-xs">
                  {CAL_WEEKDAY_HEADERS.map((d) => (
                    <div key={d} className="pb-1 font-medium text-slate-500">
                      {d}
                    </div>
                  ))}
                  {cells.map((day, i) => {
                    if (day == null) {
                      return (
                        <div
                          key={i}
                          className="flex min-h-[3.25rem] items-center justify-center rounded md:min-h-[3.75rem]"
                        />
                      );
                    }
                    const key = calendarDateKey(year, monthIndex, day);
                    const isClosed = closedDateKeys.has(key);
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded px-0.5 py-1 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-1 md:min-h-[3.75rem] ${
                          isClosed
                            ? "bg-red-700/10 text-slate-500 focus:ring-red-400"
                            : "bg-emerald-700/10 text-slate-800 focus:ring-emerald-500"
                        }`}
                        aria-label={`${day}일 ${isClosed ? "close" : "open"}, 이 요일 수업 시간표 보기`}
                        onClick={() => setDayModal({ year, monthIndex, day })}
                      >
                        <span className="text-[10px] font-medium leading-none md:text-xs">
                          {day}
                        </span>
                        <span
                          className={`text-[8px] font-medium uppercase leading-none tracking-wide md:text-[9px] ${
                            isClosed ? "text-red-600" : "text-emerald-700"
                          }`}
                        >
                          {isClosed ? "close" : "open"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {dayModal && dayModalMeta && (
            <div
              className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto rounded-lg bg-black/45 p-3 sm:p-4"
              onClick={() => setDayModal(null)}
              role="presentation"
            >
              <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="calendar-day-modal-title"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h4
                    id="calendar-day-modal-title"
                    className="text-base font-bold leading-snug text-slate-900 md:text-lg"
                  >
                    {dayModalMeta.weekdayKo} 수업 시간표
                  </h4>
                  <button
                    type="button"
                    onClick={() => setDayModal(null)}
                    className="shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="닫기"
                  >
                    <HiX className="h-6 w-6" aria-hidden />
                  </button>
                </div>

                {dayModalMeta.times.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    등록된 수업이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-5 text-sm text-slate-800">
                    {dayModalMeta.am.length > 0 && (
                      <div>
                        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          오전
                        </h5>
                        <ul className="flex flex-wrap gap-2">
                          {dayModalMeta.am.map((t) => (
                            <li key={t}>
                              <span className={DAY_MODAL_TIME_CHIP_CLASS}>
                                {formatTimeToAMPM(t)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dayModalMeta.pm.length > 0 && (
                      <div>
                        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          오후
                        </h5>
                        <ul className="flex flex-wrap gap-2">
                          {dayModalMeta.pm.map((t) => (
                            <li key={t}>
                              <span className={DAY_MODAL_TIME_CHIP_CLASS}>
                                {formatTimeToAMPM(t)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ApplyPage() {
  const { fetchJsonp } = useJsonp();

  const [timetablesRaw, setTimetablesRaw] = useState<TimetableRaw[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [current, setCurrent] = useState<Current[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<SelectedTimeSlot | null>(null);
  const [displayClasses, setDisplayClasses] = useState<Class[]>([]);
  const [selectedSlotIsFull, setSelectedSlotIsFull] = useState(false);
  const [calendarClosedDateKeys, setCalendarClosedDateKeys] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const [calendarDataLoaded, setCalendarDataLoaded] = useState(false);
  const [copyNoticeVisible, setCopyNoticeVisible] = useState(false);

  const hasFetchedTimetable = useRef(false);
  const loadingCount = useRef(0);
  const copyNoticeTimerRef = useRef<number | null>(null);

  const showCopyNotice = useCallback(() => {
    if (copyNoticeTimerRef.current !== null) {
      window.clearTimeout(copyNoticeTimerRef.current);
    }
    setCopyNoticeVisible(true);
    copyNoticeTimerRef.current = window.setTimeout(() => {
      setCopyNoticeVisible(false);
      copyNoticeTimerRef.current = null;
    }, 1800);
  }, []);

  async function handleCopyWeekScheduleImage() {
    try {
      const dayOrder = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
      const times: string[] = [];
      for (let hour = 9; hour <= 21; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }

      const byKey = new Map<string, Timetable>();
      timetables.forEach((tt) => {
        const dayKey = dayMap[tt.day.toLowerCase()] || tt.day;
        byKey.set(`${dayKey}-${tt.time}`, tt);
      });

      const uiWidth = 980;
      const uiHeight = 760;
      const dpr = Math.max(2, window.devicePixelRatio || 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(uiWidth * dpr);
      canvas.height = Math.floor(uiHeight * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("캔버스 컨텍스트를 만들 수 없습니다.");
      ctx.scale(dpr, dpr);

      const outerPad = 12;
      const timeColW = 58;
      const headerH = 34;
      const bodyH = uiHeight - outerPad * 2 - headerH;
      const rowH = bodyH / times.length;
      const dayW = (uiWidth - outerPad * 2 - timeColW) / dayOrder.length;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, uiWidth, uiHeight);

      // 테이블 외곽선
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        outerPad + 0.5,
        outerPad + 0.5,
        uiWidth - outerPad * 2 - 1,
        uiHeight - outerPad * 2 - 1,
      );

      // 수직 그리드
      for (let i = 0; i <= dayOrder.length; i++) {
        const x = outerPad + timeColW + i * dayW + 0.5;
        ctx.strokeStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.moveTo(x, outerPad);
        ctx.lineTo(x, uiHeight - outerPad);
        ctx.stroke();
      }

      // 수평 그리드
      for (let i = 0; i <= times.length; i++) {
        const y = outerPad + headerH + i * rowH + 0.5;
        ctx.strokeStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.moveTo(outerPad, y);
        ctx.lineTo(uiWidth - outerPad, y);
        ctx.stroke();
      }

      // 요일 헤더
      ctx.fillStyle = "#475569";
      ctx.font = "700 17px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      dayOrder.forEach((day, i) => {
        const x = outerPad + timeColW + i * dayW + dayW / 2;
        const y = outerPad + headerH / 2;
        ctx.fillText(day, x, y);
      });

      // 시간 라벨
      ctx.textAlign = "left";
      times.forEach((time, i) => {
        const y = outerPad + headerH + i * rowH + rowH / 2;
        const label = formatTimetableHourLabel(time);
        const [period, hourPart] = label.split(" ");
        ctx.font = "500 14px sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText(period, outerPad + 8, y);
        ctx.fillStyle = "#0f172a";
        ctx.fillText(hourPart, outerPad + 34, y);
      });

      // 슬롯 렌더
      timetables.forEach((tt) => {
        const dayKey = dayMap[tt.day.toLowerCase()] || tt.day;
        const dayIdx = dayOrder.indexOf(dayKey as (typeof dayOrder)[number]);
        const timeIdx = times.indexOf(tt.time);
        if (dayIdx < 0 || timeIdx < 0) return;

        const x = outerPad + timeColW + dayIdx * dayW + 2;
        const y = outerPad + headerH + timeIdx * rowH + 2;
        const w = dayW - 4;
        const h = rowH * 2 - 4;
        const r = 8;

        const stages = getSlotStageKeys(tt);
        const stageKeys =
          stages.length > 0 ? stages : [CURRICULUM_STAGE_DEFAULT];

        if (stageKeys.length === 1) {
          ctx.fillStyle = STAGE_ITEM_BG_HEX[stageKeys[0]];
        } else {
          const grad = ctx.createLinearGradient(x, y, x + w, y + h);
          stageKeys.forEach((k, idx) => {
            const stop = stageKeys.length === 1 ? 0 : idx / (stageKeys.length - 1);
            grad.addColorStop(stop, STAGE_ITEM_BG_HEX[k]);
          });
          ctx.fillStyle = grad;
        }

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        if (tt.is_new && !tt.is_full) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x + w - 10, y + 10, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "700 13px sans-serif";
        const lineH = 14;
        const startY = y + h / 2 - ((stageKeys.length - 1) * lineH) / 2;
        stageKeys.forEach((k, idx) => {
          ctx.fillText(CURRICULUM_STAGE_SHORT[k], x + w / 2, startY + idx * lineH);
        });
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png", 1);
      });
      if (!blob) throw new Error("이미지 생성에 실패했습니다.");
      if (!navigator.clipboard?.write) {
        throw new Error("클립보드 API를 사용할 수 없습니다.");
      }
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      showCopyNotice();
    } catch (e) {
      console.error(e);
      window.alert(
        "이미지를 클립보드에 복사하지 못했습니다.\nHTTPS 환경에서 다시 시도해 주세요.",
      );
    }
  }

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
      students.filter((s) => s.is_register === 1).map((s) => s.serial),
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

    if (applyPageDataCache) {
      setTimetableError(null);
      setTimetablesRaw(applyPageDataCache.timetablesRaw);
      setClasses(applyPageDataCache.classes);
      setCurrent(applyPageDataCache.current);
      setStudents(applyPageDataCache.students);
      setCalendarClosedDateKeys(new Set(applyPageDataCache.calendarClosedDateKeys));
      setCalendarDataLoaded(applyPageDataCache.calendarDataLoaded);
      setTimetableLoading(false);
      return;
    }

    setTimetableLoading(true);
    loadingCount.current = 5;

    fetchJsonp({
      action: "timetables",
      onSuccess: (data) => {
        const next = Array.isArray(data) ? data : [];
        setTimetablesRaw(next);
        applyPageDataCache = {
          ...(applyPageDataCache ?? {
            timetablesRaw: [],
            classes: [],
            current: [],
            students: [],
            calendarClosedDateKeys: [],
            calendarDataLoaded: false,
          }),
          timetablesRaw: next,
        };
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
        applyPageDataCache = {
          ...(applyPageDataCache ?? {
            timetablesRaw: [],
            classes: [],
            current: [],
            students: [],
            calendarClosedDateKeys: [],
            calendarDataLoaded: false,
          }),
          classes: activeClasses,
        };
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
        const next = Array.isArray(data) ? data : [];
        setCurrent(next);
        applyPageDataCache = {
          ...(applyPageDataCache ?? {
            timetablesRaw: [],
            classes: [],
            current: [],
            students: [],
            calendarClosedDateKeys: [],
            calendarDataLoaded: false,
          }),
          current: next,
        };
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
        const next = Array.isArray(data) ? data : [];
        setStudents(next);
        applyPageDataCache = {
          ...(applyPageDataCache ?? {
            timetablesRaw: [],
            classes: [],
            current: [],
            students: [],
            calendarClosedDateKeys: [],
            calendarDataLoaded: false,
          }),
          students: next,
        };
        updateTimetableLoading(-1);
      },
      onError: () => {
        setStudents([]);
        updateTimetableLoading(-1);
      },
    });

    fetchJsonp({
      action: "calendar",
      onSuccess: (data: CalendarDayRow[]) => {
        const next = new Set<string>();
        if (Array.isArray(data)) {
          for (const row of data) {
            if (!row?.date) continue;
            if (Number(row.open) === 0) {
              next.add(String(row.date));
            }
          }
        }
        setCalendarClosedDateKeys(next);
        setCalendarDataLoaded(true);
        applyPageDataCache = {
          ...(applyPageDataCache ?? {
            timetablesRaw: [],
            classes: [],
            current: [],
            students: [],
            calendarClosedDateKeys: [],
            calendarDataLoaded: false,
          }),
          calendarClosedDateKeys: [...next],
          calendarDataLoaded: true,
        };
        updateTimetableLoading(-1);
      },
      onError: () => {
        setCalendarClosedDateKeys(new Set());
        setCalendarDataLoaded(true);
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
        students.filter((s) => s.is_register === 1).map((s) => s.serial),
      );

      const dayKey = dayMap[day.toLowerCase()] || day;
      setSelectedTimeSlot({ day: dayKey, time });

      const matchingTimetables = timetables.filter(
        (t) => t.day.toLowerCase() === day.toLowerCase() && t.time === time,
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
          registeredStudentSerials.has(c.student_serial),
      );
      const classSerials = [
        ...new Set(matchingCurrent.map((c) => Number(c.class_serial))),
      ];

      let matchingClasses = classes.filter((cls) =>
        classSerials.includes(Number(cls.serial)),
      );

      const slotTimetable = timetables.find(
        (t) => Number(t.serial) === Number(timetableSerial),
      );
      setSelectedSlotIsFull(Boolean(slotTimetable?.is_full));
      if (
        matchingClasses.length === 0 &&
        slotTimetable &&
        slotTimetable.current_count === 0 &&
        !slotTimetable.is_full
      ) {
        const defaultClass =
          classes.find(
            (c) =>
              Number(c.serial) === DEFAULT_EMPTY_SLOT_CLASS_SERIAL &&
              c.is_active === 1,
          ) ??
          classes.find(
            (c) =>
              c.is_active === 1 &&
              categoryToStage(c.category) === "비기너" &&
              (c.class.includes("CSE") ||
                c.class.toLowerCase().includes("computer science")),
          );
        if (defaultClass) {
          matchingClasses = [defaultClass];
        }
      }

      setDisplayClasses(matchingClasses);
    },
    [timetables, current, classes, students],
  );

  const getSlotStageKeys = useCallback(
    (timetable: Timetable): CurriculumStageKey[] => {
      if (timetable.current_count === 0) {
        return [CURRICULUM_STAGE_DEFAULT];
      }
      const timetableSerials = new Set<number>();
      for (const t of timetables) {
        if (
          t.day.toLowerCase() === timetable.day.toLowerCase() &&
          t.time === timetable.time
        ) {
          timetableSerials.add(Number(t.serial));
        }
      }
      const registeredStudentSerials = new Set(
        students.filter((s) => s.is_register === 1).map((s) => s.serial),
      );
      const matchingCurrent = current.filter(
        (c) =>
          timetableSerials.has(Number(c.timetable_serial)) &&
          registeredStudentSerials.has(c.student_serial),
      );
      const classSerials = [
        ...new Set(matchingCurrent.map((c) => Number(c.class_serial))),
      ];
      const matchingClassRows = classes.filter((cls) =>
        classSerials.includes(Number(cls.serial)),
      );
      const stages = new Set<CurriculumStageKey>();
      for (const cls of matchingClassRows) {
        const s = categoryToStage(cls.category);
        if (s) stages.add(s);
      }
      if (stages.size === 0) {
        return [CURRICULUM_STAGE_DEFAULT];
      }
      return CURRICULUM_STAGE_ORDER.filter((k) => stages.has(k));
    },
    [timetables, current, classes, students],
  );

  const closeClassPickerModal = useCallback(() => {
    setSelectedTimeSlot(null);
    setDisplayClasses([]);
    setSelectedSlotIsFull(false);
  }, []);

  useEffect(() => {
    if (!selectedTimeSlot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeClassPickerModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedTimeSlot, closeClassPickerModal]);

  return (
    <div className="bg-white min-h-screen pt-40">
      <div className="relative">
        {timetableLoading && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-white/90 pt-16 backdrop-blur-sm md:pt-24"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"
              aria-hidden
            />
            <p className="mt-5 text-sm font-medium text-slate-700">
              시간표 정보를 불러오는 중입니다
            </p>
          </div>
        )}

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
            <>
              <SchedulePaginatedMonthCalendar
                closedDateKeys={calendarClosedDateKeys}
                calendarLoaded={calendarDataLoaded}
                timetables={timetables}
                onCopySuccess={showCopyNotice}
              />
              <h2 className="mb-2 text-center text-xl font-bold text-slate-900 md:mb-3 md:text-2xl">
                주간 수업 일정표
              </h2>
              <p className="mb-4 text-center text-sm text-slate-600 md:mb-5 md:text-base">
                클릭 시 해당 수업 상담 문의 가능
              </p>
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:p-4">
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
            </>
          ) : timetableError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 text-base font-medium mb-2">
                데이터를 불러오는 중 오류가 발생했습니다
              </p>
              <p className="text-red-600 text-sm">{timetableError}</p>
            </div>
          ) : (
            <>
              <SchedulePaginatedMonthCalendar
                closedDateKeys={calendarClosedDateKeys}
                calendarLoaded={calendarDataLoaded}
                timetables={timetables}
                onCopySuccess={showCopyNotice}
              />
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:mb-3">
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">
                  주간 수업 일정표
                </h2>
                <button
                  type="button"
                  onClick={handleCopyWeekScheduleImage}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  title="클립보드에 이미지로 복사"
                  aria-label="주간 수업 일정표를 이미지로 클립보드에 복사"
                >
                  <IoMdCopy className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
                </button>
              </div>
              <p className="mb-4 text-center text-sm text-slate-600 md:mb-5 md:text-base">
                클릭 시 해당 수업 상담 문의 가능
              </p>
              <div className="relative overflow-hidden rounded-lg">
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:p-4">
                  <div className="w-full overflow-x-auto">
                    <table
                      className="w-full border-collapse"
                      style={{ tableLayout: "fixed" }}
                    >
                      <colgroup>
                        <col style={{ width: "3rem" }} />
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                          (_, index) => (
                            <col
                              key={index}
                              style={{
                                width: "calc((100% - 3rem) / 7)",
                              }}
                            />
                          ),
                        )}
                      </colgroup>
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="p-0 pb-0.5 text-xs font-bold text-slate-600 md:pb-1 md:text-xs lg:pb-2 lg:text-sm"></th>
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                            (day) => (
                              <th
                                key={day}
                                className="text-xs md:text-xs lg:text-sm font-bold text-slate-600 text-center pb-0.5 md:pb-1 lg:pb-2 px-0 md:px-0.5 lg:px-1 border-l border-slate-200 first:border-l-0"
                              >
                                {day}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const dayOrder = [
                            "Mo",
                            "Tu",
                            "We",
                            "Th",
                            "Fr",
                            "Sa",
                            "Su",
                          ];
                          const times: string[] = [];
                          for (let hour = 9; hour <= 21; hour++) {
                            times.push(
                              `${hour.toString().padStart(2, "0")}:00`,
                            );
                          }

                          const gridData: { [key: string]: Timetable } = {};
                          timetables.forEach((timetable) => {
                            const dayKey =
                              dayMap[timetable.day.toLowerCase()] ||
                              timetable.day;
                            const key = `${dayKey}-${timetable.time}`;
                            gridData[key] = timetable;
                          });

                          const cellData: {
                            [key: string]: {
                              timetable: Timetable | null;
                              rowspan: number;
                            };
                          } = {};

                          times.forEach((time) => {
                            dayOrder.forEach((day) => {
                              const key = `${day}-${time}`;
                              cellData[key] = { timetable: null, rowspan: 1 };
                            });
                          });

                          timetables.forEach((timetable) => {
                            const dayKey =
                              dayMap[timetable.day.toLowerCase()] ||
                              timetable.day;
                            const key = `${dayKey}-${timetable.time}`;
                            cellData[key] = { timetable, rowspan: 2 };

                            const timeIndex = times.indexOf(timetable.time);
                            if (
                              timeIndex >= 0 &&
                              timeIndex < times.length - 1
                            ) {
                              const nextTime = times[timeIndex + 1];
                              const nextKey = `${dayKey}-${nextTime}`;
                              cellData[nextKey] = {
                                timetable: null,
                                rowspan: 0,
                              };
                            }
                          });

                          return times.map((time, timeIndex) => {
                            return (
                              <tr
                                key={time}
                                className={`h-9 md:h-10 lg:h-11 ${
                                  timeIndex < times.length - 1
                                    ? "border-b border-slate-100"
                                    : ""
                                }`}
                              >
                                <td className="h-9 whitespace-nowrap py-0 pl-0 pr-0 text-left align-middle text-[11px] font-normal tabular-nums text-slate-800 md:h-10 md:text-xs lg:h-11 lg:text-sm">
                                  {(() => {
                                    const label =
                                      formatTimetableHourLabel(time);
                                    const [period, hourPart] = label.split(" ");
                                    return (
                                      <>
                                        <span className="text-slate-500">
                                          {period}
                                        </span>{" "}
                                        <span className="text-slate-800">
                                          {hourPart}
                                        </span>
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
                                      ? "h-[4.5rem] md:h-20 lg:h-[5.5rem]"
                                      : "h-9 md:h-10 lg:h-11";

                                  if (!timetable) {
                                    return (
                                      <td
                                        key={day}
                                        className={`py-0 px-0 ${cellHeight} border-l border-slate-100`}
                                        rowSpan={rowspan}
                                      ></td>
                                    );
                                  }

                                  const slotStages =
                                    getSlotStageKeys(timetable);
                                  const stageKeysForDisplay =
                                    slotStages.length > 0
                                      ? slotStages
                                      : [CURRICULUM_STAGE_DEFAULT];
                                  const stageLabelSummary = stageKeysForDisplay
                                    .map((k) => CURRICULUM_STAGE_SHORT[k])
                                    .join(", ");

                                  const itemSurface =
                                    slotStagesToItemSurface(slotStages);

                                  return (
                                    <td
                                      key={day}
                                      className={`py-0 px-0 ${cellHeight} border-l border-slate-100 relative`}
                                      rowSpan={rowspan}
                                    >
                                      {timetable.is_new &&
                                        !timetable.is_full && (
                                          <span className="absolute top-1 right-1 z-10 h-2 w-2 rounded-full bg-white md:h-2.5 md:w-2.5"></span>
                                        )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleTimetableSelect(
                                            timetable.serial,
                                            timetable.day,
                                            timetable.time,
                                          )
                                        }
                                        style={itemSurface.style}
                                        className={`h-full w-full rounded-md text-[10px] md:text-[11px] lg:text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 ${itemSurface.className}`}
                                        aria-label={
                                          timetable.is_full
                                            ? `${timetable.day} ${timetable.time} 시간대, ${stageLabelSummary}, 정원 마감 (${timetable.current_count}/${timetable.fullcount})`
                                            : `${timetable.day} ${timetable.time} 시간대 선택, ${stageLabelSummary} (${timetable.current_count}/${timetable.fullcount})`
                                        }
                                      >
                                        <span className="flex flex-col items-center justify-center gap-0 px-0.5 py-0">
                                          {stageKeysForDisplay.map((key) => (
                                            <span
                                              key={key}
                                              data-copy-label="true"
                                              className="text-[10px] font-semibold leading-tight text-white drop-shadow-sm md:text-[11px] lg:text-xs"
                                            >
                                              {CURRICULUM_STAGE_SHORT[key]}
                                            </span>
                                          ))}
                                        </span>
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
                  <div
                    className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto rounded-lg bg-black/45 p-3 sm:p-4"
                    onClick={closeClassPickerModal}
                    role="presentation"
                  >
                    <div
                      className="max-h-[min(28rem,88%)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
                      onClick={(e) => e.stopPropagation()}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="class-picker-modal-title"
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <h3
                          id="class-picker-modal-title"
                          className="text-base font-bold text-slate-900 md:text-lg"
                        >
                          강의 선택
                        </h3>
                        <button
                          type="button"
                          onClick={closeClassPickerModal}
                          className="shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label="닫기"
                        >
                          <HiX className="h-6 w-6" aria-hidden />
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {displayClasses.map((cls) => (
                          <div
                            key={cls.serial}
                            className="space-y-3 py-5 first:pt-2 last:pb-0"
                          >
                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {cls.category}
                            </span>
                            <div className="text-base font-medium text-slate-900">
                              {cls.class}
                            </div>
                            {selectedSlotIsFull ? (
                              <button
                                type="button"
                                disabled
                                className="w-full cursor-not-allowed rounded-lg bg-slate-300/90 py-2.5 px-3 text-sm font-semibold text-slate-700 opacity-90"
                                aria-label={`${cls.class} 정원 마감`}
                              >
                                마감
                              </button>
                            ) : (
                              <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                <a
                                  href={KAKAO_TALK_LINK}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FEE500] py-2.5 px-3 text-sm font-semibold text-[#191919] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#FEE500]/80 focus:ring-offset-2"
                                  aria-label={`${cls.class} 카카오톡 채널로 상담 문의`}
                                >
                                  <svg
                                    className="h-5 w-5 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden
                                  >
                                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                                  </svg>
                                  카카오톡 채널 문의
                                </a>
                                <a
                                  href={PHONE_TEL_HREF}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                  aria-label={`전화 상담 ${PHONE_NUMBER}`}
                                >
                                  <HiPhone
                                    className="h-5 w-5 shrink-0 text-slate-600"
                                    aria-hidden
                                  />
                                  전화 상담
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTimeSlot && displayClasses.length === 0 && (
                  <div
                    className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto rounded-lg bg-black/45 p-3 sm:p-4"
                    onClick={closeClassPickerModal}
                    role="presentation"
                  >
                    <div
                      className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 text-center shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="class-picker-empty-title"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3
                          id="class-picker-empty-title"
                          className="text-base font-bold text-slate-900"
                        >
                          안내
                        </h3>
                        <button
                          type="button"
                          onClick={closeClassPickerModal}
                          className="shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label="닫기"
                        >
                          <HiX className="h-6 w-6" aria-hidden />
                        </button>
                      </div>
                      <HiInformationCircle className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                      <p className="mb-4 text-sm font-normal text-slate-600">
                        해당 시간대에 운영 중인 클래스가 없습니다.
                      </p>
                      {selectedSlotIsFull ? (
                        <button
                          type="button"
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-slate-300/90 py-2.5 px-3 text-sm font-semibold text-slate-700 opacity-90"
                          aria-label="정원 마감"
                        >
                          마감
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                          <a
                            href={KAKAO_TALK_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FEE500] py-2.5 px-3 text-sm font-semibold text-[#191919] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#FEE500]/80 focus:ring-offset-2"
                            aria-label="카카오톡 채널로 상담 문의"
                          >
                            <svg
                              className="h-5 w-5 shrink-0"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden
                            >
                              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                            </svg>
                            카카오톡 채널
                          </a>
                          <a
                            href={PHONE_TEL_HREF}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            aria-label={`전화 상담 ${PHONE_NUMBER}`}
                          >
                            <HiPhone
                              className="h-5 w-5 shrink-0 text-slate-600"
                              aria-hidden
                            />
                            전화 상담
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-center text-sm md:text-base font-semibold text-pink-500 max-w-3xl mx-auto mt-6 px-2">
                수업 시간표는 상담 요청에 따라 추가 및 변경이 가능합니다
              </p>
            </>
          )}
        </div>
      </div>
      {copyNoticeVisible && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">
          클립보드에 복사되었습니다
        </div>
      )}
    </div>
  );
}

export default ApplyPage;
