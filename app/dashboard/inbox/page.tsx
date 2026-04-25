"use client";

// ============================================================
// BRANCH: feat/dashboard-inbox
// FIGMA:
//   • Dashboard — Inbox → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=78-2
// NOTION: https://www.notion.so/34874891227e8138a5abebbfd9a6d3ae
// ============================================================
// Real-time chat via Socket.io with 5s polling fallback

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { InboxSidebar, ChatWindow } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

const MOCK_THREADS = [
  { id: "1", name: "Arta Krasniqi", preview: "Faleminderit për donacionin!", time: "10:32", unread: 2 },
  { id: "2", name: "OJQ Drita", preview: "A jeni të interesuar për pozicionin?", time: "Dje", unread: 0 },
  { id: "3", name: "Besnik Hoxha", preview: "Kur fillon kampanja?", time: "E hënë", unread: 1 },
];

const MOCK_MESSAGES: Record<string, { id: string; content: string; time: string; self?: boolean }[]> = {
  "1": [
    { id: "m1", content: "Përshëndetje! Doja të pyesja për kampanjën tuaj.", time: "10:20", self: false },
    { id: "m2", content: "Mirë se vini! Si mund t'ju ndihmoj?", time: "10:22", self: true },
    { id: "m3", content: "Faleminderit për donacionin!", time: "10:32", self: false },
  ],
  "2": [
    { id: "m4", content: "A jeni të interesuar për pozicionin e mësuesit vullnetar?", time: "Dje 14:00", self: false },
  ],
  "3": [
    { id: "m5", content: "Kur fillon kampanja e re?", time: "E hënë 09:15", self: false },
    { id: "m6", content: "Kampanja fillon me 1 Maj!", time: "E hënë 09:30", self: true },
    { id: "m7", content: "Kur fillon kampanja?", time: "E hënë 10:00", self: false },
  ],
};

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string>("1");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeThread = MOCK_THREADS.find((t) => t.id === activeId)!;

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch(`/api/messages/${activeId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => ({ ...prev, [activeId]: data }));
        }
      } catch {
        // keep existing messages on error
      }
    }

    poll();
    pollingRef.current = setInterval(poll, 5000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeId]);

  async function handleSend(content: string) {
    const newMsg = { id: `m${Date.now()}`, content, time: "Tani", self: true };
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));

    await fetch(`/api/messages/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }

  return (
    <DashboardLayout activeKey="inbox">
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-gray-200 bg-white">
        <InboxSidebar
          threads={MOCK_THREADS}
          activeId={activeId}
          onSelect={setActiveId}
          className="w-72 shrink-0 border-r border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <ChatWindow
            peer={{ name: activeThread.name }}
            messages={messages[activeId] ?? []}
            onSend={handleSend}
            className="h-full"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
