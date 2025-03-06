"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, Image } from "lucide-react"
import type { Prize } from "@/types/prize"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ColorPicker } from "@/components/color-picker"

interface PrizeConfigProps {
  prizes: Prize[]
  onPrizesChange: (prizes: Prize[]) => void
}

export function PrizeConfig({ prizes, onPrizesChange }: PrizeConfigProps) {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  const handleWheelDisplayNameChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, wheelDisplayName: value })
  }

  const handlePopupTitleChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, popupTitle: value })
  }

  const handleDescriptionChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, description: value })
  }

  const handleProbabilityChange = (value: string) => {
    if (!editingPrize) return
    const probability = Number.parseInt(value, 10) || 0
    setEditingPrize({ ...editingPrize, probability })
  }

  const handleNoteChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, note: value })
  }

  const handleBackgroundColorChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, backgroundColor: value })
  }

  const handleTextColorChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, textColor: value })
  }

  const handleImageUrlChange = (value: string) => {
    if (!editingPrize) return
    setEditingPrize({ ...editingPrize, imageUrl: value })
  }

  const handleSave = () => {
    if (!editingPrize) return

    if (isCreating) {
      const newPrize = {
        ...editingPrize,
        id: Date.now().toString(),
      }
      onPrizesChange([...prizes, newPrize])
    } else {
      const updatedPrizes = prizes.map((prize) => (prize.id === editingPrize.id ? editingPrize : prize))
      onPrizesChange(updatedPrizes)
    }

    setEditingPrize(null)
    setIsCreating(false)
    setActiveTab("list")
  }

  const handleCancel = () => {
    setEditingPrize(null)
    setIsCreating(false)
    setActiveTab("list")
  }

  const handleEdit = (prize: Prize) => {
    setEditingPrize({ ...prize })
    setIsCreating(false)
    setActiveTab("edit")
  }

  const handleCreate = () => {
    setEditingPrize({
      id: "",
      wheelDisplayName: "Phần thưởng mới",
      popupTitle: "<span>Phần thưởng mới</span>",
      description: "<p>Mô tả phần thưởng</p>",
      probability: 10,
      note: "Ghi chú",
      backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      textColor: "#FFFFFF",
      imageUrl: "/placeholder.svg?height=100&width=100",
    })
    setIsCreating(true)
    setActiveTab("edit")
  }

  const handleDelete = (id: string) => {
    const updatedPrizes = prizes.filter((prize) => prize.id !== id)
    onPrizesChange(updatedPrizes)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="list" className="data-[state=active]:bg-white">
              Danh Sách Phần Thưởng
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-white" disabled={!editingPrize}>
              {isCreating ? "Thêm Mới" : "Chỉnh Sửa"}
            </TabsTrigger>
          </TabsList>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="mr-2 h-4 w-4" /> Thêm Phần Thưởng
          </Button>
        </div>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Tên Hiển Thị</TableHead>
                    <TableHead>Tiêu Đề Popup</TableHead>
                    <TableHead>Tỉ lệ</TableHead>
                    <TableHead>Màu Nền</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prizes.map((prize) => (
                    <TableRow key={prize.id}>
                      <TableCell>
                        {prize.imageUrl && (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img
                              src={prize.imageUrl || "/placeholder.svg"}
                              alt={prize.wheelDisplayName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{prize.wheelDisplayName}</TableCell>
                      <TableCell>
                        <div dangerouslySetInnerHTML={{ __html: prize.popupTitle }} />
                      </TableCell>
                      <TableCell>{prize.probability}%</TableCell>
                      <TableCell>
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: prize.backgroundColor || "#CCCCCC" }}
                        ></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(prize)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(prize.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="mt-0">
          {editingPrize && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Thông Tin Hiển Thị Trên Vòng Quay</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tên Hiển Thị Trên Vòng Quay</label>
                      <Input
                        value={editingPrize.wheelDisplayName}
                        onChange={(e) => handleWheelDisplayNameChange(e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Tên ngắn gọn hiển thị trực tiếp trên vòng quay</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Màu Nền</label>
                        <ColorPicker
                          value={editingPrize.backgroundColor || "#CCCCCC"}
                          onChange={handleBackgroundColorChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Màu Chữ</label>
                        <ColorPicker value={editingPrize.textColor || "#FFFFFF"} onChange={handleTextColorChange} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tỉ lệ (%)</label>
                      <Input
                        type="number"
                        value={editingPrize.probability}
                        onChange={(e) => handleProbabilityChange(e.target.value)}
                        min="0"
                        max="100"
                        className="border-2 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tỉ lệ xuất hiện của phần thưởng này (tổng tỉ lệ của tất cả phần thưởng nên bằng 100%)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Thông Tin Hiển Thị Trong Popup</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tiêu Đề Popup</label>
                      <RichTextEditor value={editingPrize.popupTitle} onChange={handlePopupTitleChange} />
                      <p className="text-xs text-gray-500 mt-1">
                        Tiêu đề hiển thị trong popup khi người dùng trúng thưởng
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả Chi Tiết</label>
                      <RichTextEditor value={editingPrize.description} onChange={handleDescriptionChange} />
                      <p className="text-xs text-gray-500 mt-1">Mô tả chi tiết về phần thưởng hiển thị trong popup</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Hình Ảnh</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {editingPrize.imageUrl ? (
                            <img
                              src={editingPrize.imageUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <Input
                          value={editingPrize.imageUrl || ""}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="URL hình ảnh"
                          className="flex-1 border-2 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Ghi chú</label>
                      <Input
                        value={editingPrize.note}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        className="border-2 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {isCreating ? "Thêm Mới" : "Lưu Thay Đổi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

