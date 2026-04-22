import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export function PageProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [fast, setFast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isLoading) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setFast(false)
      setWidth(0)
      setOpacity(1)
      setVisible(true)
      // Double rAF ensures 0-width paints before the transition starts
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setWidth(82))
      )
    } else {
      setFast(true)
      setWidth(100)
      timerRef.current = setTimeout(() => {
        setOpacity(0)
        timerRef.current = setTimeout(() => {
          setVisible(false)
          setWidth(0)
          setOpacity(1)
          setFast(false)
        }, 300)
      }, 200)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isLoading])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #1a4d2e 0%, #2d6a4f 30%, #40916c 60%, #74c69d 80%, #40916c 100%)',
          backgroundSize: '250% 100%',
          animation: 'shs-progress-shimmer 1.8s ease-in-out infinite',
          boxShadow: '0 0 10px rgba(64, 145, 108, 0.55)',
          transition: fast
            ? 'width 0.22s ease-out'
            : 'width 9s cubic-bezier(0.04, 0.6, 0.08, 1)',
        }}
      />
    </div>
  )
}
