import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MermaidBlock } from '../MermaidBlock'

export const MermaidExtension = Node.create({
    name: 'mermaid',

    group: 'block',

    content: 'text*',

    marks: '',

    code: true,

    defining: true,

    addAttributes() {
        return {
            language: {
                default: 'mermaid',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'pre',
                preserveWhitespace: 'full',
                getAttrs: (node) => {
                    const element = node as HTMLElement
                    const codeElement = element.querySelector('code')
                    if (codeElement?.classList.contains('language-mermaid')) {
                        return {}
                    }
                    return false
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'pre',
            mergeAttributes(HTMLAttributes, { 'data-language': 'mermaid' }),
            ['code', { class: 'language-mermaid' }, 0],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidBlock)
    },
})
