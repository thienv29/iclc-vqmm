"use client"

import { useState } from "react"
import { X, Download, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { Prize, SpinResult } from "@/types/prize"

interface StatisticsModalProps {
  spinResults: SpinResult[]
  prizes: Prize[]
  onClose: () => void
  onClearHistory: () => void
}

export function StatisticsModal({ spinResults, prizes, onClose, onClearHistory }: StatisticsModalProps) {
  const [activeTab, setActiveTab] = useState("history")
  const [filterPrize, setFilterPrize] = useState<string>("all")

  // Calculate statistics
  const totalSpins = spinResults.length

  // Count prizes by ID
  const prizeCountMap: Record<string, number> = {}
  spinResults.forEach((result) => {
    prizeCountMap[result.prizeId] = (prizeCountMap[result.prizeId] || 0) + 1
  })

  // Create prize statistics
  const prizeStats = prizes.map((prize) => ({
    id: prize.id,
    name: prize.wheelDisplayName,
    count: prizeCountMap[prize.id] || 0,
    percentage: totalSpins > 0 ? ((prizeCountMap[prize.id] || 0) / totalSpins) * 100 : 0,
    backgroundColor: prize.backgroundColor,
  }))

  // Filter results based on selected prize
  const filteredResults =
    filterPrize === "all" ? spinResults : spinResults.filter((result) => result.prizeId === filterPrize)

  // Export data as CSV
  const exportCSV = () => {
    const headers = ["Thời gian", "Phần thưởng", "Người tham gia", "Email", "Số điện thoại", "Trường", "Lớp"]

    const rows = spinResults.map((result) => [
      format(new Date(result.timestamp), "dd/MM/yyyy HH:mm:ss"),
      result.prizeName,
      result.userInfo?.name || "",
      result.userInfo?.email || "",
      result.userInfo?.phone || "",
      result.userInfo?.school || "",
      result.userInfo?.class || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `vong-quay-may-man-${format(new Date(), "dd-MM-yyyy")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Thống Kê Vòng Quay
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 border-b">
            <TabsList>
              <TabsTrigger value="history">Lịch Sử Quay</TabsTrigger>
              <TabsTrigger value="statistics">Thống Kê</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history" className="flex-1 overflow-hidden flex flex-col p-6 pt-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <Select value={filterPrize} onValueChange={setFilterPrize}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Lọc theo phần thưởng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phần thưởng</SelectItem>
                    {prizes.map((prize) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.wheelDisplayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={exportCSV} disabled={spinResults.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất CSV
                </Button>
                <Button variant="destructive" size="sm" onClick={onClearHistory} disabled={spinResults.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Lịch Sử
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {filteredResults.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phần thưởng
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người tham gia
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(result.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{result.prizeName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {result.userInfo?.name || "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {result.userInfo?.email || "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {result.userInfo?.phone || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p>Chưa có dữ liệu lịch sử quay</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalSpins}</div>
                  <p className="text-xs text-gray-500">Tổng số lần quay</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {spinResults.length > 0
                      ? format(new Date(spinResults[0].timestamp), "dd/MM/yyyy", { locale: vi })
                      : "-"}
                  </div>
                  <p className="text-xs text-gray-500">Lần quay gần nhất</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {prizeStats.length > 0
                      ? prizeStats.reduce((max, stat) => (stat.count > max.count ? stat : max), prizeStats[0]).name
                      : "-"}
                  </div>
                  <p className="text-xs text-gray-500">Phần thưởng phổ biến nhất</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">Phân bố phần thưởng</h3>

            <div className="space-y-4">
              {prizeStats.map((stat) => (
                <div key={stat.id} className="flex items-center">
                  <div className="w-32 truncate">{stat.name}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.backgroundColor || "#9333EA",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    {stat.count} ({stat.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

