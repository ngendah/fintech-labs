"use client"

import { Message, MessageContent } from '@/components/ui/message';
import React from 'react';

function QueryMessage({message}:{message:string}) {
  return (<Message className="justify-end">
      <MessageContent className="mt-2 mb-2">
        {message}
      </MessageContent>
    </Message>
  );
}

function ResponseMessage ({message}:{message:string}) {
  return (
    <Message className="justify-start">
      <MessageContent className="mt-2 mb-2 bg-transparent">
        {message}
      </MessageContent>
    </Message>
  );
}

export {QueryMessage, ResponseMessage};
