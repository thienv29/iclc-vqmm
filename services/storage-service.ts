import type { Prize, SpinResult, WheelConfig, WheelData } from '@/types/prize'
import DB from '@/services/init.json'
import DB2 from '@/services/cc.json'
const STORAGE_KEY = 'lucky_wheel_data'

// Initialize with empty spin results
let initialData: WheelData
let typeWheel: string = 'wheel-1'

export const StorageService = {
  getData: (typeWheelProp: string): WheelData => {
    if (typeWheelProp === 'wheel-1') {
      initialData = DB
      typeWheel = typeWheelProp
    } else {
      initialData = DB2
      typeWheel = typeWheelProp
    }
    if (typeof window === 'undefined') {
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
        //parsedData.config = defaultConfig
      }

      // Kiểm tra và cập nhật URL hình ảnh tâm nếu là URL cũ không tồn tại
      if (
        parsedData.config.centerImage ===
        'https://i-clc.edu.vn/wp-content/uploads/2022/10/Asset-19@2x-8.png'
      ) {
        //parsedData.config.centerImage = defaultConfig.centerImage
      }

      return parsedData
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      return initialData
    }
  },

  saveData: (data: WheelData): void => {
    if (typeof window === 'undefined') {
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
      console.error('Error saving data to localStorage:', error)
    }
  },

  savePrizes: (prizes: Prize[]): void => {
    const data = StorageService.getData(typeWheel)
    StorageService.saveData({
      ...data,
      prizes,
    })
  },

  saveConfig: (config: WheelConfig): void => {
    const data = StorageService.getData(typeWheel)
    StorageService.saveData({
      ...data,
      config,
    })
  },

  clearSpinResults: (): void => {
    const data = StorageService.getData(typeWheel)
    StorageService.saveData({
      ...data,
    })
  },

  resetToDefault: (): void => {
    StorageService.saveData(initialData)
  },

  exportData: (): void => {
    const data = StorageService.getData(typeWheel)
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lucky_wheel_data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  importData: (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          if (!event.target?.result) return reject('File read error')
          const importedData = JSON.parse(
            event.target.result as string
          ) as WheelData
          StorageService.saveData(importedData)
          resolve()
        } catch (error) {
          reject('Invalid JSON format')
        }
      }
      reader.onerror = () => reject('Error reading file')
      reader.readAsText(file)
    })
  },
}
