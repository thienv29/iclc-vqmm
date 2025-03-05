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
}

export default function AdminPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [newSegment, setNewSegment] = useState<Segment>({ text: "", color: "#000000", description: "" })

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
    if (newSegment.text && newSegment.color) {
      saveSegments([...segments, newSegment])
      setNewSegment({ text: "", color: "#000000", description: "" })
    }
  }

  const removeSegment = (index: number) => {
    const updatedSegments = segments.filter((_, i) => i !== index)
    saveSegments(updatedSegments)
  }

  const updateSegment = (index: number, field: keyof Segment, value: string) => {
    const updatedSegments = segments.map((segment, i) => (i === index ? { ...segment, [field]: value } : segment))
    saveSegments(updatedSegments)
  }

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
    </div>
  )
}

