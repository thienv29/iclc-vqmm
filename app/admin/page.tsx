"use client"

import { useState, useEffect } from "react"
import { PrizeConfig } from "@/components/prize-config"
import { WheelConfigComponent } from "@/components/wheel-config"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { StatisticsModal } from "@/components/statistics-modal"
import { Button } from "@/components/ui/button"
import { BarChart2, RefreshCw } from "lucide-react"
import type { Prize } from "@/types/prize"
import { StorageService } from "@/services/storage-service"

export default function AdminPage() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [spinResults, setSpinResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("prizes")
  const [showStats, setShowStats] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on component mount
  useEffect(() => {
    const data = StorageService.getData()
    setPrizes(data.prizes)
    setSpinResults(data.spinResults)
    setIsLoading(false)
  }, [])

  const handlePrizesChange = (updatedPrizes: Prize[]) => {
    setPrizes(updatedPrizes)
    StorageService.savePrizes(updatedPrizes)
  }

  const handleClearHistory = () => {
    StorageService.clearSpinResults()
    setSpinResults([])
  }

  const handleResetToDefault = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn đặt lại tất cả dữ liệu về mặc định không? Hành động này không thể hoàn tác.",
      )
    ) {
      StorageService.resetToDefault()
      const data = StorageService.getData('wheel-1')
      setPrizes(data.prizes)
      setSpinResults(data.spinResults)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin mr-2">
          <RefreshCw size={24} />
        </div>
        <span>Đang tải...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === "prizes" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Quản Lý Phần Thưởng
              </h1>
              <PrizeConfig prizes={prizes} onPrizesChange={handlePrizesChange} />
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Cài Đặt Vòng Quay
              </h1>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Tùy Chỉnh Vòng Quay</h2>
                  <WheelConfigComponent />
                </div>

                <div className="p-4 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Dữ liệu và Lưu trữ</h2>
                  <p className="text-gray-600 mb-4">
                    Tất cả dữ liệu của vòng quay may mắn được lưu trữ trong localStorage của trình duyệt. Dữ liệu sẽ
                    được giữ lại ngay cả khi bạn đóng trình duyệt, nhưng sẽ bị mất nếu bạn xóa dữ liệu trình duyệt.
                  </p>

                  <div className="flex space-x-4">
                    <Button onClick={() => setShowStats(true)} variant="outline">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Xem Thống Kê
                    </Button>
                    <Button onClick={handleResetToDefault} variant="destructive">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Đặt Lại Về Mặc Định
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Thông Tin Phiên Bản</h2>
                  <p className="text-gray-600">
                    Vòng Quay May Mắn v1.0.0
                    <br />
                    Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "statistics" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Thống Kê
              </h1>
              <Button onClick={() => setShowStats(true)} className="mb-4">
                <BarChart2 className="mr-2 h-4 w-4" />
                Xem Chi Tiết Thống Kê
              </Button>
              <p className="text-center text-gray-500">Nhấn vào nút trên để xem chi tiết thống kê về lịch sử quay.</p>
            </div>
          )}
        </main>
      </div>

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

