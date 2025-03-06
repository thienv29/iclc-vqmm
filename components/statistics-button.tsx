"use client"

import { BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StatisticsButtonProps {
  onClick: () => void
  count: number
}

export function StatisticsButton({ onClick, count }: StatisticsButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="bg-white shadow-md hover:bg-gray-100 transition-all"
    >
      <BarChart2 className="mr-2 h-4 w-4" />
      Thống kê
      {count > 0 && (
        <Badge variant="destructive" className="ml-2">
          {count}
        </Badge>
      )}
    </Button>
  )
}

