export interface Prize {
  id: string
  wheelDisplayName: string
  popupTitle: string
  description: string
  probability: number
  note: string
  backgroundColor?: string
  textColor?: string
  imageUrl: string
}

export interface SpinResult {
  id: string
  prizeId: string
  prizeName: string
  timestamp: number
  userInfo?: {
    name: string
    email: string
    phone: string
    school?: string
    class?: string
  }
}

export interface WheelConfig {
  centerImage: string
  backgroundColor?: string
  borderColor?: string
  pointerColor?: string
}

export interface WheelData {
  prizes: Prize[]
  spinResults: SpinResult[]
  config: WheelConfig
  lastUpdated: number
}

