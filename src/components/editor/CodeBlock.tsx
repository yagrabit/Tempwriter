import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'

const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
]

interface CodeBlockProps {
    node: {
        attrs: {
            language?: string
        }
    }
    updateAttributes: (attrs: { language: string }) => void
    extension: any
}

export function CodeBlock({ node: { attrs }, updateAttributes }: CodeBlockProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(attrs.language || 'javascript')

    return (
        <NodeViewWrapper className="code-block relative group my-4 rounded-md border bg-muted/50">
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="h-6 w-[120px] justify-between text-xs bg-background"
                        >
                            {value
                                ? languages.find((language) => language.value === value)?.label
                                : "Select language..."}
                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandList>
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup>
                                    {languages.map((language) => (
                                        <CommandItem
                                            key={language.value}
                                            value={language.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                updateAttributes({ language: currentValue })
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === language.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {language.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <pre className="p-4 rounded-md overflow-x-auto">
                <NodeViewContent />
            </pre>
        </NodeViewWrapper>
    )
}
