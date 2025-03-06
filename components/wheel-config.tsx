"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ColorPicker } from "@/components/color-picker"
import { Image, RefreshCw } from "lucide-react"
import type { WheelConfig } from "@/types/prize"
import { StorageService } from "@/services/storage-service"

export function WheelConfigComponent() {
  const [config, setConfig] = useState<WheelConfig>({
    centerImage: "/placeholder.svg?height=100&width=100",
    borderColor: "#FF9FF3",
    pointerColor: "#FF1493",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const data = StorageService.getData()
    setConfig(data.config)
    setPreviewImage(data.config.centerImage)
  }, [])

  const handleCenterImageChange = (value: string) => {
    setConfig({ ...config, centerImage: value })
    setPreviewImage(value)
  }

  const handleBorderColorChange = (value: string) => {
    setConfig({ ...config, borderColor: value })
  }

  const handlePointerColorChange = (value: string) => {
    setConfig({ ...config, pointerColor: value })
  }

  const handleSave = () => {
    StorageService.saveConfig(config)
    alert("Cấu hình vòng quay đã được lưu!")
  }

  const handleReset = () => {
    const defaultConfig: WheelConfig = {
      centerImage: "/placeholder.svg?height=100&width=100",
      borderColor: "#FF9FF3",
      pointerColor: "#FF1493",
    }
    setConfig(defaultConfig)
    setPreviewImage(defaultConfig.centerImage)
    StorageService.saveConfig(defaultConfig)
    alert("Cấu hình vòng quay đã được đặt lại về mặc định!")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hình Ảnh Tâm Vòng Quay</h3>

            <div>
              <label className="block text-sm font-medium mb-1">URL Hình Ảnh Tâm</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border">
                  {previewImage ? (
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Tâm vòng quay"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImage(null)}
                    />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Input
                  value={config.centerImage || ""}
                  onChange={(e) => handleCenterImageChange(e.target.value)}
                  placeholder="URL hình ảnh tâm vòng quay"
                  className="flex-1 border-2 focus:border-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nhập URL hình ảnh để hiển thị ở tâm vòng quay. Nên sử dụng hình ảnh vuông.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Màu Sắc Vòng Quay</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Màu Viền</label>
              <ColorPicker value={config.borderColor || "#FF9FF3"} onChange={handleBorderColorChange} />
              <p className="text-xs text-gray-500 mt-1">Màu viền ngoài của vòng quay.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Màu Mũi Tên</label>
              <ColorPicker value={config.pointerColor || "#FF1493"} onChange={handlePointerColorChange} />
              <p className="text-xs text-gray-500 mt-1">Màu mũi tên chỉ vào phần thưởng.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Đặt Lại Mặc Định
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
            Lưu Cấu Hình
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

