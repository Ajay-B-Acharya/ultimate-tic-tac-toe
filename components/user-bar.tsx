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
        <div className="w-6 h-6 bg-slate-600 rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-slate-600 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href="/login" className="text-sm">
          <User className="w-4 h-4 mr-2" />
          Login
        </a>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-purple-600 text-white text-sm">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-200">
          {user.email}
        </span>
        <span className="text-xs text-slate-400">
          {user.email_confirmed_at ? "Verified" : "Unverified"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-slate-400 hover:text-slate-200"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
