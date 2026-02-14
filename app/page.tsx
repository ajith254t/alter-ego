"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Ego = {
  name: string;
  role: string;
  tone: string;
  knowledge: string;
};

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashAnimated, setSplashAnimated] = useState(false);
  const [ego, setEgo] = useState<Ego | null>(null);
  const [form, setForm] = useState<Ego>({
    name: "",
    role: "",
    tone: "",
    knowledge: "",
  });

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger splash animation
    const animationTimer = setTimeout(() => {
      setSplashAnimated(true);
    }, 800);

    // Hide splash after complete animation
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(splashTimer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startCeremony = () => {
    if (!form.name || !form.role) return;
    setEgo(form);
  };

  const sendMessage = async () => {
    if (!input || !ego) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ego, messages: newMessages }),
    });

    const text = await res.text();

    setMessages([...newMessages, { role: "assistant", content: text }]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30 animate-pulse"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
          animationDuration: "4s",
        }}
      />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
          >
            {/* Logo Animation */}
            <div className="relative text-center">
              <div className="flex items-center justify-center h-[1.2em] text-[clamp(48px,12vw,72px)] font-bold tracking-[clamp(3px,1vw,6px)]">
                {/* Alter text - slides in from left */}
                <motion.div
                  initial={{ width: 0, minWidth: 0 }}
                  animate={
                    splashAnimated
                      ? { width: "auto", minWidth: "140px" }
                      : { width: 0, minWidth: 0 }
                  }
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden flex items-center"
                  style={{ maxWidth: "35vw" }}
                >
                  <span className="whitespace-nowrap pr-[0.8em] inline-block min-w-max">
                    Alter
                  </span>
                </motion.div>

                {/* AI/Ego wrapper */}
                <div className="relative inline-flex items-center justify-center w-[clamp(50px,12vw,80px)] h-[1.2em]">
                  {/* AI text - rotates and fades out */}
                  <motion.span
                    initial={{ opacity: 1, scale: 1, rotate: 0 }}
                    animate={
                      splashAnimated
                        ? { opacity: 0, scale: 0.5, rotate: 360 }
                        : { opacity: 1, scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute whitespace-nowrap tracking-[0.5em]"
                  >
                    AI
                  </motion.span>

                  {/* Ego text - scales and rotates in */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                    animate={
                      splashAnimated
                        ? { opacity: 1, scale: 1, rotateY: 0 }
                        : { opacity: 0, scale: 0.5, rotateY: 90 }
                    }
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute whitespace-nowrap"
                    style={{ perspective: "1000px" }}
                  >
                    Ego
                  </motion.span>
                </div>
              </div>

              {/* Animated dots */}
              <div className="flex gap-2 justify-center mt-[30px] h-[20px]">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay }}
                  />
                ))}
              </div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={splashAnimated ? { opacity: 0.6 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 text-[clamp(11px,2.5vw,14px)] tracking-[clamp(1px,0.3vw,2px)] whitespace-nowrap pointer-events-none"
              >
                Developed by AJITH T
              </motion.p>
            </div>
          </motion.div>
        ) : !ego ? (
          <motion.div
            key="ceremony"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10"
          >
            <h1 className="text-3xl font-bold mb-6 text-center">
              The Naming Ceremony
            </h1>

            {["name", "role", "tone", "knowledge"].map((field) => (
              <input
                key={field}
                placeholder={field.toUpperCase()}
                className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/20 backdrop-blur-md text-white placeholder:text-white/60"
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            ))}

            <button
              onClick={startCeremony}
              className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 transition"
            >
              Summon Alter Ego
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col h-[80vh] relative z-10"
          >
            <h2 className="text-xl mb-4 text-center">
              {ego.name} — {ego.role}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-white/20 text-right"
                      : "bg-white/5"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="p-3 rounded-lg bg-white/5 animate-pulse">
                  {ego.name} is composing...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Speak to your Alter Ego..."
                className="flex-1 p-3 rounded-lg bg-white/20 border border-white/20 text-white placeholder:text-white/60"
              />
              <button
                onClick={sendMessage}
                className="px-4 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
