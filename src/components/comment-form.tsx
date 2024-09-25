"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CommentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Comment submitted", { title, body })
    setIsOpen(false)
    setTitle("")
    setBody("")
  }

  return (
    <div className="mx-auto">
     <Button variant='outline' size='sm' disabled={isOpen} onClick={() => setIsOpen(true)}>
        Add Comment
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
          >
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter comment title"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="body">Comment</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your comment here..."
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button variant="default" size="sm" type="submit">Submit</Button>
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}