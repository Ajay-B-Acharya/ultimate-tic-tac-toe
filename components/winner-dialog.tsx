"use client"

import { useEffect } from "react"
import { useSound } from "@/hooks/use-sound"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"

interface WinnerDialogProps {
  isOpen: boolean
  winner: number | null
  gameMode: "ai" | "local" | null
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export default function WinnerDialog({ 
  isOpen, 
  winner, 
  gameMode, 
  onPlayAgain, 
  onBackToMenu 
}: WinnerDialogProps) {
  const { playWinSound } = useSound()

  useEffect(() => {
    if (isOpen && winner !== null) {
      playWinSound()
    }
  }, [isOpen, winner, playWinSound])

  const getWinnerMessage = () => {
    if (winner === 1) {
      return gameMode === "ai" ? "You Win! 🎉" : "Player 1 (X) Wins! 🎉"
    } else if (winner === 2) {
      return gameMode === "ai" ? "AI Wins! 🤖" : "Player 2 (O) Wins! 🎉"
    } else if (winner === 3) {
      return "It's a Draw! 🤝"
    }
    return ""
  }

  const getWinnerDescription = () => {
    if (winner === 1) {
      return gameMode === "ai" 
        ? "Congratulations! You've defeated the AI!" 
        : "Congratulations Player 1! Victory is yours!"
    } else if (winner === 2) {
      return gameMode === "ai"
        ? "The AI has won this round. Better luck next time!"
        : "Congratulations Player 2! Victory is yours!"
    } else if (winner === 3) {
      return "A perfectly balanced match! Nobody wins."
    }
    return ""
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="holographic-panel bg-black/90 border-2 border-cyan-400" style={{boxShadow: '0 0 60px rgba(0, 217, 255, 0.6), inset 0 0 60px rgba(0, 217, 255, 0.15)'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-lg pointer-events-none"></div>
        <AlertDialogHeader className="relative z-10">
          <AlertDialogTitle className={`text-3xl font-bold text-center ${
            winner === 1 ? "text-cyan-400" :
            winner === 2 ? "text-amber-500" :
            "text-yellow-400"
          }`} style={
            winner === 1 ? {textShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff, 0 0 60px #00d9ff'} :
            winner === 2 ? {textShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b, 0 0 60px #f59e0b'} :
            {textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24'}
          }>
            {getWinnerMessage()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg text-cyan-100 mt-2">
            {getWinnerDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4 relative z-10">
          <button
            onClick={onBackToMenu}
            className="group w-full sm:w-auto px-6 py-3 holographic-panel text-white font-bold rounded-xl transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </span>
          </button>
          <button
            onClick={onPlayAgain}
            className="group w-full sm:w-auto px-6 py-3 holographic-panel text-white font-bold rounded-xl transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Play Again
            </span>
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}