import { Editor } from '@/components/editor/Editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, Moon, Sun } from 'lucide-react'

// Setup lowlight for syntax highlighting
const lowlight = createLowlight(common)

const STORAGE_KEY = 'tempwriter_content'
const THEME_KEY = 'tempwriter_theme'

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown,
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[calc(100vh-200px)] p-4 dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as any).markdown.getMarkdown()
      localStorage.setItem(STORAGE_KEY, markdown)
    },
  })

  // Load content
  useEffect(() => {
    if (editor) {
      const savedContent = localStorage.getItem(STORAGE_KEY)
      if (savedContent) {
        editor.commands.setContent(savedContent)
      }
    }
  }, [editor])

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }

  const handleExport = () => {
    if (!editor) return
    const markdown = (editor.storage as any).markdown.getMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      editor.commands.setContent(content)
      // Also update localStorage immediately
      localStorage.setItem(STORAGE_KEY, content)
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">Tempwriter</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".md,.txt"
              className="hidden"
            />
            <Button variant="ghost" size="icon" onClick={handleImportClick} title="Import Markdown">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleExport} title="Export Markdown">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col container mx-auto">
        <Editor editor={editor} />
      </main>
    </div>
  )
}

export default App
