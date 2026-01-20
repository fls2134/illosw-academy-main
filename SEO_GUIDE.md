# SEO 등록 가이드

## ✅ 완료된 작업 (1단계)

### 메타 태그 추가
- `index.html`에 SEO 메타 태그 추가 완료
- Open Graph, Twitter Card 태그 추가
- 지역 정보(광명시) 태그 추가

### 파일 생성
- `public/robots.txt` 생성
- `public/sitemap.xml` 생성

---

## 📋 검색 엔진 등록 방법 (2단계)

### 1. Google Search Console 등록

#### 1-1. Google Search Console 접속
https://search.google.com/search-console

#### 1-2. 속성 추가
- URL 접두어 선택
- `https://fls2134.github.io/illosw-academy-main/` 입력

#### 1-3. 소유권 확인
**방법 1: HTML 파일 업로드 (추천)**
1. Google에서 제공하는 HTML 파일 다운로드
2. `public/` 폴더에 업로드
3. 파일 이름 예: `google1234567890abcdef.html`
4. Git commit & push
5. Google에서 "확인" 버튼 클릭

**방법 2: HTML 태그**
1. Google에서 제공하는 메타 태그 복사
2. `index.html`의 `<head>` 안에 추가
3. Git commit & push
4. Google에서 "확인" 버튼 클릭

#### 1-4. Sitemap 제출
1. 좌측 메뉴 "Sitemaps" 클릭
2. `https://fls2134.github.io/illosw-academy-main/sitemap.xml` 입력
3. "제출" 클릭

---

### 2. Naver Search Advisor 등록

⚠️ **중요: 현재 GitHub Pages 서브경로 URL은 네이버에 등록 불가**

네이버는 호스트 단위(도메인 단위)로만 등록을 받기 때문에 `https://fls2134.github.io/illosw-academy-main/` 같은 서브경로 URL은 등록이 불가능합니다.

**해결 방법:**
1. **커스텀 도메인 구매 (추천)**: 
   - 예: `illosw.com` (연간 1-2만원)
   - 도메인 구매처: [hosting.kr](https://www.hosting.kr), [gabia.com](https://www.gabia.com), [namecheap.com](https://www.namecheap.com)
   - GitHub Pages에 커스텀 도메인 연결 후 네이버 등록

2. **네이버 없이 운영**:
   - Google Search Console만으로도 충분
   - 한국 검색 시장에서 Google 점유율 약 30-40%

**커스텀 도메인 구매 후 네이버 등록 방법:**

#### 2-1. Naver Search Advisor 접속
https://searchadvisor.naver.com/

#### 2-2. 웹마스터 도구에서 사이트 등록
- 커스텀 도메인 입력 (예: `https://illosw.com`)
- "추가" 클릭

#### 2-3. 사이트 소유 확인
**방법 1: HTML 파일 업로드 (추천)**
1. Naver에서 제공하는 HTML 파일 다운로드
2. `public/` 폴더에 업로드
3. 파일 이름 예: `naver1234567890abcdef.html`
4. Git commit & push
5. Naver에서 "확인" 버튼 클릭

**방법 2: HTML 태그**
1. Naver에서 제공하는 메타 태그 복사
2. `index.html`의 `<head>` 안에 추가
3. Git commit & push
4. Naver에서 "확인" 버튼 클릭

#### 2-4. 사이트맵 제출
1. "요청" > "사이트맵 제출" 클릭
2. 커스텀 도메인의 sitemap.xml 입력
3. "확인" 클릭

---

## 📊 등록 후 확인 사항

### Google Search Console에서 확인
- **색인 생성**: 약 3-7일 소요
- **실적 리포트**: 사이트 방문 통계 확인
- **URL 검사**: 특정 페이지 색인 상태 확인

### Naver Search Advisor에서 확인
- **수집 현황**: 크롤링 현황 확인
- **검색 반영**: 약 1-2주 소요
- **사이트 최적화**: SEO 점수 확인

---

## 🎯 추가 최적화 권장사항

### 1. 구조화된 데이터 추가
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "일로 SW 입시 연구소",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "광명시",
    "addressRegion": "경기도",
    "addressCountry": "KR"
  },
  "telephone": "+82-10-XXXX-XXXX",
  "url": "https://fls2134.github.io/illosw-academy-main/"
}
```

### 2. Open Graph 이미지 추가 (선택 사항)
- `public/og-image.jpg` 파일 추가 (1200x630px 권장)
- 학원 로고나 대표 이미지 사용
- 추가 후 `index.html`에 메타 태그 추가:
  ```html
  <meta property="og:image" content="https://fls2134.github.io/illosw-academy-main/og-image.jpg" />
  <meta property="twitter:image" content="https://fls2134.github.io/illosw-academy-main/og-image.jpg" />
  ```

### 3. 블로그/네이버 카페 연동
- 블로그에서 사이트 링크 (백링크 확보)
- 정기적인 콘텐츠 업데이트

### 4. 로컬 비즈니스 등록
- Google My Business 등록
- Naver Place 등록
- Kakao Place 등록

---

## ⚠️ 주의사항

1. **중복 콘텐츠 방지**: 다른 사이트에 동일한 내용 게시 금지
2. **정기 업데이트**: 최소 월 1회 콘텐츠 업데이트 권장
3. **모바일 최적화**: 이미 완료됨 (반응형 디자인)
4. **페이지 속도**: GitHub Pages는 충분히 빠름

---

## 📝 체크리스트

### 필수 (현재 가능)
- [x] 메타 태그 및 SEO 설정 완료
- [x] robots.txt, sitemap.xml 생성
- [ ] Google Search Console 등록
- [ ] Google에 sitemap.xml 제출

### 선택 사항
- [ ] Open Graph 이미지 추가 (`public/og-image.jpg`, 1200x630px)

### 커스텀 도메인 구매 후 가능
- [ ] 커스텀 도메인 구매 및 연결
- [ ] Naver Search Advisor 등록
- [ ] Naver에 sitemap.xml 제출
- [ ] Naver Place 등록

**참고:** Google 등록만으로도 충분히 검색 노출됩니다. 네이버는 커스텀 도메인 구매 후 추가 가능합니다.

