"use client"

import { useState } from "react"

interface ModeSelectProps {
  onSelectMode: (mode: "ai" | "local", difficulty?: "easy" | "medium" | "hard") => void
}

export default function ModeSelect({ onSelectMode }: ModeSelectProps) {
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiDifficulty')
      if (saved === 'easy' || saved === 'medium' || saved === 'hard') {
        return saved
      }
    }
    return "medium"
  })

  const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty)
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiDifficulty', newDifficulty)
    }
  }

  const handleAIClick = () => {
    setShowDifficulty(true)
  }

  const handleDifficultyConfirm = () => {
    onSelectMode("ai", difficulty)
  }

  const handleBack = () => {
    setShowDifficulty(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-cyan-400 mb-3" style={{textShadow: '0 0 30px #00d9ff, 0 0 60px #00d9ff, 0 0 90px #00d9ff'}}>
          Ultimate Tic Tac Toe
        </h1>
        <p className="text-cyan-300 text-lg font-medium" style={{textShadow: '0 0 15px #00d9ff'}}>Choose your game mode</p>
      </div>

      {showDifficulty ? (
        /* Difficulty Selection */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-transparent backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/50" style={{boxShadow: '0 0 40px rgba(192, 38, 211, 0.25), inset 0 0 40px rgba(192, 38, 211, 0.08)'}}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
                  Choose Difficulty
                </h2>
                <p className="text-cyan-200/80 text-sm">Select AI opponent strength</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleDifficultyChange("easy")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    difficulty === "easy"
                      ? "border-green-500/70 bg-green-500/15"
                      : "border-slate-700/50 bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🟢</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-base ${difficulty === "easy" ? "text-green-400" : "text-slate-300"}`}>
                        Easy
                      </div>
                      <div className="text-xs text-slate-400">Random moves — great for learning</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDifficultyChange("medium")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    difficulty === "medium"
                      ? "border-yellow-500/70 bg-yellow-500/15"
                      : "border-slate-700/50 bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🟡</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-base ${difficulty === "medium" ? "text-yellow-400" : "text-slate-300"}`}>
                        Medium
                      </div>
                      <div className="text-xs text-slate-400">Balanced gameplay — moderate challenge</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDifficultyChange("hard")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    difficulty === "hard"
                      ? "border-red-500/70 bg-red-500/15"
                      : "border-slate-700/50 bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔴</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-base ${difficulty === "hard" ? "text-red-400" : "text-slate-300"}`}>
                        Hard
                      </div>
                      <div className="text-xs text-slate-400">Maximum challenge — focused AI</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 bg-slate-800/40 text-slate-300 rounded-xl border border-slate-700/50 hover:bg-slate-700/40 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDifficultyConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-colors"
                  style={{boxShadow: '0 0 16px rgba(192, 38, 211, 0.35)'}}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Mode */}
          <button
            onClick={handleAIClick}
            className="group relative holographic-panel rounded-3xl p-8 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,217,255,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 animate-shimmer"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-cyan-300 mb-3" style={{textShadow: '0 0 20px #00d9ff'}}>
                Play vs AI
              </h2>
              <p className="text-cyan-200/80 text-sm mb-4">
                Challenge our advanced AI opponent
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 border border-cyan-400/50" style={{boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'}}>
                  Single Player
                </span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-cyan-300/60">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{boxShadow: '0 0 5px #06b6d4'}}></span>
                  You (X)
                </span>
                <span className="text-cyan-600">vs</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{boxShadow: '0 0 5px #f59e0b'}}></span>
                  AI (O)
                </span>
              </div>
            </div>
          </button>

        {/* Local Multiplayer Mode */}
        <button
          onClick={() => onSelectMode("local")}
          className="group relative holographic-panel rounded-3xl p-8 hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(6,182,212,0.2)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 animate-shimmer"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-3" style={{textShadow: '0 0 20px #00d9ff'}}>
              Play with a Friend
            </h2>
            <p className="text-cyan-200/80 text-sm mb-4">
              Pass and play on the same device
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 border border-cyan-400/50" style={{boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'}}>
                Local Multiplayer
              </span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-cyan-300/60">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{boxShadow: '0 0 5px #06b6d4'}}></span>
                Player 1 (X)
              </span>
              <span className="text-cyan-600">vs</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{boxShadow: '0 0 5px #f59e0b'}}></span>
                Player 2 (O)
              </span>
            </div>
          </div>
        </button>
      </div>
      )}
    </div>
  )
}