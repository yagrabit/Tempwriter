import { type Editor } from '@tiptap/react'
import { useState } from 'react'
import { MermaidBuilder } from './MermaidBuilder'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    SquareCode,
    Network,
    Command,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ToolbarProps {
    editor: Editor | null
    onOpenCommand?: () => void
}

export function Toolbar({ editor, onOpenCommand }: ToolbarProps) {
    const [showMermaidBuilder, setShowMermaidBuilder] = useState(false)

    if (!editor) {
        return null
    }

    return (
        <>
            {/* Mobile FAB */}
            {onOpenCommand && (
                <Button
                    variant="default"
                    size="icon"
                    className="flex md:hidden h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
                    onClick={onOpenCommand}
                    title="Command Palette"
                >
                    <Command className="h-6 w-6" />
                </Button>
            )}

            {/* Desktop Toolbar */}
            <div className="hidden md:flex glass-panel rounded-full p-1 items-center gap-1 shadow-lg backdrop-blur-xl bg-background/50 border border-white/20">
                <Button
                    variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('code') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('codeBlock') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    title="Code Block"
                >
                    <SquareCode className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setShowMermaidBuilder(true)}
                    title="Insert Diagram"
                >
                    <Network className="h-4 w-4" />
                </Button>

                {onOpenCommand && (
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 rounded-full ml-1 bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
                        onClick={onOpenCommand}
                        title="Command Palette (Cmd+K)"
                    >
                        <Command className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <MermaidBuilder
                editor={editor}
                isOpen={showMermaidBuilder}
                onClose={() => setShowMermaidBuilder(false)}
            />
        </>
    )
}
