'use client'

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

type WebSocketContextType = {
    socket: WebSocket | null
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null })

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: ReactNode
}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        let ws: WebSocket
        const setupWebSocket = async () => {
            try {
                const res = await fetch('config.json')
                if (!res) throw new Error('Failed to load config.json')
                const config = await res.json()
                const chat_url = config.chat_url
                assertIsWebSocketUrl(chat_url)
                if (!chat_url) {
                    throw new Error('Backend chat socket is not provided')
                }
                ws = new WebSocket(chat_url)
                ws.onopen = () => {
                    console.log('✅ WebSocket connected')
                    setSocket(ws)
                }
                ws.onerror = (e) => {
                    console.error('❌ WebSocket error:', e)
                }
                ws.onclose = (e) => {
                    console.warn(
                        '⚠️ WebSocket closed:',
                        e.reason || 'no reason'
                    )
                    setSocket(null) // Remove it from context when disconnected
                }
            } catch (err) {
                console.error('Failed to initialize WebSocket:', err)
            }
        }
        setupWebSocket()
        return () => {
            ws?.close()
        }
    }, [])
    return (
        <WebSocketContext.Provider value={{ socket }}>
            {children}
        </WebSocketContext.Provider>
    )
}

class InvalidWebSocketUrlError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidWebSocketUrlError'
    }
}

function assertIsWebSocketUrl(urlStr: string | undefined | null): void {
    let url: URL
    if (!urlStr)
        throw new InvalidWebSocketUrlError(`Invalid URL syntax: "${urlStr}"`)
    try {
        url = new URL(urlStr)
    } catch {
        throw new InvalidWebSocketUrlError(`Invalid URL syntax: "${urlStr}"`)
    }
    if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
        throw new InvalidWebSocketUrlError(
            `Unsupported protocol: "${url.protocol}". Use "ws:" or "wss:"`
        )
    }
    if (!url.hostname) {
        throw new InvalidWebSocketUrlError('Missing hostname in WebSocket URL')
    }
    if (url.port) {
        const portNum = Number(url.port)
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
            throw new InvalidWebSocketUrlError(
                `Invalid port number: "${url.port}"`
            )
        }
    }
}
