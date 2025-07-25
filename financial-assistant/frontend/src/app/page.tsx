'use client'

import { Prompt } from '@/components/prompt'
import { useEffect, useState } from 'react'
import { ScrollableContainer } from '@/components/scrollable-container'
import {
    QueryMessage,
    ResponseMessage,
    ResponseLoading,
} from '@/components/message'
import { ModeToggle } from '@/components/mode-toggle'
import { useWebSocket } from '@/components/web-socket'

export default function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const { socket } = useWebSocket()
    const [messages, setMessage] = useMessageMap()
    const onSubmit = (value: string) => {
        if (socket == null) return
        setIsLoading(true)
        const message = new Message(Date.now(), 'user', value)
        socket.send(message.toJson())
        setMessage(message)
    }
    useEffect(() => {
        if (!socket) return
        const handleMessage = (event: MessageEvent) => {
            setIsLoading(false)
            const message = Message.fromJson(JSON.parse(event.data))
            setMessage(message)
        }
        socket.addEventListener('message', handleMessage)
        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [socket])

    return (
        <>
            <nav className="fixed top w-full flex flex-row items-center pt-4 pb-4 pl-12 bg-background">
                <div className="text-lg font-bold mr-6">FinTech-Labs</div>
                <ModeToggle />
            </nav>
            <ScrollableContainer className="pt-[10vh]">
                {messages.map((message) =>
                    message.role === 'user' ? (
                        <QueryMessage
                            key={message.key}
                            message={message.content}
                        />
                    ) : (
                        <ResponseMessage
                            key={message.key}
                            message={message.content}
                        />
                    )
                )}
                {isLoading ? <ResponseLoading /> : <></>}
                <div className="h-[15rem]"></div>
            </ScrollableContainer>
            <div className="fixed bottom-[10vh] w-full justify-items-center">
                <Prompt
                    defaultPrompt="Ask me about Safaricom Financial performance for 2024 ..."
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}

class Message {
    readonly id: number
    readonly role: 'user' | 'assistant'
    readonly content: string
    readonly key: string

    constructor(id: number, role: 'user' | 'assistant', content: string) {
        this.id = id
        this.role = role
        this.content = content
        this.key = `${this.id}:${this.role}`
    }

    toString(): string {
        return `[Message(${this.id}, ${this.role})]`
    }

    toJson(): string {
        return JSON.stringify({
            id: this.id,
            role: this.role,
            content: this.content,
        })
    }

    static fromJson(json: {
        id: number
        role: 'user' | 'assistant'
        content: string
    }): Message {
        return new Message(json.id, json.role, json.content)
    }
}

function useMessageMap(initial?: Map<string, Message>) {
    const [map, setMap] = useState(initial ?? new Map())
    const set = (msg: Message) => {
        setMap((prev) => {
            const next = new Map(prev)
            next.set(msg.key, msg)
            return next
        })
    }
    return [Array.from(map.values()), set]
}
