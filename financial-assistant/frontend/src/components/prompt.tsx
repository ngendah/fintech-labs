'use client'

import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea,
} from '@/components/ui/prompt-input'
import { Button } from '@/components/ui/button'
import { ArrowUp, Square } from 'lucide-react'
import React, { useState } from 'react'

export function Prompt({
    defaultPrompt = 'Ask me anything...',
    onSubmit,
    isLoading = false,
}: {
    defaultPrompt?: string
    onSubmit?: (value: string) => void
    isLoading: bool
}) {
    const [input, setInput] = useState('')

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            event.stopPropagation()
        }
        if (onSubmit) {
            onSubmit(input)
        }
    }
    const handleValueChange = (value: string) => {
        setInput(value)
    }
    return (
        <PromptInput
            value={input}
            onValueChange={handleValueChange}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full mr-2 ml-2 max-w-(--breakpoint-md)"
        >
            <PromptInputTextarea placeholder={defaultPrompt} />
            <PromptInputActions className="justify-end pt-2">
                <PromptInputAction
                    tooltip={isLoading ? 'Stop generation' : 'Send message'}
                >
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <Square className="size-5 fill-current" />
                        ) : (
                            <ArrowUp className="size-5" />
                        )}
                    </Button>
                </PromptInputAction>
            </PromptInputActions>
        </PromptInput>
    )
}
