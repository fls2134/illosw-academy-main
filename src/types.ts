export interface Timetable {
  serial: number;
  day: string;
  time: string;
  is_new: boolean;
  fullcount: number;
  current_count: number;
  is_full: boolean;
}

export interface TimetableRaw {
  serial: number;
  day: string;
  time: string;
  is_new: boolean;
  fullcount: number;
}

export interface Class {
  serial: number;
  category: string;
  class: string;
  is_active: number;
}

export interface Current {
  student_serial: number;
  class_serial: number;
  timetable_serial: number;
}

export interface Student {
  serial: number;
  name: string;
  number: string;
  is_register: number;
}

export interface SelectedTimeSlot {
  day: string;
  time: string;
}

/** calendar 시트 JSONP 응답 행 — open: 1 운영, 0 휴무 */
export interface CalendarDayRow {
  date: string;
  open: number;
}

