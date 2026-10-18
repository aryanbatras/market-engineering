import { cn } from "@presentation/design/cn"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://marketengineering.dev"),
  title: {
    default: "Market Engineering — your work, made visible",
    template: "%s · Market Engineering",
  },
  description:
    "Turn the resume and GitHub you already have into a portfolio a recruiter actually reads. Paste YAML, pick a template, publish at your own URL.",
  openGraph: {
    type: "website",
    siteName: "Market Engineering",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

type RootLayoutProps = { children: ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={cn(geist.variable, geistMono.variable)} lang="en">
      <body>{children}</body>
    </html>
  )
}