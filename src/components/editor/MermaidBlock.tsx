import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Eye } from 'lucide-react'

interface MermaidBlockProps {
    node: {
        textContent: string
    }
    updateAttributes: (attrs: Record<string, any>) => void
}

export function MermaidBlock({ node }: MermaidBlockProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [svg, setSvg] = useState('')
    const [error, setError] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const content = node.textContent

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        })
    }, [])

    useEffect(() => {
        const renderDiagram = async () => {
            if (!content) return

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
                const { svg } = await mermaid.render(id, content)
                setSvg(svg)
                setError('')
            } catch (e) {
                console.error('Mermaid render error:', e)
                setError('Failed to render diagram. Please check syntax.')
                // Keep the previous SVG if possible, or just show error
            }
        }

        if (!isEditing) {
            renderDiagram()
        }
    }, [content, isEditing])

    return (
        <NodeViewWrapper className="relative my-4 group">
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-8 w-8 p-0"
                >
                    {isEditing ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </Button>
            </div>

            {isEditing ? (
                <div className="relative">
                    <div className="absolute top-0 right-0 bg-muted px-2 py-1 text-xs text-muted-foreground rounded-bl">
                        Mermaid Source
                    </div>
                    <NodeViewContent className="font-mono text-sm bg-muted p-4 rounded-md min-h-[100px] outline-none" />
                </div>
            ) : (
                <div className="border rounded-md p-4 bg-card flex justify-center overflow-x-auto">
                    {error ? (
                        <div className="text-destructive text-sm">{error}</div>
                    ) : (
                        <div
                            ref={containerRef}
                            dangerouslySetInnerHTML={{ __html: svg }}
                            className="mermaid-diagram"
                        />
                    )}
                    {/* Hidden content to keep Tiptap state in sync even when viewing diagram */}
                    <div className="hidden">
                        <NodeViewContent />
                    </div>
                </div>
            )}
        </NodeViewWrapper>
    )
}
