'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Message, useChat } from 'ai/react'
import Image from 'next/image'

import { toast } from 'sonner'

import LoisImage from '/public/images/sjpdev/lois.png'
import { DictionaryResult } from '@/dictionaries/dictionaries'
import { MDXContentClient } from './mdx-content-client'

export default function Lois({ dict }: { dict: DictionaryResult }) {
  const [initialMessage, setInitialMessage] = useState<Message[]>([])
  const { messages, input, handleInputChange, isLoading, handleSubmit } =
    useChat({
      maxSteps: 5,
      initialMessages: initialMessage,
      onError(error) {
        if (process.env.NODE_ENV === 'development')
          throw new Error(error.message)
        else toast.error(dict.lois.responseError)
      }
    })
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length == 0)
        setInitialMessage([
          {
            content:
              "Hello, I'm Lois, your personal assistant. Feel free to ask me anything about SjP Software Development or Sami.\n\n How may I assist you today?",
            id: crypto.randomUUID(),
            role: 'assistant'
          }
        ])
    }, 8000)
    setIsOpen(true)

    return () => clearTimeout(timer)
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current == null) return
    messagesEndRef.current.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (aiRef.current && !aiRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className='fixed bottom-0 right-8 w-3/4 max-w-md' ref={aiRef}>
      <button
        type='button'
        className='relative z-20 m-0 ml-auto block'
        onClick={() => setIsOpen(o => !o)}
      >
        <Image
          src={LoisImage}
          alt='Image of AI assistant'
          width={100}
          height={100}
          draggable={false}
        />
      </button>

      {/* Messages */}
      {isOpen && messages.length > 0 && (
        <div
          className='absolute bottom-32 right-4 z-10 flex max-h-[60vh] w-full max-w-md flex-col space-y-4 overflow-auto rounded-lg border border-dashed border-zinc-600 bg-muted p-4 shadow-xl'
          ref={messagesEndRef}
        >
          {messages.map(m => (
            <div key={m.id} className='whitespace-pre-wrap'>
              {/* Prefix for message */}
              {m.role === 'user' ? (
                <span className='font-bold'>You: </span>
              ) : (
                m.content.length > 0 && (
                  <span className='font-bold'>Lois: </span>
                )
              )}

              {/* Show which tool AI used */}
              {process.env.NODE_ENV !== 'production' &&
                m.content.length == 0 && (
                  <p>
                    <span className='font-bold'>Lois: </span>
                    <span className='font-light italic'>
                      calling tool: {m?.toolInvocations?.[0].toolName}
                    </span>
                  </p>
                )}

              <>
                {m.content.length > 0 && (
                  <MDXContentClient source={m.content} />
                )}
              </>
            </div>
          ))}
          {/* isPending -> Show pending state */}
          {isLoading &&
            messages[messages.length - 1].role === 'assistant' &&
            !messages[messages.length - 1].content && <LoisThinking />}

          {/* TextInput */}
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <input
              className='w-full rounded border border-gray-300 p-2 shadow-xl'
              value={input}
              placeholder={dict.lois.inputPh}
              onChange={handleInputChange}
            />
          </form>
        </div>
      )}
    </div>
  )
}

function LoisThinking() {
  return (
    <>
      <span className='!mt-0 font-bold'>Lois: </span>
      <div className='!mt-0 flex'>
        <div className='animate-[blink] opacity-0 delay-0 duration-1000 repeat-infinite'>
          .
        </div>
        <div className='animate-[blink] opacity-0 delay-150 duration-1000 repeat-infinite'>
          .
        </div>
        <div className='animate-[blink] opacity-0 delay-300 duration-1000 repeat-infinite'>
          .
        </div>
      </div>
    </>
  )
}
