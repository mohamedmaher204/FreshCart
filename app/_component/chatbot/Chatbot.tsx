"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────
type Lang = "en" | "ar";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  isMarkdown?: boolean;
}

interface QuickChip {
  labelEn: string;
  labelAr: string;
  messageEn: string;
  messageAr: string;
  icon: string;
}

// ─── Quick-action chips ────────────────────────────────────────────────────
const CHIPS: QuickChip[] = [
  { icon: "🛍️", labelEn: "Products",  labelAr: "المنتجات",  messageEn: "Show me available products",          messageAr: "أرني المنتجات المتاحة" },
  { icon: "🔥", labelEn: "Deals",     labelAr: "العروض",    messageEn: "Show current discounts and deals",    messageAr: "أرني الخصومات والعروض الحالية" },
  { icon: "💳", labelEn: "Payment",   labelAr: "الدفع",     messageEn: "What payment methods do you accept?", messageAr: "ما هي طرق الدفع المتاحة؟" },
  { icon: "🚚", labelEn: "Delivery",  labelAr: "التوصيل",   messageEn: "How long does delivery take?",        messageAr: "كم يستغرق وقت التوصيل؟" },
  { icon: "📦", labelEn: "My Orders", labelAr: "طلباتي",    messageEn: "Track my orders",                     messageAr: "تتبع طلباتي" },
  { icon: "🗂️", labelEn: "Categories",labelAr: "الأقسام",  messageEn: "What categories do you have?",        messageAr: "ما هي أقسام المنتجات؟" },
];

// ─── Markdown-lite renderer ─────────────────────────────────────────────────
// Renders **bold**, ~~strikethrough~~, • bullets, and _italic_
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        // Replace inline markdown tokens
        const parts = line
          .replace(/\*\*(.*?)\*\*/g, "<<BOLD>>$1<<ENDBOLD>>")
          .replace(/~~(.*?)~~/g, "<<STRIKE>>$1<<ENDSTRIKE>>")
          .replace(/_(.*?)_/g, "<<ITALIC>>$1<<ENDITALIC>>")
          .split(/(<<BOLD>>.*?<<ENDBOLD>>|<<STRIKE>>.*?<<ENDSTRIKE>>|<<ITALIC>>.*?<<ENDITALIC>>)/);

        const rendered = parts.map((part, j) => {
          if (part.startsWith("<<BOLD>>"))
            return <strong key={j}>{part.replace(/<<BOLD>>|<<ENDBOLD>>/g, "")}</strong>;
          if (part.startsWith("<<STRIKE>>"))
            return <s key={j} style={{ opacity: 0.6 }}>{part.replace(/<<STRIKE>>|<<ENDSTRIKE>>/g, "")}</s>;
          if (part.startsWith("<<ITALIC>>"))
            return <em key={j}>{part.replace(/<<ITALIC>>|<<ENDITALIC>>/g, "")}</em>;
          return <span key={j}>{part}</span>;
        });

        return (
          <span key={i}>
            {rendered}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [lang, setLang]       = useState<Lang>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const messagesEndRef         = useRef<HTMLDivElement>(null);
  const inputRef               = useRef<HTMLInputElement>(null);

  const isRTL = lang === "ar";
  const welcomeText =
    lang === "en"
      ? "Welcome to FreshCart 👋 How can I help you today?"
      : "مرحباً بك في FreshCart 👋 كيف يمكنني مساعدتك اليوم؟";

  // Init / re-init on lang change
  useEffect(() => {
    setMessages([{ id: Date.now(), from: "bot", text: welcomeText, isMarkdown: false }]);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // ── Send message to API ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now(), from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, lang }),
      });

      const json = await res.json();
      const reply: string = json.reply ?? (lang === "en" ? "Something went wrong. Please try again." : "حدث خطأ ما. حاول مجدداً.");

      const botMsg: Message = { id: Date.now() + 1, from: "bot", text: reply, isMarkdown: true };
      setMessages((prev) => [...prev, botMsg]);

      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: lang === "en" ? "⚠️ Connection error. Please check your internet and try again." : "⚠️ خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [lang, loading, open]);

  const handleChip = (chip: QuickChip) => {
    const msg = lang === "en" ? chip.messageEn : chip.messageAr;
    sendMessage(msg);
  };

  // ── Styles (inline to keep zero external CSS deps) ───────────────────────
  const s = {
    // Toggle button
    toggleBtn: {
      position: "fixed" as const,
      bottom: "24px",
      right: "24px",
      zIndex: 9999,
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      background: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 24px rgba(16,185,129,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
    } as React.CSSProperties,

    // Chat window
    window: (open: boolean): React.CSSProperties => ({
      position: "fixed",
      bottom: "96px",
      right: "24px",
      zIndex: 9998,
      width: "360px",
      maxHeight: "560px",
      display: "flex",
      flexDirection: "column",
      borderRadius: "18px",
      overflow: "hidden",
      boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
      background: "#ffffff",
      fontFamily: "inherit",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
    }),
  };

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────── */}
      <button
        id="chatbot-toggle"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        style={s.toggleBtn}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: "2px", right: "2px",
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", width: "18px", height: "18px",
            fontSize: "10px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>
            {unread}
          </span>
        )}

        {/* Pulse ring */}
        {!open && (
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid #10b981",
            animation: "chatPulse 2.2s ease-out infinite",
          }} />
        )}
      </button>

      {/* ── Chat Window ──────────────────────────────────────── */}
      <div
        id="chatbot-window"
        role="dialog"
        aria-label="FreshCart Support Chat"
        dir={isRTL ? "rtl" : "ltr"}
        style={s.window(open)}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#10b981 0%,#059669 100%)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
            }}>🛒</div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                FreshCart Support
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#86efac", display: "inline-block",
                }} />
                <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
                  {lang === "en" ? "Online · Replies instantly" : "متصل · يرد فوراً"}
                </p>
              </div>
            </div>
          </div>

          {/* Language toggle */}
          <button
            id="chatbot-lang-toggle"
            onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              cursor: "pointer",
              letterSpacing: "0.3px",
              transition: "background 0.2s",
            }}
          >
            {lang === "en" ? "🌐 عربي" : "🌐 English"}
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "#f8fafc",
          scrollbarWidth: "thin",
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
            }}>
              {msg.from === "bot" && (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", flexShrink: 0,
                  marginRight: isRTL ? "0" : "7px",
                  marginLeft: isRTL ? "7px" : "0",
                  alignSelf: "flex-end",
                }}>🛒</div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "10px 14px",
                borderRadius: msg.from === "user"
                  ? "16px 4px 16px 16px"
                  : "4px 16px 16px 16px",
                background: msg.from === "user"
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "#ffffff",
                color: msg.from === "user" ? "#fff" : "#1e293b",
                fontSize: "13px",
                lineHeight: "1.6",
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                wordBreak: "break-word",
              }}>
                {msg.isMarkdown ? renderMarkdown(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "7px", alignItems: "center" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg,#10b981,#059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>🛒</div>
              <div style={{
                padding: "10px 16px", borderRadius: "4px 16px 16px 16px",
                background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                display: "flex", gap: "5px", alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "#10b981", display: "inline-block",
                    animation: `chatDot 1.3s ${i * 0.2}s ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick-action chips */}
        <div style={{
          padding: "8px 10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          borderTop: "1px solid #f1f5f9",
          background: "#fff",
          flexShrink: 0,
        }}>
          {CHIPS.map((chip, i) => (
            <button
              key={i}
              id={`chatbot-chip-${i}`}
              disabled={loading}
              onClick={() => handleChip(chip)}
              style={{
                background: loading ? "#f1f5f9" : "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "20px",
                color: loading ? "#94a3b8" : "#065f46",
                fontSize: "11px",
                fontWeight: 600,
                padding: "5px 10px",
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{chip.icon}</span>
              <span>{lang === "en" ? chip.labelEn : chip.labelAr}</span>
            </button>
          ))}
        </div>

        {/* Input row */}
        <div style={{
          padding: "10px 12px",
          borderTop: "1px solid #f1f5f9",
          background: "#fff",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
            placeholder={lang === "en" ? "Ask anything…" : "اسأل أي شيء…"}
            disabled={loading}
            style={{
              flex: 1,
              border: "1.5px solid #e2e8f0",
              borderRadius: "22px",
              padding: "9px 15px",
              fontSize: "13px",
              outline: "none",
              color: "#1e293b",
              background: "#f8fafc",
              direction: isRTL ? "rtl" : "ltr",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#10b981")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <button
            id="chatbot-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
            style={{
              width: "38px", height: "38px",
              borderRadius: "50%",
              background: loading || !input.trim()
                ? "#e2e8f0"
                : "linear-gradient(135deg,#10b981,#059669)",
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={loading || !input.trim() ? "#94a3b8" : "#fff"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Contact Support */}
        <div style={{
          padding: "8px 12px 12px",
          background: "#fff",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <Link
            href="/contact"
            id="chatbot-contact-support"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg,#10b981,#059669)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "22px",
              padding: "8px 22px",
              fontSize: "12px",
              fontWeight: 700,
              boxShadow: "0 2px 10px rgba(16,185,129,0.3)",
              transition: "opacity 0.15s, transform 0.15s",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📞 {lang === "en" ? "Support Center" : "مركز الدعم"}
          </Link>
        </div>
      </div>

      {/* ── Global keyframes ─────────────────────────────────── */}
      <style>{`
        @keyframes chatPulse {
          0%   { transform:scale(1);   opacity:.75; }
          100% { transform:scale(1.8); opacity:0;   }
        }
        @keyframes chatDot {
          0%,80%,100% { transform:scale(.65); opacity:.4; }
          40%          { transform:scale(1);   opacity:1;  }
        }
        #chatbot-window::-webkit-scrollbar { width:4px; }
        #chatbot-window::-webkit-scrollbar-thumb {
          background:#bbf7d0; border-radius:4px;
        }
      `}</style>
    </>
  );
}
