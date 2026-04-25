import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { askQuestion } from "../api/client";

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "agent",
      content: "Hey there! Ask me anything about any country — capitals, languages, currencies, population, borders, and more.",
      data: null,
      timestamp: timestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, {
      id: Date.now(),
      role: "user",
      content: question,
      data: null,
      timestamp: timestamp(),
    }]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const data = await askQuestion(question);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: "agent",
        content: data.answer,
        data,
        timestamp: timestamp(),
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: "agent",
        content: `Something went wrong: ${err.message}`,
        data: null,
        timestamp: timestamp(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-full overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-end gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl avatar-ai flex items-center justify-center text-sm flex-shrink-0">
              🌍
            </div>
            <div className="msg-agent rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent mx-5" />

      {/* Input */}
      <div className="px-5 py-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any country…"
            rows={1}
            disabled={loading}
            className="input-glow flex-1 resize-none rounded-xl px-4 py-3 text-sm leading-relaxed disabled:opacity-50 font-['Sora']"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-send text-white font-medium px-5 py-3 rounded-xl text-sm flex-shrink-0 flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-2.5">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
