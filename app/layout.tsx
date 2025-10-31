import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { UserBar } from "@/components/user-bar"
import { AuthProvider } from "@/contexts/AuthContext"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ultimate Tic Tac Toe",
  description: "Play Ultimate Tic Tac Toe against an AI opponent",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <AuthProvider>
          <header className="w-full p-4 bg-slate-900 text-slate-200 flex justify-between items-center">
            <a href="/" className="font-bold">Ultimate Tic Tac Toe</a>
            <UserBar />
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
