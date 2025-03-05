"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

interface Segment {
  text: string
  color: string
  description: string
}

interface ResultModalProps {
  result: Segment
  onClose: () => void
  userName?: string
}

export default function ResultModal({ result, onClose, userName }: ResultModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const isWinning = !result.text.includes("Chúc may mắn") && !result.text.includes("Mất lượt")

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-bounce-in">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Kết Quả</h2>

          {userName && <p className="text-gray-600 mb-2">Xin chào {userName}!</p>}

          {isWinning ? (
            <>
              <div className="relative mb-4">
                <Sparkles className="h-20 w-20 text-yellow-500 mx-auto animate-pulse" />
              </div>
              <p className="text-xl font-bold text-green-600 mb-2">Chúc mừng!</p>
              <p className="text-3xl font-bold text-primary mb-4">{result.text}</p>
              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: result.description }} />
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-gray-700 mb-2">Kết quả:</p>
              <p className="text-3xl font-bold text-primary mb-4">{result.text}</p>
              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: result.description }} />
            </>
          )}

          <Button className="mt-6 w-full" size="lg" onClick={onClose}>
            Kết thúc
          </Button>
        </div>
      </div>
    </div>
  )
}

