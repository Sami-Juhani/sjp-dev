'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from '@/components/ui/chat/chat-bubble'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'

import { IDictionary } from '@/dictionaries/dictionaries'
import ChatBotImage from '@/public/images/sjpdev/cyber_chatbot.png'

import { useChat } from 'ai/react'
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Send,
  Volume2
} from 'lucide-react'
import { toast } from 'sonner'

import { MDXContentClient } from '../mdx/mdx-content-client'
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader
} from '../ui/chat/expandable-chat'

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: 'Copy'
  },
  {
    icon: RefreshCcw,
    label: 'Refresh'
  }
  /*   {
    icon: Volume2,
    label: 'Volume'
  } */
]

export default function ChatBot({ dict }: { dict: IDictionary }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload
  } = useChat({
    maxSteps: 5,
    onResponse(response) {
      if (response) {
        setIsGenerating(false)
      } else {
        toast.error(dict.ai.responseError)
        setIsGenerating(false)
      }
    },
    onError(error) {
      toast.error(dict.ai.responseError)
    },
    onToolCall(response) {
      if (response && process.env.NODE_ENV === 'development')
        toast.message(`${response.toolCall.toolName} called successfully`)
    }
  })

  useEffect(() => {
    if (messages.length === 0)
      setMessages([
        {
          content: dict.ai.greetings,
          id: crypto.randomUUID(),
          role: 'assistant'
        }
      ])
  }, [messages.length, setMessages, dict.ai.greetings])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)
    handleSubmit(e)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isGenerating || isLoading || !input) return
      setIsGenerating(true)
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleActionClick = async (action: string, messageIndex: number) => {
    if (action === 'Refresh') {
      setIsGenerating(true)
      try {
        await reload()
      } catch (error) {
        toast.error(dict.ai.responseError)
      } finally {
        setIsGenerating(false)
      }
    }

    if (action === 'Copy') {
      const message = messages[messageIndex]
      if (message && message.role === 'assistant') {
        navigator.clipboard.writeText(message.content)
      }
    }
  }

  const filteredMessages = messages.filter(message => message.content !== '')

  return (
    <ExpandableChat size='xl' position='bottom-right'>
      <ExpandableChatHeader className='flex-col justify-center text-center'>
        <div className='flex items-center'>
          <h1 className='text-xl font-semibold'>{dict.ai.title}</h1>
          <Image
            src={ChatBotImage}
            width={75}
            height={75}
            alt='Chat Bot Image'
          />
        </div>
        <p>{dict.ai.subTitle}</p>
        <div className='flex items-center gap-2 pt-2'>
          <Button variant='secondary' onClick={() => setMessages([])}>
            {dict.ai.newChat}
          </Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          {/* Messages */}
          {filteredMessages &&
            filteredMessages.map((message, index) => {
              return (
                <ChatBubble
                  key={index}
                  variant={message.role == 'user' ? 'sent' : 'received'}
                >
                  <ChatBubbleAvatar
                    fallback={
                      message.role == 'user' ? (
                        '👨🏽'
                      ) : (
                        <Image
                          src={ChatBotImage}
                          alt='ChatBot Image'
                          fill
                          className='object-cover p-1'
                        />
                      )
                    }
                  />
                  <ChatBubbleMessage>
                    {message.content
                      .split('```')
                      .map((part: string, index: number) => {
                        return <MDXContentClient key={index} source={part} />
                      })}

                    {message.role === 'assistant' &&
                      messages.length - 1 === index && (
                        <div className='mt-1.5 flex items-center gap-1'>
                          {!isGenerating && messages.length > 1 && (
                            <>
                              {ChatAiIcons.map((icon, iconIndex) => {
                                const Icon = icon.icon
                                return (
                                  <ChatBubbleAction
                                    variant='outline'
                                    className='size-5'
                                    key={iconIndex}
                                    icon={<Icon className='size-3' />}
                                    onClick={() =>
                                      handleActionClick(icon.label, index)
                                    }
                                  />
                                )
                              })}
                            </>
                          )}
                        </div>
                      )}
                  </ChatBubbleMessage>
                </ChatBubble>
              )
            })}

          {/* Loading */}
          {isGenerating && (
            <ChatBubble variant='received'>
              <ChatBubbleAvatar
                src=''
                fallback={
                  <Image
                    src={ChatBotImage}
                    alt='ChatBot Image'
                    fill
                    className='object-cover p-1'
                  />
                }
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className='bg-background focus-within:ring-ring relative rounded-lg border focus-within:ring-1'
        >
          <ChatInput
            value={input}
            onKeyDown={onKeyDown}
            onChange={handleInputChange}
            placeholder='Type your message here...'
            className='bg-background rounded-lg border-0 shadow-none focus-visible:ring-0'
          />
          <div className='flex items-center p-3 pt-0'>
            {/*             <Button variant='ghost' size='icon'>
              <Paperclip className='size-4' />
              <span className='sr-only'>Attach file</span>
            </Button>

            <Button variant='ghost' size='icon'>
              <Mic className='size-4' />
              <span className='sr-only'>Use Microphone</span>
            </Button> */}

            <Button
              disabled={!input || isLoading}
              type='submit'
              size='sm'
              className='ml-auto gap-1.5'
            >
              <Send className='size-4' />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}
