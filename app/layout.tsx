import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import {Toaster} from "sonner";
const inter = Inter({ subsets: ["latin"] })

// Update the metadata to Vietnamese

export const metadata: Metadata = {
  title: "Vòng Quay May Mắn",
  description: "Quay vòng quay và nhận phần thưởng",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <Toaster />
        
      </body>
    </html>
  )
}


