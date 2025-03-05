"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import LuckyWheel from "@/components/lucky-wheel"
import ResultModal from "@/components/result-modal"
import UserForm, { type UserData } from "@/components/user-form"
import Link from "next/link"

interface Segment {
  text: string
  color: string
  description: string
  probability: number
}

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Segment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [segments, setSegments] = useState<Segment[]>([])
  const [spinAngle, setSpinAngle] = useState(0)

  useEffect(() => {
    const savedSegments = localStorage.getItem("wheelSegments")
    if (savedSegments) {
      setSegments(JSON.parse(savedSegments))
    } else {
      // Fallback to default segments if none are saved
      setSegments([
        { text: "50.000đ", color: "#EF4444", description: "Giải thưởng tiền mặt 50.000đ", probability: 20 },
        { text: "Chúc may mắn", color: "#F59E0B", description: "Chúc bạn may mắn lần sau", probability: 30 },
        { text: "100.000đ", color: "#10B981", description: "Giải thưởng tiền mặt 100.000đ", probability: 15 },
        { text: "Mất lượt", color: "#3B82F6", description: "Rất tiếc, bạn đã mất lượt", probability: 10 },
        { text: "200.000đ", color: "#8B5CF6", description: "Giải thưởng tiền mặt 200.000đ", probability: 10 },
        { text: "Thêm lượt", color: "#EC4899", description: "Bạn được thêm một lượt quay", probability: 10 },
        { text: "500.000đ", color: "#F97316", description: "Giải thưởng lớn: 500.000đ", probability: 5 },
      ])
    }
  }, [])

  const selectRandomSegment = useCallback(() => {
    const randomValue = Math.random() * segments.length
    const selectedIndex = Math.floor(randomValue)
    console.log(segments[selectedIndex])
    return segments[selectedIndex]
  }, [segments])

  const handleSpin = useCallback(() => {
    if (isSpinning) return

    const selectedSegment = selectRandomSegment()
    setResult(selectedSegment)

    // Calculate the spin angle
    const segmentAngle = 360 / segments.length
    const selectedIndex = segments.findIndex((segment) => segment.text === selectedSegment.text)
    const baseAngle = selectedIndex * segmentAngle
    const randomOffset = Math.random() * (segmentAngle * 0.8) - segmentAngle * 0.4
    const totalRotations = 5 // Number of full rotations before stopping
    const totalAngle = 360 * totalRotations + baseAngle + randomOffset

    setSpinAngle(totalAngle)
    setIsSpinning(true)
  }, [isSpinning, selectRandomSegment, segments])

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false)
    setShowModal(true)
  }, [])

  const handleFormSubmit = useCallback(
    (data: UserData) => {
      setUserData(data)
      handleSpin()
    },
    [handleSpin],
  )

  const resetGame = useCallback(() => {
    setUserData(null)
    setResult(null)
    setShowModal(false)
    setSpinAngle(0)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Vòng Quay May Mắn</h1>
          <p className="text-slate-300">Hãy thử vận may của bạn!</p>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-8">
          {/* Vòng quay */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <LuckyWheel
                segments={segments}
                isSpinning={isSpinning}
                spinAngle={spinAngle}
                onSpinComplete={handleSpinComplete}
              />
            </div>

            {userData && !isSpinning && (
              <Button
                onClick={handleSpin}
                size="lg"
                className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 text-lg rounded-full shadow-lg transition-all"
              >
                QUAY LẠI
              </Button>
            )}
          </div>

          {/* Form hoặc thông tin người dùng */}
          <div className="md:w-1/2">
            {!userData ? (
              <UserForm onSubmit={handleFormSubmit} />
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 text-center">
                <p className="text-white">
                  Xin chào, <span className="font-bold">{userData.name}</span>!
                </p>
                <p className="text-slate-300 mt-2">
                  {isSpinning ? "Vòng quay đang quay..." : "Kết quả của bạn sẽ hiện ra sau khi vòng quay dừng lại."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/admin" className="text-blue-400 hover:underline">
            Quản lý vòng quay
          </Link>
        </div>
      </div>

      {showModal && result && <ResultModal result={result} onClose={resetGame} userName={userData?.name} />}
    </main>
  )
}

