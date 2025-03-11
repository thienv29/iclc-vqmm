"use client"

import {useEffect, useRef, useState} from "react"
import {Wheel} from "@/components/wheel"
import {RegistrationForm} from "@/components/registration-form"
import {PrizePopup} from "@/components/prize-popup"
import type {Prize, SpinResult, WheelConfig} from "@/types/prize"
import {StorageService} from "@/services/storage-service"
import {StatisticsModal} from "@/components/statistics-modal"
import {createDealBitrix24} from "@/lib/utils";

export default function LuckyWheel() {
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [wheelConfig, setWheelConfig] = useState<WheelConfig>({
        centerImage: "/logox.png", // Sử dụng placeholder thay vì URL không tồn tại
        borderColor: "#FF9FF3",
        pointerColor: "#FF1493",
    })
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [spinResults, setSpinResults] = useState<SpinResult[]>([])
    const [formData, setFormData] = useState<any>({})
    const formRef = useRef<{ reset: () => void } | null>(null)

    // Load data from localStorage on component mount
    useEffect(() => {
        const data = StorageService.getData()
        setPrizes(data.prizes)
        setSpinResults(data.spinResults)
        setWheelConfig(data.config)
    }, [])

    const handleFormSubmit = (data: Record<string, string | string[]>) => {
        if (!isSpinning) {
            setFormData(data)
            setIsSpinning(true)
        }
    }

    const handleSpinEnd = async (prize: Prize) => {
        setIsSpinning(false)
        setSelectedPrize(prize)
        setShowPopup(true)

        // Save spin result to localStorage
        const newResult = StorageService.addSpinResult({
            prizeId: prize.id,
            prizeName: prize.wheelDisplayName,
            userInfo: {
                name: formData.name || "",
                email: formData.email || "",
                phone: formData.phone || "",
            },
        })

        console.log({
            fullName: formData.name,
            phone: formData.phone,
            email: formData.email,
            booth: formData.booth,
            interests: formData.interests,
            prizeName: prize.nameBitrix || prize.wheelDisplayName
        })

        await createDealBitrix24({
            fullName: formData.name,
            phone: formData.phone,
            email: formData.email,
            booth: formData.booth,
            interests: formData.interests,
            prizeName: prize.nameBitrix || prize.wheelDisplayName
        })

        // Update local state
        setSpinResults((prev) => [newResult, ...prev])
    }

    const handleClosePopup = () => {
        setShowPopup(false)
        if (formRef.current) {
            formRef.current.reset()
        }
    }

    const handleClearHistory = () => {
        StorageService.clearSpinResults()
        setSpinResults([])
    }

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-col-reverse md:flex-row relative z-10 items-center justify-center">
            <div className="w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-3 text-[#16177b]">📌 Lưu ý</h2>
                <div className="w-full bg-gray-50 shadow-lg p-5 mt-3 rounded-lg border border-gray-200">
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start"><span className="mr-2">✅</span> Chương trình chỉ diễn ra duy
                            nhất ngày&nbsp;<b>20/03/2025</b>.
                        </li>
                        <li className="flex items-start"><span className="mr-2">✅</span> Mỗi số điện thoại chỉ được
                            quay&nbsp;<b>01 lần</b>.
                        </li>
                        <li className="flex items-start"><span className="mr-2">🎁</span> Quà tặng hiện vật sẽ được nhận
                            trực tiếp tại quầy.
                        </li>
                        <li className="flex items-start"><span className="mr-2">📧</span> Quà tặng&nbsp;<b>E-voucher</b>&nbsp;sẽ
                            nhận qua email.
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center items-center order-2 md:order-1">
                <div className="relative">
                    <div
                        className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 blur-lg animate-pulse"></div>
                    <Wheel prizes={prizes} config={wheelConfig} isSpinning={isSpinning} onSpinEnd={handleSpinEnd}/>
                </div>
            </div>
            <div id="form-register"
                className="max-w-md bg-white p-5 rounded-lg shadow-lg order-1 md:order-2 backdrop-blur-sm bg-opacity-90 border border-pink-200 transform transition-all hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Thông Tin Đăng Ký
                </h2>
                <RegistrationForm onSubmit={handleFormSubmit} isSpinning={isSpinning} ref={formRef}/>
            </div>
            {showPopup && selectedPrize &&
                <PrizePopup user={formData} prize={selectedPrize} onClose={handleClosePopup}/>}
            {showStats && (
                <StatisticsModal
                    spinResults={spinResults}
                    prizes={prizes}
                    onClose={() => setShowStats(false)}
                    onClearHistory={handleClearHistory}
                />
            )}
        </div>
    )
}

