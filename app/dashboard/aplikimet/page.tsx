"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// Aplikimet e marra — kreatori sheh kush ka aplikuar për shpalljet e tij
// ============================================================

import * as React from "react";
import { useState } from "react";
import { CheckIcon, CloseIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@/components/icons";
import { Badge, Button } from "@/components/ui";
import { EmptyState, DashboardLayout } from "@/components/layout";

type AppStatus = "pending" | "accepted" | "rejected";

interface Applicant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  date: string;
  status: AppStatus;
  listing: string;
  location?: string;
  message?: string;
}

const INITIAL_APPLICANTS: Applicant[] = [
  { id: "a1", name: "Arta Krasniqi",    email: "arta@email.com",    avatar: "AK", date: "22 Pri 2026", status: "pending",  listing: "Mësues vullnetar i gjuhës angleze", location: "Prishtinë", message: "Jam mësuese e certifikuar me 5 vjet përvojë." },
  { id: "a2", name: "Besnik Hoxha",     email: "besnik@email.com",  avatar: "BH", date: "21 Pri 2026", status: "pending",  listing: "Mësues vullnetar i gjuhës angleze", location: "Prishtinë", message: "E dua mësimdhënien dhe dua të ndihmoj komunitetin." },
  { id: "a3", name: "Drita Morina",     email: "drita@email.com",   avatar: "DM", date: "20 Pri 2026", status: "accepted", listing: "Koordinator ngjarjesh kulturore",    location: "Prizren",    message: "Kam organizuar 10+ ngjarje kulturore." },
  { id: "a4", name: "Kujtim Fazliu",    email: "kujtim@email.com",  avatar: "KF", date: "19 Pri 2026", status: "pending",  listing: "Ndihmës social",                   location: "Ferizaj",    message: "Punoj si punonjës social." },
  { id: "a5", name: "Lirije Gashi",     email: "lirije@email.com",  avatar: "LG", date: "18 Pri 2026", status: "rejected", listing: "Ndihmës social",                   location: "Pejë",       message: "Jam e interesuar për punë sociale." },
  { id: "a6", name: "Agron Bajrami",    email: "agron@email.com",   avatar: "AB", date: "17 Pri 2026", status: "pending",  listing: "Koordinator ngjarjesh kulturore",   location: "Prizren",    message: "Kam përvojë si koordinator." },
];

const STATUS_LABELS: Record<AppStatus, string> = {
  pending:  "Në pritje",
  accepted: "Pranuar",
  rejected: "Refuzuar",
};

const STATUS_COLORS: Record<AppStatus, string> = {
  pending:  "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const LISTINGS = ["Të gjitha", "Mësues vullnetar i gjuhës angleze", "Koordinator ngjarjesh kulturore", "Ndihmës social"];
const TABS: { label: string; value: AppStatus | "all" }[] = [
  { label: "Të gjitha",  value: "all"      },
  { label: "Në pritje",  value: "pending"  },
  { label: "Pranuar",    value: "accepted" },
  { label: "Refuzuar",   value: "rejected" },
];

export default function AplikiметPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [activeTab, setActiveTab] = useState<AppStatus | "all">("all");
  const [activeListing, setActiveListing] = useState("Të gjitha");

  function updateStatus(id: string, status: AppStatus) {
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  const filtered = applicants.filter((a) => {
    const tabOk = activeTab === "all" || a.status === activeTab;
    const listingOk = activeListing === "Të gjitha" || a.listing === activeListing;
    return tabOk && listingOk;
  });

  const counts = {
    all:      applicants.length,
    pending:  applicants.filter((a) => a.status === "pending").length,
    accepted: applicants.filter((a) => a.status === "accepted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <DashboardLayout activeKey="aplikimet">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aplikimet e marra</h1>
            <p className="text-sm text-gray-500 mt-1">
              {counts.pending > 0
                ? `${counts.pending} aplikim${counts.pending > 1 ? "e" : ""} në pritje për rishikim`
                : "Asnjë aplikim i ri në pritje"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-unify-blue/10 text-unify-blue rounded-xl px-4 py-2">
            <UsersIcon className="h-4 w-4" />
            <span className="text-sm font-bold">{counts.all} gjithsej</span>
          </div>
        </div>

        {/* Filter by listing */}
        <div className="flex gap-2 flex-wrap">
          {LISTINGS.map((l) => (
            <button
              key={l}
              onClick={() => setActiveListing(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeListing === l
                  ? "bg-unify-brown text-white border-unify-brown"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === t.value
                  ? "border-unify-blue text-unify-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === t.value ? "bg-unify-blue text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[t.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Applicant list */}
        {filtered.length === 0 ? (
          <EmptyState title="Asnjë aplikim" description="Nuk ka aplikime për këtë filtër." />
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-unify-blue/10 text-unify-blue font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {a.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{a.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{a.email}</p>
                  <p className="text-xs text-unify-blue font-medium mt-1">📋 {a.listing}</p>
                  {a.message && (
                    <p className="text-xs text-gray-600 mt-1 italic">"{a.message}"</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    {a.location && <span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3" />{a.location}</span>}
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{a.date}</span>
                  </div>
                </div>

                {/* Actions */}
                {a.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-700 hover:bg-green-50 h-8 px-3"
                      onClick={() => updateStatus(a.id, "accepted")}
                    >
                      <CheckIcon className="h-3 w-3 mr-1" /> Prano
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-400 text-red-600 hover:bg-red-50 h-8 px-3"
                      onClick={() => updateStatus(a.id, "rejected")}
                    >
                      <CloseIcon className="h-3 w-3 mr-1" /> Refuzo
                    </Button>
                  </div>
                )}
                {a.status === "accepted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-500 h-8 px-3 flex-shrink-0"
                    onClick={() => updateStatus(a.id, "rejected")}
                  >
                    Anulo
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
