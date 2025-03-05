"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface UserData {
  name: string
  email: string
  phone: string
}

interface UserFormProps {
  onSubmit: (userData: UserData) => void
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(userData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Đăng ký tham gia</h2>

      <div>
        <Label htmlFor="name" className="text-white">
          Họ và tên
        </Label>
        <Input
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
          className="mt-1"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          required
          className="mt-1"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-white">
          Số điện thoại
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={userData.phone}
          onChange={handleChange}
          required
          className="mt-1"
          placeholder="0123456789"
        />
      </div>

      <Button type="submit" className="w-full mt-6">
        Tham gia và Quay Ngay
      </Button>

      <p className="text-sm text-slate-300 text-center mt-4">
        Vòng quay sẽ bắt đầu ngay sau khi bạn nhấn nút "Tham gia và Quay Ngay"
      </p>
    </form>
  )
}

