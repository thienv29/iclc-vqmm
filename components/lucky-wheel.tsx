'use client'

import { useEffect, useRef, useState } from 'react'
import { Wheel } from '@/components/wheel'
import { RegistrationForm } from '@/components/wheel1/registration-form'
import { PrizePopup } from '@/components/prize-popup'
import type { Prize, SpinResult, WheelConfig } from '@/types/prize'
import { StorageService } from '@/services/storage-service'
import { StatisticsModal } from '@/components/statistics-modal'
import {checkGiai, createDealBitrix24, isRolledByPhone} from '@/lib/utils'
import { htmlToText } from 'html-to-text'
import { toast } from 'sonner'
import { RegistrationForm2 } from './wheel2/registration-form-2'
import WheelInfo from './wheel1/wheel-info'
import WheelInfo2 from './wheel2/wheel-info'
export default function LuckyWheel({ typeWheel }: { typeWheel: string }) {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [wheelConfig, setWheelConfig] = useState<WheelConfig>({
    centerImage: '/logox.png', // Sử dụng placeholder thay vì URL không tồn tại
    borderColor: '#FF9FF3',
    pointerColor: '#FF1493',
  })
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [spinResults, setSpinResults] = useState<SpinResult[]>([])
  const [formData, setFormData] = useState<any>({})
  const [dataGiai, setDataGiai] = useState<any>({})
  const formRef = useRef<{ reset: () => void } | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const data = StorageService.getData(typeWheel)
    setPrizes(data.prizes)
    setSpinResults(data.spinResults)
    setWheelConfig(data.config)
  }, [])

  const handleFormSubmit = async (data: Record<string, string | string[]>) => {
    if (!isSpinning) {
      const dataGiai = await checkGiai();
      setDataGiai(dataGiai);
      if (await isRolledByPhone(data['phone'] as string)) {
        console.log('Dxxx')
        toast.error('Bạn đã quay rồi', {
          position: 'top-center',
          style: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'red',
          },
        })
        return
      }
      setFormData(data)
      setIsSpinning(true)
    }
  }

  const handleSpinEnd = async (prize: Prize) => {
    setIsSpinning(false)
    setSelectedPrize(prize)
    setShowPopup(true)

    console.log({
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      booth: formData.booth,
      interests: formData.interests,
      prizeName: prize.nameBitrix || prize.wheelDisplayName,
    })

    await createDealBitrix24({
      fullName: formData.name,
      school: formData.school,
      schoolType: formData.schoolType,
      phone: formData.phone,
      email: formData.email,
      booth: formData.booth,
      description: htmlToText(prize.description),
      interests: formData.interests,
      prizeName: prize.nameBitrix || prize.wheelDisplayName,
      note: prize.note,
      role: formData.role,
    })
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
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 flex-col-reverse md:flex-row relative z-10 items-center justify-center'>
      {typeWheel === 'wheel-1' ? <WheelInfo /> : <WheelInfo2 />}
      <div className='flex justify-center items-center order-2 md:order-1 z-10'>
        <div className='relative'>
          <div className='absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 blur-lg animate-pulse'></div>
          <Wheel
            prizes={prizes}
            config={wheelConfig}
            dataGiai={dataGiai}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
          />
        </div>
      </div>
      <div
        id='form-register'
        className='max-w-md bg-white p-5 rounded-lg shadow-lg order-1 md:order-2 backdrop-blur-sm bg-opacity-90 border border-pink-200 transform transition-all hover:shadow-xl'
      >
        <h2 className='text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>
          Thông Tin Đăng Ký
        </h2>
        {typeWheel === 'wheel-1' ? (
          <RegistrationForm
            onSubmit={handleFormSubmit}
            isSpinning={isSpinning}
            ref={formRef}
          />
        ) : (
          <RegistrationForm2
            onSubmit={handleFormSubmit}
            isSpinning={isSpinning}
            ref={formRef}
          />
        )}
      </div>
      {showPopup && selectedPrize && (
        <PrizePopup
          user={formData}
          prize={selectedPrize}
          onClose={handleClosePopup}
        />
      )}
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
