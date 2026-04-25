"use client"

import type { AdminActionMenuItem } from "@/components/admin"

export type AdminLifecycleStatus = "review" | "active" | "paused" | "rejected"

export const ADMIN_LIFECYCLE_META = {
  review: { label: "Ne shqyrtim", variant: "warning" },
  active: { label: "Aktive", variant: "success" },
  paused: { label: "Pauzuar", variant: "secondary" },
  rejected: { label: "Refuzuar", variant: "destructive" },
} as const

interface LifecycleActionInput {
  status: AdminLifecycleStatus
  details: () => void
  preview?: () => void
  owner?: () => void
  approve: () => void
  pause: () => void
  resume: () => void
  review: () => void
  reject: () => void
  remove: () => void
  requestDocuments?: () => void
  noun: string
}

export function getAdminLifecycleActions(input: LifecycleActionInput): AdminActionMenuItem[] {
  const actions: AdminActionMenuItem[] = [
    { label: "Detaje / edito", onClick: input.details },
  ]

  if (input.preview) actions.push({ label: "Preview publik", onClick: input.preview })
  if (input.owner) actions.push({ label: "Hap owner-in", onClick: input.owner })

  if (input.status === "review") {
    actions.push(
      { label: `Aprovo ${input.noun}`, onClick: input.approve },
      ...(input.requestDocuments ? [{ label: "Kerko dokumente", onClick: input.requestDocuments }] : []),
      { label: `Refuzo ${input.noun}`, onClick: input.reject, destructive: true },
    )
  }

  if (input.status === "active") {
    actions.push(
      { label: `Pauzo ${input.noun}`, onClick: input.pause },
      ...(input.requestDocuments ? [{ label: "Kthe ne review", onClick: input.requestDocuments }] : []),
    )
  }

  if (input.status === "paused") {
    actions.push(
      { label: "Resume / riaktivizo", onClick: input.resume },
      { label: "Kthe ne review", onClick: input.review },
      { label: `Refuzo ${input.noun}`, onClick: input.reject, destructive: true },
    )
  }

  if (input.status === "rejected") {
    actions.push({ label: "Rihap per review", onClick: input.review })
  }

  actions.push({
    label: `Fshi ${input.noun}`,
    onClick: input.remove,
    destructive: true,
    divider: true,
    confirmLabel: `A je i sigurt qe do ta fshish ose arkivosh ${input.noun}? Ky veprim ruhet ne backend.`,
  })

  return actions
}
