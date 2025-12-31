// 시간을 오전/오후 형식으로 변환하는 함수
export function formatTimeToAMPM(timeStr: string): string {
  if (!timeStr) return "";

  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;

  const hours24 = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours24) || isNaN(minutes)) return timeStr;

  let hours12 = hours24;
  let period = "오전";

  if (hours24 === 0) {
    hours12 = 12;
    period = "오전";
  } else if (hours24 === 12) {
    hours12 = 12;
    period = "오후";
  } else if (hours24 > 12) {
    hours12 = hours24 - 12;
    period = "오후";
  }

  return `${period} ${hours12}:${minutes.toString().padStart(2, "0")}`;
}

