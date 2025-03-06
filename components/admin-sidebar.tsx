"use client"

import { Gift, Settings, BarChart3 } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "prizes", label: "Phần Thưởng", icon: <Gift size={20} /> },
    { id: "settings", label: "Cài Đặt", icon: <Settings size={20} /> },
    { id: "statistics", label: "Thống Kê", icon: <BarChart3 size={20} /> },
  ]

  return (
    <aside className="w-64 bg-white shadow-md p-6 min-h-[calc(100vh-4rem)]">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

