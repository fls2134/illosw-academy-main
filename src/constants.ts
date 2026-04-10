export const GOOGLE_SCRIPT_URL =
  (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbxyeuMO9Zab2LWQJOF71maSGLW9BNQfk3HDGQdhNw2Wa-Ygez_3pKhYZBQAJutisJvB/exec";

export const JSONP_TIMEOUT = 10000; // 10초

// 회사 정보
export const COMPANY_NAME =
  (import.meta as any).env?.VITE_COMPANY_NAME || "일로 SW 입시 연구소";

export const COMPANY_NAME_EN =
  (import.meta as any).env?.VITE_COMPANY_NAME_EN || "illo sw academy";

// 연락처 정보
export const PHONE_NUMBER =
  (import.meta as any).env?.VITE_PHONE_NUMBER || "010-2070-6774";

export const KAKAO_TALK_LINK =
  (import.meta as any).env?.VITE_KAKAO_TALK_LINK ||
  "https://open.kakao.com/o/sbrxUD6h";

export const BLOG_URL =
  (import.meta as any).env?.VITE_BLOG_URL ||
  "https://blog.naver.com/illosw-it-academy";

export const EMAIL_TO =
  (import.meta as any).env?.VITE_EMAIL_TO || "fls213444@gmail.com";

// 위치 정보
export const ADDRESS =
  (import.meta as any).env?.VITE_ADDRESS ||
  "경기 광명시 안현로 34 313동 208호";

export const NAVER_MAP_LINK =
  (import.meta as any).env?.VITE_NAVER_MAP_LINK ||
  "https://naver.me/I5yVp94h";

/** 커리큘럼 단계 URL·로직용 키 (마케팅 명칭과 매핑) */
export type CurriculumStageKey = "비기너" | "주니어" | "시니어" | "특강";

export const CURRICULUM_STAGE_DEFAULT: CurriculumStageKey = "비기너";

/** 카드·히어로 등 풀 네임 */
export const CURRICULUM_STAGE_FULL: Record<CurriculumStageKey, string> = {
  비기너: "비기너 클래스",
  주니어: "주니어 클래스",
  시니어: "시니어 클래스",
  특강: "특강",
};

/** 헤더 탭 등 짧은 라벨 */
export const CURRICULUM_STAGE_SHORT: Record<CurriculumStageKey, string> = {
  비기너: "비기너",
  주니어: "주니어",
  시니어: "시니어",
  특강: "특강",
};

// 강의 목록
export interface Course {
  id: number;
  title: string;
  thumbnail: string;
  link: string;
  category: string;
  description?: string;
}

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Python 기초",
    thumbnail: "/src/assets/img/courses/course-1.jpg",
    link: "/curriculum?tab=beginner&course=1",
    category: "beginner",
    description: "프로그래밍 입문자를 위한 파이썬 기초"
  },
  {
    id: 2,
    title: "Web 개발 입문",
    thumbnail: "/src/assets/img/courses/course-2.jpg",
    link: "/curriculum?tab=beginner&course=2",
    category: "beginner",
    description: "HTML, CSS, JavaScript 기초부터"
  },
  {
    id: 3,
    title: "알고리즘 심화",
    thumbnail: "/src/assets/img/courses/course-3.jpg",
    link: "/curriculum?tab=intermediate&course=1",
    category: "intermediate",
    description: "코딩테스트 대비 알고리즘"
  },
  {
    id: 4,
    title: "AI/ML 프로젝트",
    thumbnail: "/src/assets/img/courses/course-4.jpg",
    link: "/curriculum?tab=advanced&course=1",
    category: "advanced",
    description: "실전 인공지능 프로젝트"
  },
  {
    id: 5,
    title: "포트폴리오 개발",
    thumbnail: "/src/assets/img/courses/course-5.jpg",
    link: "/curriculum?tab=advanced&course=2",
    category: "advanced",
    description: "입시용 포트폴리오 완성"
  }
];

