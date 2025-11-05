"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export function UserBar() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-cyan-600/30 rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-cyan-600/30 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href="/login" className="text-sm border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 neon-text">
          <User className="w-4 h-4 mr-2" />
          Login
        </a>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8 border border-cyan-500/50" style={{boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'}}>
        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white text-sm">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-cyan-200">
          {user.email}
        </span>
        <span className="text-xs text-cyan-400/60">
          {user.email_confirmed_at ? "Verified" : "Unverified"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/50 transition-all"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
