'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import Image from 'next/image'

import LoisImage from '/public/images/sjpdev/lois.png'
import { DictionaryResult } from '@/dictionaries/dictionaries'

export default function Lois({ dict }: { dict: DictionaryResult }) {
  const { messages, input, handleInputChange, isLoading, handleSubmit } =
    useChat({
      maxSteps: 5
    })
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current == null) return
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
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
    <div
      className='sticky bottom-0 ml-auto p-8 w-3/4 max-w-md'
      ref={aiRef}
    >
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

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          isOpen == false && setIsOpen(true)
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

      {/* Messages */}
      {isOpen && messages.length > 0 && (
        <div className='absolute bottom-48 right-8 z-10 flex max-h-[60vh] w-full max-w-md flex-col space-y-4 overflow-auto border border-dashed border-zinc-600 rounded-lg bg-muted p-4 shadow-xl'>
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

              <p>{m.content.length > 0 && m.content}</p>
            </div>
          ))}
          {/* isPending -> Show pending state */}
          {isLoading &&
            messages[messages.length - 1].role === 'assistant' &&
            !messages[messages.length - 1].content && <LoisThinking />}
          <div ref={messagesEndRef} />
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
