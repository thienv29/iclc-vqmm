import type { Prize, SpinResult, WheelData, WheelConfig } from "@/types/prize"

const STORAGE_KEY = "lucky_wheel_data"

// Sample data to initialize if no data exists
const samplePrizes: Prize[] = [
  {
    id: "1",
    wheelDisplayName: "Giải Đặc Biệt",
    popupTitle: "<span class='font-bold text-red-500'>Giải Đặc Biệt</span>",
    description:
      "<p>Chúc mừng! Bạn đã trúng <strong>Giải Đặc Biệt</strong>!</p><p>Một chiếc điện thoại thông minh mới!</p>",
    probability: 5,
    note: "Số lượng có hạn",
    backgroundColor: "#FF8C00",
    textColor: "#FFFFFF",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    wheelDisplayName: "Voucher 1M",
    popupTitle: "<span class='text-blue-500'>Voucher 1.000.000đ</span>",
    description: "<p>Bạn đã trúng <strong>Voucher mua sắm 1.000.000đ</strong>!</p>",
    probability: 10,
    note: "Có hiệu lực trong 3 tháng",
    backgroundColor: "#4169E1",
    textColor: "#FFFFFF",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    wheelDisplayName: "Vé Miễn Phí",
    popupTitle: "<span class='text-green-500'>Vé Miễn Phí</span>",
    description: "<p>Bạn đã trúng <strong>Vé Miễn Phí</strong> cho sự kiện sắp tới của chúng tôi!</p>",
    probability: 15,
    note: "Có thể chuyển nhượng",
    backgroundColor: "#32CD32",
    textColor: "#FFFFFF",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    wheelDisplayName: "Hộp Quà",
    popupTitle: "<span class='text-purple-500'>Hộp Quà Bí Mật</span>",
    description: "<p>Bạn đã trúng <strong>Hộp Quà Bí Mật</strong> với nhiều phần quà bất ngờ bên trong!</p>",
    probability: 20,
    note: "Nội dung thay đổi",
    backgroundColor: "#9932CC",
    textColor: "#FFFFFF",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    wheelDisplayName: "Giảm 10%",
    popupTitle: "<span class='text-yellow-500'>Giảm Giá 10%</span>",
    description: "<p>Bạn đã trúng <strong>Giảm Giá 10%</strong> cho lần mua hàng tiếp theo!</p>",
    probability: 25,
    note: "Không áp dụng cùng các ưu đãi khác",
    backgroundColor: "#FFD700",
    textColor: "#000000",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    wheelDisplayName: "May Mắn Sau",
    popupTitle: "<span class='text-gray-500'>Chúc May Mắn Lần Sau</span>",
    description: "<p>Rất tiếc, bạn chưa trúng giải lần này. Hãy thử lại!</p>",
    probability: 25,
    note: "Không giới hạn số lần tham gia",
    backgroundColor: "#A9A9A9",
    textColor: "#FFFFFF",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

// Default wheel configuration
const defaultConfig: WheelConfig = {
  centerImage: "/placeholder.svg?height=100&width=100", // Sử dụng placeholder thay vì URL không tồn tại
  backgroundColor: "#FFFFFF",
  borderColor: "#FF9FF3",
  pointerColor: "#FF1493",
}

// Initialize with empty spin results
const initialData: WheelData = {
  prizes: samplePrizes,
  spinResults: [],
  config: defaultConfig,
  lastUpdated: Date.now(),
}

export const StorageService = {
  getData: (): WheelData => {
    if (typeof window === "undefined") {
      return initialData
    }

    try {
      const storedData = localStorage.getItem(STORAGE_KEY)
      if (!storedData) {
        return initialData
      }

      const parsedData = JSON.parse(storedData) as WheelData

      // Ensure config exists (for backward compatibility)
      if (!parsedData.config) {
        parsedData.config = defaultConfig
      }

      // Kiểm tra và cập nhật URL hình ảnh tâm nếu là URL cũ không tồn tại
      if (parsedData.config.centerImage === "https://i-clc.edu.vn/wp-content/uploads/2022/10/Asset-19@2x-8.png") {
        parsedData.config.centerImage = defaultConfig.centerImage
      }

      return parsedData
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      return initialData
    }
  },

  saveData: (data: WheelData): void => {
    if (typeof window === "undefined") {
      return
    }

    try {
      // Update the lastUpdated timestamp
      const updatedData = {
        ...data,
        lastUpdated: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  },

  savePrizes: (prizes: Prize[]): void => {
    const data = StorageService.getData()
    StorageService.saveData({
      ...data,
      prizes,
    })
  },

  saveConfig: (config: WheelConfig): void => {
    const data = StorageService.getData()
    StorageService.saveData({
      ...data,
      config,
    })
  },

  addSpinResult: (result: Omit<SpinResult, "id" | "timestamp">): SpinResult => {
    const data = StorageService.getData()

    const newResult: SpinResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }

    const updatedResults = [newResult, ...data.spinResults]

    StorageService.saveData({
      ...data,
      spinResults: updatedResults,
    })

    return newResult
  },

  clearSpinResults: (): void => {
    const data = StorageService.getData()
    StorageService.saveData({
      ...data,
      spinResults: [],
    })
  },

  resetToDefault: (): void => {
    StorageService.saveData(initialData)
  },
}

