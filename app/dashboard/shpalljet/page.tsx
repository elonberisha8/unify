"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// Shpalljet e mia — me Sheet modal për detaje + statistika
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  Button, Badge,
} from "@/components/ui";
import { EmptyState, DashboardLayout } from "@/components/layout";
import {
  MapPinIcon, CalendarIcon, ClockIcon, UsersIcon,
  EditIcon, TrashIcon, CheckIcon,
} from "@/components/icons";

type ListingStatus = "active" | "closed" | "draft";

interface Listing {
  id: string;
  title: string;
  organization: string;
  status: ListingStatus;
  location: string;
  hoursPerWeek: string;
  startDate: string;
  endDate: string;
  applicantCount: number;
  acceptedCount: number;
  category: string;
  description: string;
  skills: string[];
  remote: boolean;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Mësues vullnetar i gjuhës angleze",
    organization: "OJQ Drita",
    status: "active",
    location: "Prishtinë",
    hoursPerWeek: "4 orë/javë",
    startDate: "1 Maj 2026",
    endDate: "31 Gusht 2026",
    applicantCount: 12,
    acceptedCount: 2,
    category: "Arsim",
    description: "Kërkojmë mësues vullnetarë të gjuhës angleze për të ndihmuar fëmijët e komuniteteve të margjinalizuara të mësojnë anglisht bazik. Mësimet zhvillohen çdo të mërkurë dhe të premte pasdite.",
    skills: ["Anglisht C1+", "Durim", "Mësimdhënie"],
    remote: false,
  },
  {
    id: "l2",
    title: "Koordinator ngjarjesh kulturore",
    organization: "Qendra Kulturore",
    status: "active",
    location: "Prizren",
    hoursPerWeek: "6 orë/javë",
    startDate: "15 Maj 2026",
    endDate: "15 Shtator 2026",
    applicantCount: 7,
    acceptedCount: 1,
    category: "Kulturë",
    description: "Koordinon organizimin e ngjarjeve kulturore, duke përfshirë festivale, ekspozita dhe koncerte. Roli kërkon komunikim të mirë dhe aftësi organizative.",
    skills: ["Komunikim", "Organizim", "Gjuhë shqipe"],
    remote: false,
  },
  {
    id: "l3",
    title: "Ndihmës social online",
    organization: "OJQ Drita",
    status: "draft",
    location: "—",
    hoursPerWeek: "3 orë/javë",
    startDate: "TBD",
    endDate: "TBD",
    applicantCount: 0,
    acceptedCount: 0,
    category: "Sociale",
    description: "Pozicion online për të ndihmuar familjet në nevojë me këshilla dhe burime online.",
    skills: ["Empati", "Komunikim online"],
    remote: true,
  },
];

const STATUS_STYLES: Record<ListingStatus, string> = {
  active: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
  draft:  "bg-yellow-100 text-yellow-800",
};
const STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Aktive",
  closed: "Mbyllur",
  draft:  "Draft",
};

export default function DashShpalljetPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openSheet(listing: Listing) {
    setSelected(listing);
    setSheetOpen(true);
  }

  function toggleClose(id: string) {
    setListings((prev) =>
      prev.map((l) => l.id === id ? { ...l, status: l.status === "active" ? "closed" : "active" } : l)
    );
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, status: prev.status === "active" ? "closed" : "active" } : null);
    }
  }

  return (
    <DashboardLayout activeKey="shpalljet">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shpalljet e mia</h1>
            <p className="text-sm text-gray-500 mt-1">
              {listings.filter((l) => l.status === "active").length} aktive ·{" "}
              {listings.reduce((s, l) => s + l.applicantCount, 0)} aplikime gjithsej
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/shpallje")}>
            + Krijo shpallje
          </Button>
        </div>

        {/* Listing cards */}
        {listings.length === 0 ? (
          <EmptyState
            title="Asnjë shpallje"
            description="Krijo shpalljen tënde të parë të vullnetarizmit."
            action={{ label: "Krijo shpallje", onClick: () => router.push("/dashboard/krijo/shpallje") }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.map((l) => (
              <div
                key={l.id}
                onClick={() => openSheet(l)}
                className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-unify-blue/30 transition-all group"
              >
                {/* Status + category */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[l.status]}`}>
                    {STATUS_LABELS[l.status]}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">{l.category}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-unify-blue transition-colors">
                  {l.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{l.organization}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {l.remote ? "Online" : l.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {l.hoursPerWeek}
                  </span>
                </div>

                {/* Stats bar */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-unify-blue">
                    <UsersIcon className="h-3.5 w-3.5" />
                    {l.applicantCount} aplikime
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {l.acceptedCount} pranuar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[selected.status]}`}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                  <span className="text-xs text-gray-400">{selected.category}</span>
                </div>
                <SheetTitle className="text-xl mt-2 leading-snug">{selected.title}</SheetTitle>
                <p className="text-sm text-gray-500">{selected.organization}</p>
              </SheetHeader>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Aplikime",  value: selected.applicantCount, color: "text-unify-blue" },
                  { label: "Pranuar",   value: selected.acceptedCount,   color: "text-green-600" },
                  { label: "Në pritje", value: selected.applicantCount - selected.acceptedCount, color: "text-yellow-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{selected.remote ? "Online / Distancë" : selected.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{selected.hoursPerWeek}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>Fillon: {selected.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>Mbaron: {selected.endDate}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Përshkrimi</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Aftësitë e kërkuara</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-unify-blue/10 text-unify-blue rounded-full text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push(`/dashboard/aplikimet`)}
                >
                  <UsersIcon className="h-4 w-4" />
                  Shiko aplikimet ({selected.applicantCount})
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push(`/dashboard/krijo/shpallje`)}
                >
                  <EditIcon className="h-4 w-4" />
                  Edito shpalljen
                </Button>
                <Button
                  variant="outline"
                  className={`w-full justify-start gap-2 ${
                    selected.status === "active"
                      ? "border-red-300 text-red-600 hover:bg-red-50"
                      : "border-green-400 text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => toggleClose(selected.id)}
                >
                  {selected.status === "active" ? (
                    <><TrashIcon className="h-4 w-4" /> Mbyll aplikimet</>
                  ) : (
                    <><CheckIcon className="h-4 w-4" /> Rihap aplikimet</>
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
