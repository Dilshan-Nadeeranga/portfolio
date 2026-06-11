import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function FancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  useEffect(() => {
    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY }

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    function animate() {
      const dx = pos.current.x - cursorPos.current.x
      const dy = pos.current.y - cursorPos.current.y
      cursorPos.current.x += dx * 0.12
      cursorPos.current.y += dy * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`
        cursorRef.current.style.top = `${cursorPos.current.y}px`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    function onMouseDown() { setIsClicking(true) }
    function onMouseUp() { setIsClicking(false) }

    function onHoverIn(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (
        target.closest('a, button, [data-cursor-hover]') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      ) {
        setIsHovering(true)
      }
    }

    function onHoverOut() { setIsHovering(false) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onHoverIn)
    window.addEventListener('mouseout', onHoverOut)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onHoverIn)
      window.removeEventListener('mouseout', onHoverOut)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* Lagging outer ring */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'left, top' }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : isClicking ? 20 : 40,
            height: isHovering ? 56 : isClicking ? 20 : 40,
            opacity: isHovering ? 0.6 : 0.4,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="rounded-full border-2"
          style={{
            borderColor: isHovering ? '#a855f7' : '#6366f1',
            boxShadow: isHovering
              ? '0 0 20px rgba(168, 85, 247, 0.5)'
              : '0 0 10px rgba(99, 102, 241, 0.3)',
            background: isHovering
              ? 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)'
              : 'transparent',
          }}
        />
      </div>

      {/* Precise dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'left, top' }}
      >
        <motion.div
          animate={{
            width: isClicking ? 6 : 8,
            height: isClicking ? 6 : 8,
          }}
          className="rounded-full"
          style={{
            background: isHovering
              ? 'radial-gradient(circle, #a855f7, #6366f1)'
              : 'radial-gradient(circle, #818cf8, #6366f1)',
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
          }}
        />
      </div>
    </>
  )
}
