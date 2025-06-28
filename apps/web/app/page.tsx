// app/page.tsx
// ──────────────────────────────
// This uses the App Router’s redirect helper
import { redirect } from 'next/navigation'

export default function Page() {
  // immediately redirect any visit to `/` → `/signup`
  redirect('/signup')
}
