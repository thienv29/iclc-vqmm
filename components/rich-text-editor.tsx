"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md p-2">
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          Bullet List
        </button>
      </div>
      <EditorContent editor={editor} className="prose max-w-full" />
    </div>
  )
}

export default RichTextEditor

