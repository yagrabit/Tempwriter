import * as React from 'react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    SquareCode,
    Network,
    Moon,
    Sun,
    Download,
    Upload,
} from 'lucide-react'

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command'
import { type Editor } from '@tiptap/react'

interface CommandPaletteProps {
    editor: Editor | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onThemeToggle: () => void
    onExport: () => void
    onImportClick: () => void
    onInsertDiagram: (type: string) => void
}

export function CommandPalette({
    editor,
    open,
    onOpenChange,
    onThemeToggle,
    onExport,
    onImportClick,
    onInsertDiagram,
}: CommandPaletteProps) {
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange(!open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [onOpenChange])

    const runCommand = (command: () => void) => {
        command()
        onOpenChange(false)
    }

    if (!editor) return null

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Formatting">
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleBold().run())}>
                        <Bold className="mr-2 h-4 w-4" />
                        <span>Bold</span>
                        <CommandShortcut>Cmd+B</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleItalic().run())}>
                        <Italic className="mr-2 h-4 w-4" />
                        <span>Italic</span>
                        <CommandShortcut>Cmd+I</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleStrike().run())}>
                        <Strikethrough className="mr-2 h-4 w-4" />
                        <span>Strikethrough</span>
                        <CommandShortcut>Cmd+Shift+X</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleCode().run())}>
                        <Code className="mr-2 h-4 w-4" />
                        <span>Inline Code</span>
                        <CommandShortcut>Cmd+E</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Structure">
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}>
                        <Heading1 className="mr-2 h-4 w-4" />
                        <span>Heading 1</span>
                        <CommandShortcut>Cmd+Opt+1</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}>
                        <Heading2 className="mr-2 h-4 w-4" />
                        <span>Heading 2</span>
                        <CommandShortcut>Cmd+Opt+2</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}>
                        <Heading3 className="mr-2 h-4 w-4" />
                        <span>Heading 3</span>
                        <CommandShortcut>Cmd+Opt+3</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleBulletList().run())}>
                        <List className="mr-2 h-4 w-4" />
                        <span>Bullet List</span>
                        <CommandShortcut>Cmd+Shift+8</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleOrderedList().run())}>
                        <ListOrdered className="mr-2 h-4 w-4" />
                        <span>Ordered List</span>
                        <CommandShortcut>Cmd+Shift+7</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleBlockquote().run())}>
                        <Quote className="mr-2 h-4 w-4" />
                        <span>Blockquote</span>
                        <CommandShortcut>Cmd+Shift+B</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => editor.chain().focus().toggleCodeBlock().run())}>
                        <SquareCode className="mr-2 h-4 w-4" />
                        <span>Code Block</span>
                        <CommandShortcut>Cmd+Opt+C</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Insert Diagram">
                    <CommandItem onSelect={() => runCommand(() => onInsertDiagram('Flowchart'))}>
                        <Network className="mr-2 h-4 w-4" />
                        <span>Insert Flowchart</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => onInsertDiagram('Sequence'))}>
                        <Network className="mr-2 h-4 w-4" />
                        <span>Insert Sequence Diagram</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => onInsertDiagram('Class'))}>
                        <Network className="mr-2 h-4 w-4" />
                        <span>Insert Class Diagram</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="System">
                    <CommandItem onSelect={() => runCommand(onThemeToggle)}>
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Toggle Theme</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(onExport)}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export Markdown</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(onImportClick)}>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Import File</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
