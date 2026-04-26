"use client";

// ============================================================
// BRANCH: feat/dashboard-inbox
// FIGMA:
//   • Dashboard — Inbox → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=78-2
// NOTION: https://www.notion.so/34874891227e8138a5abebbfd9a6d3ae
// ============================================================

import * as React from "react";
import { useAuth } from "@/app/_lib/useAuthLocal";
import { useRouter } from "next/navigation";
import { InboxSidebar, ChatWindow, type ChatMessage, type InboxThread } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Textarea, Badge } from "@/components/ui";
import { PlusIcon, UsersIcon, SearchIcon, CloseIcon } from "@/components/icons";
import { apiFetch, type UserSearchResult, type Conversation } from "@/app/_lib/api";
import { normalizeUsername } from "@/app/_lib/username";

interface ApiUser {
  id: string;
  name: string;
  image?: string | null;
  username?: string | null;
}

interface ApiMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender?: ApiUser;
}

function formatTime(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" });
}

type InboxTab = "direct" | "group";

export default function InboxPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [tab, setTab] = React.useState<InboxTab>("direct");
  const [activeId, setActiveId] = React.useState("");
  const [myUserId, setMyUserId] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [messages, setMessages] = React.useState<Record<string, ChatMessage[]>>({});

  // ── Modals ───────────────────────────────────────
  const [newDirectOpen, setNewDirectOpen] = React.useState(false);
  const [newGroupOpen, setNewGroupOpen] = React.useState(false);

  // Direct modal state
  const [directQuery, setDirectQuery] = React.useState("");
  const [directResults, setDirectResults] = React.useState<UserSearchResult[]>([]);
  const [directFirstMessage, setDirectFirstMessage] = React.useState("");
  const [directError, setDirectError] = React.useState<string | null>(null);

  // Group modal state
  const [groupName, setGroupName] = React.useState("");
  const [groupQuery, setGroupQuery] = React.useState("");
  const [groupResults, setGroupResults] = React.useState<UserSearchResult[]>([]);
  const [groupMembers, setGroupMembers] = React.useState<UserSearchResult[]>([]);
  const [groupFirstMessage, setGroupFirstMessage] = React.useState("");
  const [groupError, setGroupError] = React.useState<string | null>(null);

  const requireLogin = React.useCallback(() => {
    router.push(`/auth/login?redirect=${encodeURIComponent("/dashboard/inbox")}`);
  }, [router]);

  const hasLocalSession = React.useCallback(() => (
    typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"))
  ), []);

  const loadConversations = React.useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn && !hasLocalSession()) return;
    const token = isSignedIn ? await getToken() : null;
    try {
      const [me, convos] = await Promise.all([
        apiFetch<ApiUser>("/users/me", { token }),
        apiFetch<Conversation[]>("/messages/conversations", { token }),
      ]);
      setMyUserId(me.id);
      const list = Array.isArray(convos) ? convos : [];
      setConversations(list);
      const filtered = list.filter((c) => (tab === "direct" ? c.type === "DIRECT" : c.type === "GROUP"));
      if (filtered.length && !filtered.some((c) => c.id === activeId)) {
        setActiveId(filtered[0].id);
      }
    } catch {
      // Backend not ready — keep static demo
    }
  }, [getToken, hasLocalSession, isLoaded, isSignedIn, tab, activeId]);

  React.useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Live user search (debounced) ─────────────────
  React.useEffect(() => {
    if (!directQuery.trim()) { setDirectResults([]); return; }
    const handle = setTimeout(async () => {
      const token = isSignedIn ? await getToken() : null;
      try {
        const q = normalizeUsername(directQuery);
        const results = await apiFetch<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(q)}`, { token });
        setDirectResults(Array.isArray(results) ? results : []);
      } catch {
        setDirectResults([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [directQuery, getToken, isSignedIn]);

  React.useEffect(() => {
    if (!groupQuery.trim()) { setGroupResults([]); return; }
    const handle = setTimeout(async () => {
      const token = isSignedIn ? await getToken() : null;
      try {
        const q = normalizeUsername(groupQuery);
        const results = await apiFetch<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(q)}`, { token });
        setGroupResults(Array.isArray(results) ? results : []);
      } catch {
        setGroupResults([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [groupQuery, getToken, isSignedIn]);

  // ── Load messages for active conversation ────────
  React.useEffect(() => {
    async function loadMessages() {
      if (!isLoaded || !activeId) return;
      if (!isSignedIn && !hasLocalSession()) return;
      const token = isSignedIn ? await getToken() : null;
      try {
        const data = await apiFetch<ApiMessage[]>(`/messages/conversations/${activeId}`, { token });
        setMessages((prev) => ({
          ...prev,
          [activeId]: (Array.isArray(data) ? data : []).map((m) => ({
            id: m.id,
            content: m.content,
            time: formatTime(m.createdAt),
            self: m.senderId === myUserId,
            avatar: m.sender?.image ?? undefined,
            senderName: m.sender?.name,
          })),
        }));
      } catch {}
    }
    loadMessages();
  }, [activeId, getToken, hasLocalSession, isLoaded, isSignedIn, myUserId]);

  async function handleStartDirect(target: UserSearchResult) {
    setDirectError(null);
    if (!isSignedIn && !hasLocalSession()) { requireLogin(); return; }
    try {
      const token = isSignedIn ? await getToken() : null;
      const res = await apiFetch<{ conversation: Conversation }>("/messages/start", {
        method: "POST",
        token,
        body: JSON.stringify({ username: target.username, content: directFirstMessage.trim() || undefined }),
      });
      setNewDirectOpen(false);
      setDirectQuery(""); setDirectFirstMessage(""); setDirectResults([]);
      await loadConversations();
      if (res.conversation?.id) setActiveId(res.conversation.id);
    } catch (err) {
      setDirectError(err instanceof Error ? err.message : "Nuk u hap biseda.");
    }
  }

  function toggleGroupMember(user: UserSearchResult) {
    setGroupMembers((current) => {
      const exists = current.some((m) => m.id === user.id);
      return exists ? current.filter((m) => m.id !== user.id) : [...current, user];
    });
    setGroupQuery("");
    setGroupResults([]);
  }

  async function handleCreateGroup() {
    setGroupError(null);
    if (!groupName.trim()) { setGroupError("Emri i grupit kërkohet"); return; }
    if (groupMembers.length < 2) { setGroupError("Min 2 anëtarë të tjerë"); return; }
    if (!isSignedIn && !hasLocalSession()) { requireLogin(); return; }
    try {
      const token = isSignedIn ? await getToken() : null;
      const res = await apiFetch<{ conversation: Conversation }>("/messages/groups", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: groupName.trim(),
          memberIds: groupMembers.map((m) => m.id),
          firstMessage: groupFirstMessage.trim() || undefined,
        }),
      });
      setNewGroupOpen(false);
      setGroupName(""); setGroupQuery(""); setGroupMembers([]); setGroupFirstMessage(""); setGroupResults([]);
      setTab("group");
      await loadConversations();
      if (res.conversation?.id) setActiveId(res.conversation.id);
    } catch (err) {
      setGroupError(err instanceof Error ? err.message : "Nuk u krijua grupi.");
    }
  }

  async function handleSend(content: string) {
    if (!isSignedIn && !hasLocalSession()) { requireLogin(); return; }
    if (!activeId) return;
    const token = isSignedIn ? await getToken() : null;
    try {
      const message = await apiFetch<ApiMessage>(`/messages/conversations/${activeId}`, {
        method: "POST",
        token,
        body: JSON.stringify({ content }),
      });
      setMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), { id: message.id, content: message.content, time: formatTime(message.createdAt), self: true }],
      }));
    } catch {}
  }

  // ── Convert conversations to InboxThread format ──
  const filteredConversations = conversations.filter((c) => (tab === "direct" ? c.type === "DIRECT" : c.type === "GROUP"));

  const threads: InboxThread[] = filteredConversations.map((c) => {
    if (c.type === "GROUP") {
      return {
        id: c.id,
        name: c.name ?? "Grup pa emër",
        avatar: c.image ?? undefined,
        preview: c.lastMessage?.content ?? `${c.participants.length} anëtarë`,
        time: formatTime(c.lastMessage?.createdAt),
      };
    }
    const peer = c.participants.find((p) => p.id !== myUserId) ?? c.participants[0];
    return {
      id: c.id,
      name: peer ? `${peer.name} (@${peer.username})` : "Bisedë",
      avatar: peer?.image ?? undefined,
      preview: c.lastMessage?.content ?? "Biseda e re",
      time: formatTime(c.lastMessage?.createdAt),
    };
  });

  const activeConvo = filteredConversations.find((c) => c.id === activeId);
  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <DashboardLayout activeKey="inbox">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-500">Shkruaj direkt me @username, ose krijo grup me anëtarë.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNewDirectOpen(true)} className="gap-2">
              <PlusIcon className="h-4 w-4" /> Mesazh i ri
            </Button>
            <Button onClick={() => setNewGroupOpen(true)} className="gap-2">
              <UsersIcon className="h-4 w-4" /> Krijo grup
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => { setTab("direct"); setActiveId(""); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${tab === "direct" ? "bg-unify-blue text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Direkte ({conversations.filter(c => c.type === "DIRECT").length})
          </button>
          <button
            onClick={() => { setTab("group"); setActiveId(""); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${tab === "group" ? "bg-unify-blue text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Grupe ({conversations.filter(c => c.type === "GROUP").length})
          </button>
        </div>

        <div className="flex h-[calc(100vh-14rem)] overflow-hidden rounded-xl border border-gray-200 bg-white">
          <InboxSidebar
            threads={threads}
            activeId={activeId}
            onSelect={setActiveId}
            className="w-72 shrink-0 border-r border-gray-200"
          />
          <div className="min-w-0 flex-1">
            {activeConvo?.type === "GROUP" && (
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-2 bg-gray-50">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{activeConvo.participants.length} anëtarë:</span>
                {activeConvo.participants.map((p) => (
                  <Badge key={p.id} variant="outline" className="text-xs">
                    @{p.username}
                  </Badge>
                ))}
              </div>
            )}
            <ChatWindow
              peer={{ name: activeThread?.name ?? "Zgjidh bisedën", avatar: activeThread?.avatar }}
              messages={messages[activeId] ?? []}
              onSend={handleSend}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Modal: Mesazh i ri (direct) */}
      <Dialog open={newDirectOpen} onOpenChange={setNewDirectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fillo bisedë me @username</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Kërko user</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={directQuery}
                  onChange={(e) => setDirectQuery(e.target.value)}
                  placeholder="@username ose emri"
                  className="pl-10"
                />
              </div>
              {directResults.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                  {directResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleStartDirect(u)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-unify-blue text-white text-sm font-semibold">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="truncate text-xs text-gray-500">@{u.username}</p>
                      </div>
                      {u.isVerified && <Badge variant="success" className="text-xs">✓</Badge>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Mesazhi i parë (opsional)</Label>
              <Textarea
                value={directFirstMessage}
                onChange={(e) => setDirectFirstMessage(e.target.value)}
                placeholder="Përshëndetje..."
                rows={3}
              />
            </div>
            {directError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{directError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewDirectOpen(false)}>Anulo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Krijo grup */}
      <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Krijo grup të ri</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Emri i grupit *</Label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="p.sh. Vullnetarët e Prishtinës"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Anëtarët e zgjedhur ({groupMembers.length}) — min 2</Label>
              {groupMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                  {groupMembers.map((m) => (
                    <span key={m.id} className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs">
                      @{m.username}
                      <button onClick={() => toggleGroupMember(m)} className="ml-1 text-gray-500 hover:text-red-600">
                        <CloseIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Shto anëtarë me @username</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={groupQuery}
                  onChange={(e) => setGroupQuery(e.target.value)}
                  placeholder="@username ose emri"
                  className="pl-10"
                />
              </div>
              {groupResults.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                  {groupResults
                    .filter((u) => !groupMembers.some((m) => m.id === u.id))
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => toggleGroupMember(u)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-unify-blue text-white text-xs font-semibold">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="truncate text-xs text-gray-500">@{u.username}</p>
                        </div>
                        <PlusIcon className="h-4 w-4 text-unify-blue" />
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Mesazhi i parë (opsional)</Label>
              <Textarea
                value={groupFirstMessage}
                onChange={(e) => setGroupFirstMessage(e.target.value)}
                placeholder="Mirë se erdhët në grup..."
                rows={3}
              />
            </div>

            {groupError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{groupError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewGroupOpen(false)}>Anulo</Button>
              <Button onClick={handleCreateGroup} disabled={!groupName.trim() || groupMembers.length < 2}>
                Krijo grupin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

