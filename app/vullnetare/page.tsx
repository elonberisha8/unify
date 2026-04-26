// ============================================================
// BRANCH: feat/listings
// Alias route only: /shpalljet is the single public listing surface.
// ============================================================

import { redirect } from "next/navigation"

export default function VullnetareRedirectPage() {
  redirect("/shpalljet?kind=VOLUNTEER_CONTRIBUTION")
}
