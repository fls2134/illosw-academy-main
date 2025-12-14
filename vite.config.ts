import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages에 올릴 때 `<USER>.github.io/<REPO_NAME>/` 형태라면
  // 아래 base 값을 '/<REPO_NAME>/' 로 수정해 주세요.
  // 저장소 이름이 'vite_test'라면 base: '/vite_test/'
  // 저장소 이름이 사용자명.github.io라면 base: '/' (주석 처리)
  base: '/vite_test/', // 저장소 이름에 맞게 수정하세요
})


