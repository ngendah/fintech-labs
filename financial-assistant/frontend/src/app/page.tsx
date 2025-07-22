import { Prompt } from '@/components/prompt';
import React from 'react';
import { ScrollableContainer } from '@/components/scrollable-container';
import {QueryMessage, ResponseMessage} from '@/components/message';

export default function Home() {
  return (
    <>
      <ScrollableContainer>
        <QueryMessage message="Hallo today how can i, help you" />
        <ResponseMessage message="Thank you for your query" />
      </ScrollableContainer>
      <div className="fixed bottom-[10vh] w-full justify-items-center">
        <Prompt defaultPrompt="Ask me about Safaricom Financial performance for 2024 ..." />
      </div>
    </>
  );
}



