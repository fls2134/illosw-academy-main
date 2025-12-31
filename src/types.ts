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

