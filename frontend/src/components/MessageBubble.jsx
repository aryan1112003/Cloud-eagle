import { useState } from "react";
import AgentSteps from "./AgentSteps";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${isUser ? "avatar-user text-slate-300" : "avatar-ai"}`}>
        {isUser ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        ) : "🌍"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? "msg-user text-white rounded-br-sm" : "msg-agent text-slate-100 rounded-bl-sm"}`}>
          {message.content}
        </div>

        {/* Agent reasoning steps */}
        {!isUser && message.data && <AgentSteps data={message.data} />}

        <span className="text-xs text-slate-600 mt-1.5 px-1 font-light">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
