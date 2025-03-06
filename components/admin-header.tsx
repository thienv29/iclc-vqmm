"use client"

import { Bell, User } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">V</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Quản Trị Vòng Quay
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
          Xem Trang Chủ
        </Link>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  )
}

