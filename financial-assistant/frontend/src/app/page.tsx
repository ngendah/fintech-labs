import { Prompt } from '@/components/prompt'
import React from 'react'
import { ScrollableContainer } from '@/components/scrollable-container'
import { QueryMessage, ResponseMessage } from '@/components/message'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
    return (
        <>
            <nav className="flex flex-row-reverse mt-4 mr-12 ml-12">
                <ModeToggle />
            </nav>
            <ScrollableContainer>
                <QueryMessage message="Hallo today how can i, help you" />
                <ResponseMessage message="Thank you for your query" />
            </ScrollableContainer>
            <div className="fixed bottom-[10vh] w-full justify-items-center">
                <Prompt defaultPrompt="Ask me about Safaricom Financial performance for 2024 ..." />
            </div>
        </>
    )
}
