import React, { useEffect, useRef } from 'react'
import { LiquidGlass } from '@liquidglass/react'

function MainPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const spots = [
      {
        // 가장 작은 하이라이트 (푸른빛)
        x: 0.18,
        y: 0.25,
        r: 200,
        color: 'oklab(0.4 -0.03 -0.12)', // 어두운 sky 블루
        vx: 0.005,
        vy: 0.0035,
      },
      {
        // 가장 큰 메인 스포트 (보라 계열)
        x: 0.78,
        y: 0.4,
        r: 400,
        color: 'oklab(0.3 0.10 -0.20)', // 어두운 퍼플
        vx: -0.003,
        vy: 0.0025,
      },
      {
        // 중간 크기, 에메랄드 느낌
        x: 0.45,
        y: 0.82,
        r: 490,
        color: 'oklab(0.4 -0.20 0.00)', // 어두운 그린/에메랄드 계열
        vx: 0.004,
        vy: -0.0045,
      },
      {
        // 앰버 계열, 상단 중앙 쪽
        x: 0.5,
        y: 0.1,
        r: 240,
        color: 'oklab(0.35 0.06 0.12)', // 따뜻한 앰버/골드 느낌
        vx: -0.0035,
        vy: 0.003,
      },
    ]

    let frameId: number

    const loop = () => {
      const { innerWidth: w, innerHeight: h } = window
      ctx.clearRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      ctx.filter = 'blur(80px)'

      for (const s of spots) {
        s.x += s.vx
        s.y += s.vy

        if (s.x < 0.05 || s.x > 0.95) s.vx *= -1
        if (s.y < 0.05 || s.y > 0.95) s.vy *= -1

        const cx = s.x * w
        const cy = s.y * h

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s.r)
        grad.addColorStop(0, s.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 text-white overflow-hidden">
      {/* Canvas 기반 블러 스포트라이트 레이어 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 w-full max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="block text-white drop-shadow-[0_0_18px_rgba(59,130,246,0.8)]">
            26년 SW 입시 설명회
          </span>
        </h1>

        {/* 리퀴드글래스 컨테이너 (공식 예제 스타일 참고) */}
        <div className="mt-10 flex justify-center">
          <div className="w-60 h-12">
            <LiquidGlass
              borderRadius={16}
              blur={0.9}
              contrast={1.2}
              saturation={1.2}
              className='bg-white/15'
            >
              <div className="h-full flex flex-col items-center justify-center gap-2">
                신청하기
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
