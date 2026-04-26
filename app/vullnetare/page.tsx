"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   • Vullnetar — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { SearchBar, VolunteerCard } from "@/components/public"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"

const VOLUNTEER_POSTS = [
  {
    id: "1",
    title: "Vullnetarë — Spitali i Gjakovës",
    organization: "Spitali Rajonal Gjakove",
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    category: "Shëndetësi",
    location: "Gjakovë",
    hoursPerWeek: "4-6 orë/javë",
    startDate: "30 Prill 2026",
    applicantCount: 12,
    skills: ["Komunikim", "Fundjavë", "18+"],
  },
  {
    id: "v1",
    title: "Mësues vullnetar matematike për 6 fëmijë",
    organization: "Shkolla 7 Shtatori",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    category: "Arsim",
    location: "Tiranë",
    hoursPerWeek: "4h/javë",
    startDate: "1 Maj",
    applicantCount: 12,
    skills: ["Matematikë", "Mësimdhënie"],
  },
  {
    id: "v3",
    title: "Transport për të moshuarit te mjeku",
    organization: "Drita e Shpresës",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    category: "Komunitet",
    location: "Prishtinë",
    hoursPerWeek: "6h/javë",
    startDate: "Menjëherë",
    applicantCount: 8,
    skills: ["Patentë shoferi", "Makinë"],
  },
]

export default function VullnetarePage() {
  const router = useRouter()
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream">
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <Badge variant="secondary" className="mb-4">
            Ndihmë Vullnetare
          </Badge>
          <h1 className="mb-4 font-display text-4xl text-unify-brown md:text-5xl">
            Mundësi vullnetare aktive
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Gjej organizata, familje dhe komunitete që kërkojnë kohë, aftësi ose ndihmë praktike.
          </p>
          <SearchBar placeholder="Kërko mundësi vullnetare..." size="lg" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VOLUNTEER_POSTS.map((post) => (
            <VolunteerCard
              key={post.id}
              {...post}
              onClick={() => {
                router.push(`/vullnetare/${post.id}`)
              }}
              onApply={() => {
                router.push(`/vullnetare/${post.id}`)
              }}
            />
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
