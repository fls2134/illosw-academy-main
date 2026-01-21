# 일로 SW 입시 연구소 메인 페이지

학원 홈페이지 + Google Sheets 연동 상담/수강신청 시스템

## 주요 기능
- 반응형 메인 페이지 (모바일/데스크톱 최적화)
- 상담 문의 폼 (Google Sheets 자동 저장)
- 수강 신청 폼 (Google Sheets 연동)
- SEO 최적화 (Google/Naver 검색 노출)

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS
- Google Apps Script
- GitHub Pages

## 프로젝트 구조
```
├── src/
│   ├── routes/        # 페이지 (MainPage, FormPage)
│   ├── components/    # 컴포넌트 (Header, Footer)
│   ├── assets/        # 이미지 파일
│   └── constants.ts   # 환경 변수
├── public/            # 정적 파일
├── docs/              # 가이드 문서
├── google-apps-script.js.example  # Apps Script 템플릿
└── env.example        # 환경 변수 템플릿

```

## 시작하기

### 1. 환경 변수 설정
```bash
cp env.example .env
```

### 2. 패키지 설치 & 실행
```bash
npm install
npm run dev
```

### 3. 빌드 & 배포
```bash
npm run build
git push
```

## 문서
- `docs/seo-guide.md` - SEO 등록 체크리스트
- `docs/checklist-annual.md` - 연간 점검 항목

## 라이선스
Private Project

