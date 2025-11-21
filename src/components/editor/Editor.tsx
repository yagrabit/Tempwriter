import { EditorContent, type Editor as EditorType } from '@tiptap/react'
import { Toolbar } from './Toolbar'

interface EditorProps {
    editor: EditorType | null
}

export function Editor({ editor }: EditorProps) {
    return (
        <div className="flex flex-col w-full h-full bg-background text-foreground">
            <Toolbar editor={editor} />
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
