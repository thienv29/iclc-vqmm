"use client"

import { useEffect, useRef } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex space-x-2">
        <button type="button" className="p-1 hover:bg-gray-200 rounded" onClick={() => document.execCommand("bold")}>
          <span className="font-bold">Đ</span>
        </button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded" onClick={() => document.execCommand("italic")}>
          <span className="italic">N</span>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => document.execCommand("underline")}
        >
          <span className="underline">G</span>
        </button>
        <div className="w-px bg-gray-300"></div>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => document.execCommand("foreColor", false, "#FF0000")}
        >
          <span className="text-red-500">Đỏ</span>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => document.execCommand("foreColor", false, "#0000FF")}
        >
          <span className="text-blue-500">Xanh</span>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => document.execCommand("foreColor", false, "#008000")}
        >
          <span className="text-green-500">Lục</span>
        </button>
      </div>
      <div ref={editorRef} contentEditable className="p-3 min-h-[100px] focus:outline-none" onInput={handleInput} />
    </div>
  )
}

