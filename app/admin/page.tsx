"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/rich-text-editor"
import Link from "next/link"

interface Segment {
  text: string
  color: string
  description: string
  probability: number
}

export default function AdminPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [newSegment, setNewSegment] = useState<Segment>({ text: "", color: "#000000", description: "", probability: 0 })

  useEffect(() => {
    const savedSegments = localStorage.getItem("wheelSegments")
    if (savedSegments) {
      setSegments(JSON.parse(savedSegments))
    }
  }, [])

  const saveSegments = (updatedSegments: Segment[]) => {
    localStorage.setItem("wheelSegments", JSON.stringify(updatedSegments))
    setSegments(updatedSegments)
  }

  const addSegment = () => {
    if (!newSegment.text || !newSegment.color || newSegment.probability <= 0) {
      return; // Prevent adding if any field is missing or probability is invalid
    }

    const isDuplicate = segments.some((segment) => segment.text === newSegment.text);
    if (isDuplicate) {
      alert("Phần thưởng này đã tồn tại."); // Display an alert to the user
      return; // Prevent adding duplicate
    }

    saveSegments([...segments, newSegment]);
    setNewSegment({ text: "", color: "#000000", description: "", probability: 0 });
  };

  const removeSegment = (index: number) => {
    const updatedSegments = segments.filter((_, i) => i !== index)
    saveSegments(updatedSegments)
  }

  const updateSegment = (index: number, field: keyof Segment, value: string | number) => {
    const updatedSegments = segments.map((segment, i) => (i === index ? { ...segment, [field]: value } : segment))
    saveSegments(updatedSegments)
  }

  const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Vòng Quay May Mắn</h1>
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        Quay lại trang chính
      </Link>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Thêm phần thưởng mới</h2>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="new-text">Tên phần thưởng</Label>
            <Input
              id="new-text"
              value={newSegment.text}
              onChange={(e) => setNewSegment({ ...newSegment, text: e.target.value })}
              placeholder="Nhập tên phần thưởng"
            />
          </div>
          <div>
            <Label htmlFor="new-color">Màu sắc</Label>
            <Input
              id="new-color"
              type="color"
              value={newSegment.color}
              onChange={(e) => setNewSegment({ ...newSegment, color: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="new-probability">Tỉ lệ (%)</Label>
            <Input
              id="new-probability"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={newSegment.probability}
              onChange={(e) => setNewSegment({ ...newSegment, probability: Number.parseFloat(e.target.value) })}
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="new-description">Mô tả</Label>
          <RichTextEditor
            content={newSegment.description}
            onChange={(content) => setNewSegment({ ...newSegment, description: content })}
          />
        </div>
        <Button onClick={addSegment}>Thêm phần thưởng</Button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Danh sách phần thưởng</h2>
      {segments.map((segment, index) => (
        <div key={index} className="border p-4 mb-4 rounded-md">
          <div className="flex gap-4 mb-2">
            <Input
              value={segment.text}
              onChange={(e) => updateSegment(index, "text", e.target.value)}
              placeholder="Tên phần thưởng"
            />
            <Input type="color" value={segment.color} onChange={(e) => updateSegment(index, "color", e.target.value)} />
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={segment.probability}
              onChange={(e) => updateSegment(index, "probability", Number.parseFloat(e.target.value))}
              placeholder="Tỉ lệ (%)"
            />
          </div>
          <div className="mb-2">
            <Label>Mô tả</Label>
            <RichTextEditor
              content={segment.description}
              onChange={(content) => updateSegment(index, "description", content)}
            />
          </div>
          <Button variant="destructive" onClick={() => removeSegment(index)}>
            Xóa
          </Button>
        </div>
      ))}

      <div className="mt-4 p-4 bg-yellow-100 rounded-md">
        <p className="font-bold">Tổng tỉ lệ: {totalProbability.toFixed(1)}%</p>
        {totalProbability !== 100 && (
          <p className="text-red-500 mt-2">Cảnh báo: Tổng tỉ lệ phải bằng 100%. Vui lòng điều chỉnh các tỉ lệ.</p>
        )}
        <p className="mt-2 text-sm text-gray-600">
          Lưu ý: Tỉ lệ này ảnh hưởng đến xác suất trúng thưởng, nhưng không ảnh hưởng đến kích thước của các phân khúc
          trên vòng quay.
        </p>
      </div>
    </div>
  )
}
