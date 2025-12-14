# GitHub Pages 배포 가이드

## 1단계: GitHub 저장소 생성
1. GitHub에 로그인
2. 우측 상단의 "+" 버튼 클릭 > "New repository"
3. 저장소 이름 입력 (예: `vite_test`)
4. Public 또는 Private 선택
5. "Create repository" 클릭

## 2단계: base 경로 확인
`vite.config.ts` 파일에서 저장소 이름에 맞게 base 경로를 확인하세요:
- 저장소 이름이 `vite_test`라면: `base: '/vite_test/'` (현재 설정)
- 저장소 이름이 다르면 해당 이름으로 수정

## 3단계: Git 초기화 및 푸시

터미널에서 프로젝트 폴더로 이동 후:

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: SW 입시 설명회 신청서 폼"

# 브랜치를 main으로 변경
git branch -M main

# GitHub 저장소 연결 (저장소 URL로 변경하세요)
git remote add origin https://github.com/사용자명/저장소명.git

# 코드 푸시
git push -u origin main
```

## 4단계: GitHub Pages 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - "Deploy from a branch" 대신 **"GitHub Actions"** 선택
5. 저장 (Save)

## 5단계: 자동 배포 확인

1. 저장소의 **Actions** 탭으로 이동
2. "Deploy to GitHub Pages" 워크플로우가 실행되는지 확인
3. 약 1-2분 후 완료되면:
   - **Settings > Pages**에서 배포된 URL 확인
   - URL 형식: `https://사용자명.github.io/저장소명/`

## 이후 업데이트

코드를 수정하고 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "업데이트 내용"
git push
```

## 주의사항

- Google Apps Script URL은 환경 변수로 관리하는 것을 권장합니다
- 프로덕션 환경에서는 `.env` 파일을 사용하지 말고, GitHub Secrets를 사용하세요
- 현재는 코드에 직접 URL이 하드코딩되어 있으니, 보안을 위해 환경 변수로 변경하는 것을 권장합니다

