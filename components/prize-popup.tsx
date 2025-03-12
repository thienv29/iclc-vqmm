"use client"

import { useEffect } from "react"
import type { Prize } from "@/types/prize"
import { Button } from "@/components/ui/button"
import {Plus, X} from "lucide-react"
import EVoucher from "@/components/e-voucher";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

interface PrizePopupProps {
  prize: Prize,
  user: any,
  onClose: () => void
}

export function PrizePopup({ prize, user, onClose }: PrizePopupProps) {
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

        <div className="text-center ">

          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Chúc mừng!
          </h2>

          {/*<div className="mb-6 text-center" dangerouslySetInnerHTML={{ __html: prize.description }} />*/}
          <div className="mb-6 text-center">
            <p className="text-xl">Chúc mừng Ông/ Bà <span className='font-bold'>{user.name}</span> đã nhận <br/>
              <span dangerouslySetInnerHTML={{ __html: prize.wheelDisplayName }} />
            </p>
            <p className="text-sm">Thời hạn sử dụng: Đến hết ngày 20/04/2025</p>
          </div>

          <div className={'flex md:justify-between md:flex-row flex-col justify-center items-center mb-5'}>
            {prize.eVoucher && prize.eVoucher != '' && <EVoucher text={prize.eVoucher}></EVoucher>}
            <div><Plus className={'text-xl'}/></div>
              <img src={prize.iconImage} className='h-[300px]' alt={prize.wheelDisplayName}/>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          >
            Nhận quà
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

