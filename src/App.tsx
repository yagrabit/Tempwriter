import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Toolbar } from '@/components/editor/Toolbar'
import { CommandPalette } from '@/components/editor/CommandPalette'
import { MermaidExtension } from '@/components/editor/extensions/MermaidExtension'
import { MermaidBuilder } from '@/components/editor/MermaidBuilder'

// Setup lowlight for syntax highlighting
const lowlight = createLowlight(common)

const STORAGE_KEY = 'tempwriter_content'
const THEME_KEY = 'tempwriter_theme'

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [showMermaidBuilder, setShowMermaidBuilder] = useState(false)

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
      MermaidExtension,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[calc(100vh-200px)] p-8 dark:prose-invert bg-white/80 dark:bg-white/5 rounded-xl shadow-sm border border-black/5 dark:border-white/5',
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as any).markdown.getMarkdown()
      localStorage.setItem(STORAGE_KEY, markdown)
    },
  })

  // Load content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY)
    if (savedContent && editor) {
      editor.commands.setContent(savedContent)
    }
  }, [editor])

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
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
  }

  const handleInsertDiagram = () => {
    // In a real implementation, we might pass the type to the builder
    // For now, we just open the builder which has the templates
    setShowMermaidBuilder(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.txt"
        className="hidden"
      />

      {/* Main Editor Card */}
      <div className="w-full max-w-4xl h-[85vh] glass-panel rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300">

        {/* Floating Toolbar Container */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <Toolbar editor={editor} onOpenCommand={() => setIsCommandOpen(true)} />
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Command Palette Hint */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/50 pointer-events-none">
        Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">⌘</span>K</kbd> to open commands
      </div>

      <CommandPalette
        editor={editor}
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onThemeToggle={toggleTheme}
        onExport={handleExport}
        onImportClick={handleImportClick}
        onInsertDiagram={handleInsertDiagram}
      />

      <MermaidBuilder
        editor={editor}
        isOpen={showMermaidBuilder}
        onClose={() => setShowMermaidBuilder(false)}
      />
    </div>
  )
}

export default App
