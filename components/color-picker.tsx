"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    "#FF8C00", // Orange
    "#4169E1", // Royal Blue
    "#32CD32", // Lime Green
    "#9932CC", // Dark Orchid
    "#FFD700", // Gold
    "#FF6347", // Tomato
    "#20B2AA", // Light Sea Green
    "#FF69B4", // Hot Pink
    "#8A2BE2", // Blue Violet
    "#00CED1", // Dark Turquoise
    "#FF4500", // Orange Red
    "#2E8B57", // Sea Green
    "#A9A9A9", // Dark Gray
    "#FF1493", // Deep Pink
    "#7B68EE", // Medium Slate Blue
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-md border border-gray-300" style={{ backgroundColor: value }}></div>
          <Input value={value} onChange={(e) => onChange(e.target.value)} className="w-24 h-8 text-xs" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-md border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color)
                setIsOpen(false)
              }}
            ></button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

