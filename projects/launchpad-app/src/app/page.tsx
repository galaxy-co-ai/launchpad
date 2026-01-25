"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import ErrorBoundary from "@/components/error-boundary";

export default function HomePage() {
  return (
    <ErrorBoundary boundaryName="Chat">
      <ChatContainer />
    </ErrorBoundary>
  );
}
