'use client'

import { Prompt } from '@/components/prompt'
import { useEffect, useState } from 'react'
import { ScrollableContainer } from '@/components/scrollable-container'
import {
    QueryMessage,
    ResponseMessage,
    ResponseLoading,
    ErrorMessage,
} from '@/components/message'
import { ModeToggle } from '@/components/mode-toggle'
import { useWebSocket } from '@/components/web-socket'

export default function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
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
        setIsConnected(true)
        const handleMessage = (event: MessageEvent) => {
            setIsLoading(false)
            const message = Message.fromJson(JSON.parse(event.data))
            setMessage(message)
        }
        socket.addEventListener('close', () => {
            setIsConnected(false)
            const errMessage = new Message(
                Date.now(),
                'error',
                'LLM Chat connection is not available'
            )
            setMessage(errMessage)
        })
        socket.addEventListener('message', handleMessage)
        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [socket])

    const messageElem = (message: Message) => {
        let elem
        switch (message.role) {
            case 'user':
                elem = (
                    <QueryMessage key={message.key} message={message.content} />
                )
                break
            case 'assistant':
                elem = (
                    <ResponseMessage
                        key={message.key}
                        message={message.content}
                    />
                )
                break
            case 'error':
                elem = (
                    <ErrorMessage key={message.key} message={message.content} />
                )
                break
            default:
                elem = (
                    <ResponseMessage
                        key={message.key}
                        message={message.content}
                    />
                )
                break
        }
        return elem
    }

    return (
        <>
            <nav className="fixed top w-full flex flex-row items-center h-16 pt-4 pb-4 pl-12 bg-background">
                <div className="text-lg font-bold mr-6">FinTech-Labs</div>
                <ModeToggle />
            </nav>
            <div className="pt-16">
                <ScrollableContainer>
                    {messages.map(messageElem)}
                    {isLoading ? <ResponseLoading /> : <></>}
                    <div className="h-[15rem]"></div>
                </ScrollableContainer>
                <div className="fixed bottom-[10vh] w-full justify-items-center">
                    <Prompt
                        defaultPrompt="Ask me about Safaricom and Equity Bank Financial performance for 2024 ..."
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        isDisabled={!isConnected}
                    />
                </div>
            </div>
        </>
    )
}

type Role = 'user' | 'error' | 'assistant'

class Message {
    readonly id: number
    readonly role: Role
    readonly content: string
    readonly key: string

    constructor(id: number, role: Role, content: string) {
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
        role: Role
        content: string
    }): Message {
        return new Message(json.id, json.role, json.content)
    }
}

function useMessageMap(
    initial?: Map<string, Message>
): [Message[], (message: Message) => void] {
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
