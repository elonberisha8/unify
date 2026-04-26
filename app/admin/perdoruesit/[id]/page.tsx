// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin - User Detail -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=36-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import { UserDetailClient } from "./UserDetailClient"

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  return <UserDetailClient id={params.id} />
}
