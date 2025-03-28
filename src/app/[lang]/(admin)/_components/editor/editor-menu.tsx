import { type ReactNode, useEffect } from 'react'

import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel/extensions'

interface EditorMenuProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditorMenu({
  children,
  open,
  onOpenChange
}: EditorMenuProps) {
  const { editor } = useEditor()

  useEffect(() => {
    if (!editor) return
    if (!open) removeAIHighlight(editor)
  }, [open])

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? 'bottom-start' : 'top',
        onHidden: () => {
          onOpenChange(false)
          editor?.chain().unsetHighlight().run()
        }
      }}
      className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
    >
      {!open && children}
    </EditorBubble>
  )
}
