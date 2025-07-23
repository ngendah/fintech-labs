'use client'

import { Message, MessageContent } from '@/components/ui/message'
import { Loader } from '@/components/ui/loader'
import React from 'react'

function QueryMessage({ message }: { message: string }) {
    return (
        <Message className="justify-end">
            <MessageContent className="mt-2 mb-2">{message}</MessageContent>
        </Message>
    )
}

function ResponseMessage({ message }: { message: string }) {
    return (
        <Message className="justify-start">
            <MessageContent className="mt-2 mb-2 bg-transparent">
                {message}
            </MessageContent>
        </Message>
    )
}

function ResponseLoading() {
    return (
        <Message className="justify-start">
            <Loader variant="dots" size="md" />
        </Message>
    )
}

export { QueryMessage, ResponseMessage, ResponseLoading }
