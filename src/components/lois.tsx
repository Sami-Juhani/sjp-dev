'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { Message, useChat } from 'ai/react'
import { debounce } from 'lodash'

import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'
import { MDXContentClient } from './mdx-content-client'

import { DictionaryResult } from '@/dictionaries/dictionaries'
import LoisImage from '/public/images/sjpdev/lois.png'

const MAX_HISTORY = 10

export default function Lois({ dict }: { dict: DictionaryResult }) {
  const [chatHistory, setChatHistory] = useLocalStorage<Message[]>(
    'chatMessages',
    []
  )

  const { messages, input, handleInputChange, isLoading, handleSubmit } =
    useChat({
      maxSteps: 5,
      initialMessages:
        chatHistory.length === 0
          ? [
              {
                content:
                  "Hello, I'm Lois, your personal assistant. Feel free to ask me anything about SjP Software Development or Sami.\n\n How may I assist you today?",
                id: crypto.randomUUID(),
                role: 'assistant'
              }
            ]
          : chatHistory,
      onError(error) {
        if (process.env.NODE_ENV === 'development')
          throw new Error(error.message)
        else toast.error(dict.lois.responseError)
      }
    })

  const [isOpen, setIsOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const loisIconRef = useRef<HTMLButtonElement>(null)
  const openMsgTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  const saveMessagesDebounced = useRef(
    debounce((newMessages: Message[]) => {
      console.log('Saving messages')
      if (newMessages.length < MAX_HISTORY) {
        setChatHistory(newMessages)
      } else {
        setChatHistory(prev => [...prev, ...newMessages].slice(-MAX_HISTORY))
      }
    }, 500)
  ).current

  const scrollToBottom = (behavior: ScrollBehavior) => {
    if (!messagesContainerRef.current) return
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior
    })
  }

  useEffect(() => {
    if (messages.length === 1) {
      openMsgTimeout.current = setTimeout(() => setIsOpen(true), 10000)
    }

    if (messages !== chatHistory) {
      saveMessagesDebounced(messages) // Save with debounce
    }

    return () => {
      if (openMsgTimeout.current) clearTimeout(openMsgTimeout.current)
    }
  }, [messages, saveMessagesDebounced, chatHistory])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        messagesContainerRef.current &&
        !messagesContainerRef.current.contains(e.target as Node) &&
        loisIconRef.current &&
        !loisIconRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      scrollTimeout.current = setTimeout(() => scrollToBottom('instant'), 0)
    }
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [isOpen])

  return (
    <div className='fixed bottom-0 right-0 flex h-[85%] max-w-xl flex-col justify-end gap-4'>
      {isOpen && (
        <div
          className='z-10 mx-4 flex flex-col space-y-4 overflow-hidden overflow-y-auto rounded-lg bg-muted p-4 shadow-xl'
          ref={messagesContainerRef}
        >
          {messages.map(m => (
            <div key={m.id} className='whitespace-pre-wrap'>
              {m.role === 'user' ? (
                <span className='font-bold'>You: </span>
              ) : m.content.length > 0 ? (
                <span className='font-bold'>Lois: </span>
              ) : null}
              {process.env.NODE_ENV !== 'production' &&
                m.content.length == 0 && (
                  <p>
                    <span className='font-bold'>Lois: </span>
                    <span className='font-light italic'>
                      calling tool: {m?.toolInvocations?.[0].toolName}
                    </span>
                  </p>
                )}
              {m.content.length > 0 && <MDXContentClient source={m.content} />}
            </div>
          ))}

          {isLoading &&
            messages[messages.length - 1].role === 'assistant' &&
            !messages[messages.length - 1].content && <LoisThinking />}

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <input
              className='w-full rounded border border-gray-300 p-2'
              value={input}
              placeholder={dict.lois.inputPh}
              onChange={handleInputChange}
            />
          </form>
        </div>
      )}

      <button
        type='button'
        className='ml-auto mr-4'
        onClick={() => {
          if (openMsgTimeout.current) {
            clearTimeout(openMsgTimeout.current)
            openMsgTimeout.current = null
          }
          setIsOpen(o => !o)
          scrollToBottom('instant')
        }}
        ref={loisIconRef}
      >
        <Image
          src={LoisImage}
          alt='Image of AI assistant'
          width={100}
          height={100}
          draggable={false}
        />
      </button>
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
