import { useEffect, useState } from "react";
import posterImg from "../assets/img/poster-export.png";

const actionBtnClass =
  "flex-1 min-w-0 rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const APPLY_FORM_URL = "https://forms.gle/uE1q7DzmCXnyxKNy7";

const STORAGE_KEY = "poster-overlay-hide-until-ms";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** 6월 12일까지 표시 — 로컬 시간 기준 6월 13일 0시부터 비표시 */
function isCampaignActive(): boolean {
  return Date.now() < new Date(2026, 5, 13).getTime();
}

function readHideUntil(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function shouldShowOnMount(): boolean {
  if (typeof window === "undefined") return false;
  if (!isCampaignActive()) return false;
  const hideUntil = readHideUntil();
  if (hideUntil != null && Date.now() < hideUntil) return false;
  return true;
}

export default function PosterOverlay() {
  const [open, setOpen] = useState(shouldShowOnMount);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleHideOneDay = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + ONE_DAY_MS));
    } catch {
      /* ignore quota / private mode */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="공지 포스터"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col items-center">
        <img
          src={posterImg}
          alt=""
          className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-xl"
          draggable={false}
        />
        <div className="mt-5 flex w-full flex-col gap-3">
          <a
            href={APPLY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
          >
            참가 신청하기
          </a>
          <div className="flex w-full items-stretch gap-3">
            <button type="button" onClick={handleHideOneDay} className={actionBtnClass}>
              1일 동안 보지 않기
            </button>
            <button type="button" onClick={handleClose} className={actionBtnClass}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
