// 계산만 하는 작은 함수들. 화면도, 백엔드도 안 건드려.
import { HOURS } from './boxes';

// 날짜 두 개 사이의 일수를 구해. (to - from)
export function daysBetween(from: string, to: string): number {
  const start = new Date(from + 'T00:00:00').getTime();
  const end = new Date(to + 'T00:00:00').getTime();
  return Math.ceil((end - start) / 86400000);
}

// 일수 차이(diff)를 D-day 글자로 바꿔.
export function ddayTextFromDiff(diff: number): string {
  if (diff > 0) {
    return `D-${diff}`;
  }
  if (diff === 0) {
    return 'D-Day';
  }
  return `D+${-diff}`;
}

// 분을 "5H 50M" 모양으로 바꿔.
export function formatMinutes(mins: number): string {
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return `${hours}H ${rest}M`;
}

// 빈 타임테이블을 만들어. 18시간 × 6칸 = 108칸.
export function emptySlots(): (string | null)[] {
  return Array(HOURS.length * 6).fill(null);
}

// 타임테이블 배열을 DB에 보낼 문자열로 바꿔. ("react,,python,...")
export function slotsToString(slots: (string | null)[]): string {
  return slots.map((s) => s ?? '').join(',');
}

// DB 문자열을 타임테이블 배열로 되돌려.
export function slotsFromString(text: string): (string | null)[] {
  return text.split(',').map((v) => v || null);
}
