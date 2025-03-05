"use client"

import { useRef, useEffect } from "react"

interface Segment {
  text: string
  color: string
  description: string
}

interface LuckyWheelProps {
  segments: Segment[]
  isSpinning: boolean
}

export default function LuckyWheel({ segments, isSpinning }: LuckyWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Draw the wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw segments
    const segmentAngle = (2 * Math.PI) / segments.length

    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle
      const endAngle = (index + 1) * segmentAngle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = segment.color
      ctx.fill()

      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2)

      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 14px Arial"

      // Position text at 80% of radius
      ctx.fillText(segment.text, radius * 0.8, 0)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
  }, [segments])

  // Handle spinning animation
  useEffect(() => {
    if (!wheelRef.current) return

    if (isSpinning) {
      const rotations = 5 + Math.random() * 5 // Between 5-10 rotations
      const duration = 5 // 5 seconds

      wheelRef.current.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`
      wheelRef.current.style.transform = `rotate(${rotations * 360}deg)`
    } else {
      wheelRef.current.style.transition = "none"
      wheelRef.current.style.transform = "rotate(0deg)"
    }
  }, [isSpinning])

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Pointer/indicator */}
      <div className="absolute top-0 left-1/2 rotate-180 -translate-x-1/2 -mt-2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-yellow-500 z-10" />

      {/* Wheel */}
      <div ref={wheelRef} className="w-full h-full relative">
        <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
      </div>
    </div>
  )
}

