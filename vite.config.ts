import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages에 올릴 때 `<USER>.github.io/<REPO_NAME>/` 형태라면
  // 아래 base 값을 '/<REPO_NAME>/' 로 수정해 주세요.
  // 예: base: '/vite_test/',
  // base: '/vite_test/',
})


