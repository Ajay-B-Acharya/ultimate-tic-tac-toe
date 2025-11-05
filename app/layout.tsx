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
          <header className="w-full p-4 bg-[#0a0e27] border-b border-cyan-500/20 flex justify-between items-center" style={{boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)'}}>
            <a href="/" className="font-bold text-cyan-300 neon-text hover:text-cyan-200 transition-colors">Ultimate Tic Tac Toe</a>
            <UserBar />
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}