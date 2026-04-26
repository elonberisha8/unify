/**
 * Typed fetch utility for the Unify backend API.
 * Base URL: NEXT_PUBLIC_BACKEND_URL (default: http://localhost:4000)
 *
 * Usage (public):
 *   const data = await apiFetch<Campaign[]>("/campaigns")
 *
 * Usage (admin / protected):
 *   const token = await getToken()   // from Clerk useAuth()
 *   const data = await apiFetch<AdminStats>("/admin/stats", { token })
 */

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string | null }
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options ?? {}
  const authToken = token ?? null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  }

  const res = await fetch(`${BASE}/api${path}`, { ...rest, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body?.error ?? `HTTP ${res.status}`, res.status)
  }

  return res.json()
}

// ─── Typed response shapes (mirrors backend Prisma selects) ─────────────────

export interface AdminStats {
  totalCampaigns: number
  activeCampaigns: number
  pendingCampaigns: number
  totalUsers: number
  totalRaised: number
}

export interface AdminCampaign {
  id: string
  title: string
  slug: string
  status: string
  category: string
  location: string
  currentAmount: number
  targetAmount: number
  isUrgent: boolean
  isFeatured: boolean
  createdAt: string
  creator: { id: string; name: string; email: string }
  _count: { donations: number }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  isVerified: boolean
  isBanned: boolean
  createdAt: string
  _count: { campaigns: number; donations: number }
}

export interface AdminVolunteer {
  id: string
  title: string
  description?: string
  kind?: "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST"
  status: string
  subtype?: string
  category: string
  location: string
  organization?: string | null
  valueLabel?: string | null
  remote?: boolean
  fulfilledAt?: string | null
  isAnonymous: boolean
  createdAt: string
  owner: { id: string; name: string; email: string }
  _count: { applications: number }
}

export interface DashboardNotification {
  id: string
  text?: string
  time?: string
  read?: boolean
  title: string
  message: string
  type: string
  targetType: string | null
  targetId: string | null
  readAt: string | null
  createdAt: string
}

export interface DashboardSupportLedgerEntry {
  id: string
  sourceId: string
  domain: "support" | "volunteer" | "financial"
  flow: "incoming" | "outgoing"
  date: string
  title: string
  counterparty: string
  description: string
  valueLabel: string
  status: "pending" | "admin_review" | "completed" | "rejected" | "failed" | "refunded"
  targetType: string
  targetId: string
}

export interface DashboardApplication {
  id: string
  reason: string
  isAnonymous: boolean
  status: "PENDING" | "ADMIN_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  createdAt: string
  updatedAt: string
  applicant?: {
    id: string
    name: string
    email?: string
    image: string | null
    username: string | null
    location?: string | null
  }
  listing: VolunteerListing & {
    kind?: "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST"
    organization?: string | null
    valueLabel?: string | null
    remote?: boolean
    owner?: { id: string; name: string; email?: string; image?: string | null; username?: string | null }
  }
}

export interface Campaign {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string
  images: string[]
  problemStatement?: string | null
  targetGroup?: string | null
  urgency?: number | null
  videoUrl?: string | null
  budgetBreakdown?: unknown
  budgetItems?: unknown
  faqs?: unknown
  supportingDocs?: string[]
  partners?: string | null
  verificationPlan?: string | null
  expectedOutcome?: string | null
  tipPercent?: number | null
  status: string
  category: string
  location: string
  currentAmount: number
  targetAmount: number
  isUrgent: boolean
  isFeatured: boolean
  isAnonymous: boolean
  endsAt: string | null
  createdAt: string
  creator: {
    id: string
    name: string
    image: string | null
    isVerified: boolean
    username: string | null
  }
  donations?: Array<{
    id: string
    amount: number
    message: string | null
    isAnonymous: boolean
    guestName: string | null
    createdAt: string
    donor?: { id: string; name: string; image: string | null; username: string | null } | null
  }>
  milestones?: Array<{ id: string; title: string; amount: number; description: string | null; isReached: boolean }>
  updates?: Array<{ id: string; title: string; content: string; image: string | null; createdAt: string }>
  comments?: Array<{ id: string; content: string; createdAt: string; author?: { id: string; name: string; image: string | null; username: string | null } }>
  _count: { donations: number }
}

export interface VolunteerListing {
  id: string
  title: string
  description: string
  kind?: "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST"
  subtype: string
  category: string
  location: string
  organization?: string | null
  valueLabel?: string | null
  remote?: boolean
  helpDetails?: unknown
  images: string[]
  status: string
  isAnonymous: boolean
  applicationDeadline: string | null
  conditions: string | null
  fulfilledAt?: string | null
  createdAt: string
  owner: {
    id: string
    name: string
    image: string | null
    isVerified: boolean
  }
  _count: { applications: number }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── Admin User Detail (GET /admin/users/:id) ────────────────────────────────
export interface AdminUserDetail {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  isVerified: boolean
  isBanned: boolean
  createdAt: string
  updatedAt: string
  _count: {
    campaigns: number
    donations: number
    volunteerListings: number
    applications: number
    reports: number
  }
  totalDonated?: number
}

// ─── Admin Reports (GET /admin/reports) ──────────────────────────────────────
export interface AdminReport {
  id: string
  targetType: "Kampanje" | "Shpallje" | "Koment" | "Profil"
  targetName: string
  targetOwner: string
  targetOwnerEmail: string
  targetUrl: string
  reporter: string
  reporterEmail: string
  reason: string
  createdAt: string
  status: "open" | "investigating" | "resolved" | "dismissed"
  severity: "low" | "medium" | "high"
}

// ─── Audit Log (GET /admin/audit-log) ────────────────────────────────────────
export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  target: string
  ip: string
  severity: "info" | "warning" | "critical"
  category?: "ACCOUNT" | "FINANCE" | "CAMPAIGN" | "SOCIAL" | "SYSTEM"
  device?: string
  diff?: { before?: unknown; after?: unknown } | null
}

// ─── User Search (GET /users/search?q=username) ──────────────────────────────
export interface UserSearchResult {
  id: string
  username: string
  name: string
  image: string | null
  isVerified: boolean
}

// ─── Public Profile (GET /users/profile/@username) ───────────────────────────
export interface PublicProfile {
  id: string
  username: string
  name: string
  image: string | null
  bio: string | null
  location: string | null
  isVerified: boolean
  createdAt: string
  stats: {
    campaigns: number
    donations: number
    totalDonated: number
    volunteerListings: number
  }
}

// ─── Messaging ───────────────────────────────────────────────────────────────
export type ConversationType = "DIRECT" | "GROUP"

export interface ConversationParticipant {
  id: string
  username: string
  name: string
  image: string | null
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string | null
  image: string | null
  participants: ConversationParticipant[]
  lastMessage: {
    id: string
    content: string
    senderId: string
    senderUsername: string
    createdAt: string
  } | null
  unreadCount: number
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderUsername: string
  senderName: string
  senderImage: string | null
  content: string
  createdAt: string
  readBy: string[]
}

// ─── Transactions split (donations OUT vs IN, tips, withdrawals) ─────────────
export type TransactionKind = "DONATION_OUT" | "DONATION_IN" | "TIP" | "WITHDRAWAL"

export interface DashboardTransaction {
  id: string
  kind: TransactionKind
  amount: number
  currency: string
  campaignId: string | null
  campaignSlug?: string | null
  campaignTitle: string | null
  counterparty: string
  status: "SUCCEEDED" | "PENDING" | "FAILED"
  method: string
  createdAt: string
}

// ─── My Applications (GET /applications/mine) ────────────────────────────────
export interface MyApplication {
  id: string
  reason: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  isAnonymous: boolean
  createdAt: string
  listing: {
    id: string
    title: string
    subtype: string
    category: string
    location: string
    image: string | null
    owner: { id: string; username: string; name: string }
  }
}

// ─── Email Center (admin) ────────────────────────────────────────────────────
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: "CAMPAIGN" | "DONATION" | "APPLICATION" | "BROADCAST" | "SYSTEM"
  updatedAt: string
}

export interface EmailLog {
  id: string
  subject: string
  recipients: number
  status: "SENT" | "QUEUED" | "FAILED"
  sentAt: string
  sentBy: string
  templateId: string | null
}

export interface ScheduledEmail {
  id: string
  name: string
  trigger: "CAMPAIGN_DEADLINE" | "WELCOME" | "REENGAGEMENT" | "MONTHLY_STATS"
  delayDays: number
  templateId: string
  active: boolean
}
