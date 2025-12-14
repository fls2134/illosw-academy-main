# vite_test
🧪 vite github page 연동 테스트

## 프로젝트 소개
SW 입시 설명회 신청서 폼입니다. Google 스프레드시트에 자동으로 데이터를 저장합니다.

## 배포 방법

### 1. GitHub 저장소 생성
- GitHub에서 새 저장소를 생성하세요

### 2. base 경로 설정
`vite.config.ts`에서 저장소 이름에 맞게 base 경로를 수정하세요:
- 저장소 이름이 `vite_test`라면: `base: '/vite_test/'`
- 저장소 이름이 `사용자명.github.io`라면: `base: '/'`

### 3. 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

### 4. GitHub Pages 설정
1. GitHub 저장소로 이동
2. Settings > Pages
3. Source: "GitHub Actions" 선택
4. 저장

### 5. 자동 배포
- `main` 브랜치에 푸시하면 자동으로 배포됩니다
- Actions 탭에서 배포 상태를 확인할 수 있습니다

## 로컬 개발
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
```