import type { Metadata } from "next"
import { Dashboard } from "@presentation/builder/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

const DashboardPage = () => <Dashboard />

export default DashboardPage
