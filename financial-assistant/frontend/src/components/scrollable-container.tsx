"use client"

import React from 'react';
import { cn } from '@/lib/utils';

type ScrollableContainerProps = {
  isLoading?: boolean
  children: React.ReactNode
  className?: string
}

export  function ScrollableContainer({ isLoading = false, children, className }: ScrollableContainerProps) {
  return (
    <div className={
      cn('md:max-w-2/5 md:mx-auto', className)
    }>
      {children}
    </div>
  );
}
