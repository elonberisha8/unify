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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  status: string
  category: string
  location: string
  isAnonymous: boolean
  createdAt: string
  owner: { id: string; name: string; email: string }
  _count: { applications: number }
}

export interface Campaign {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string
  images: string[]
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
  _count: { donations: number }
}

export interface VolunteerListing {
  id: string
  title: string
  description: string
  subtype: string
  category: string
  location: string
  images: string[]
  status: string
  isAnonymous: boolean
  applicationDeadline: string | null
  conditions: string | null
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
}
