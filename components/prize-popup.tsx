"use client"

import { useEffect } from "react"
import type { Prize } from "@/types/prize"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import EVoucher from "@/components/e-voucher";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

interface PrizePopupProps {
  prize: Prize
  onClose: () => void
}

export function PrizePopup({ prize, onClose }: PrizePopupProps) {
  // Prevent scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-3 max-w-4xl w-full relative shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-pink-200">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <div className={'h-[70px]'}></div>

        <div className="text-center ">
          <div className="mb-4 animate-bounce ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-yellow-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Chúc mừng!
          </h2>

          {/*<div className="mb-6 text-center" dangerouslySetInnerHTML={{ __html: prize.description }} />*/}

          <div className={'flex md:justify-between md:flex-row flex-col justify-center items-center mb-5'}>
            {prize.eVoucher && prize.eVoucher != '' && <EVoucher text={prize.eVoucher}></EVoucher>}
              <img src={prize.iconImage} width={200} alt={prize.wheelDisplayName}/>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          >
            Quay Tiếp
          </Button>
        </div>
      </div>

      {/* Add floating confetti effect */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: `-5%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
              animation: `fall ${3 + Math.random() * 5}s linear ${Math.random() * 5}s infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

