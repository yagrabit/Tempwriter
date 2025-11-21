import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { type Editor } from '@tiptap/react'

interface MermaidBuilderProps {
    editor: Editor | null
    isOpen: boolean
    onClose: () => void
}

const TEMPLATES = [
    {
        name: 'Flowchart',
        code: `graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No --> E[End]`,
    },
    {
        name: 'Sequence Diagram',
        code: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
    },
    {
        name: 'Class Diagram',
        code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }`,
    },
    {
        name: 'State Diagram',
        code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    },
    {
        name: 'Gantt Chart',
        code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    },
    {
        name: 'Pie Chart',
        code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
    },
]

export function MermaidBuilder({ editor, isOpen, onClose }: MermaidBuilderProps) {
    const insertTemplate = (code: string) => {
        if (editor) {
            editor.chain().focus().insertContent(`\n\`\`\`mermaid\n${code}\n\`\`\`\n`).run()
        }
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Insert Diagram</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {TEMPLATES.map((template) => (
                        <Button
                            key={template.name}
                            variant="outline"
                            className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => insertTemplate(template.code)}
                        >
                            <span className="font-semibold">{template.name}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
