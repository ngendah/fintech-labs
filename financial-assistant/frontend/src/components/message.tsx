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
            <MessageContent className="mt-2 mb-2 bg-transparent text-justify">
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

function ErrorMessage({ message }: { message: string }) {
    return (
        <Message className="justify-start">
            <MessageContent className="mt-2 mb-2 bg-red-300">
                {message}
            </MessageContent>
        </Message>
    )
}

export { QueryMessage, ResponseMessage, ResponseLoading, ErrorMessage }
