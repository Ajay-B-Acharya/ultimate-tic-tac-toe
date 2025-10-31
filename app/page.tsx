"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import GameBoard from "@/components/game-board"
import GameStatus from "@/components/game-status"
import GameControls from "@/components/game-controls"
import { ProtectedRoute } from "@/components/protected-route"
import { createNewGame, getGame, updateGame } from "@/lib/game-store"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { user } = useAuth()
  const [gameId, setGameId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const startNewGame = async () => {
    setLoading(true)
    try {
      if (!user) {
        setMessage("Not authenticated. Please log in.")
        setLoading(false)
        return
      }
      
      const newGameId = await createNewGame(user.id)
      const gameData = await getGame(newGameId)
      
      if (!gameData) {
        setMessage("Failed to create game")
        setLoading(false)
        return
      }
      
      setGameId(newGameId)
      setGameState(gameData.board.get_state())
      setMessage("New game created. You are X. Make your move.")
    } catch (error) {
      console.error("Exception creating game:", error)
      setMessage("Failed to create game")
    }
    setLoading(false)
  }

  const handleMove = async (boardIndex: number, position: number) => {
    if (!gameId || loading) return

    setLoading(true)
    try {
      const gameData = await getGame(gameId)
      if (!gameData) {
        setMessage("Game not found")
        setLoading(false)
        return
      }

      const [success, msg] = gameData.board.make_move(boardIndex, position, 1)
      
      if (!success) {
        setMessage(msg)
        setLoading(false)
        return
      }

      await updateGame(gameId, gameData)
      const gameOver = gameData.board.game_winner !== null
      
      let winnerMessage = ""
      if (gameOver) {
        if (gameData.board.game_winner === 1) {
          winnerMessage = "Game Over! Winner: You (X)"
        } else if (gameData.board.game_winner === 2) {
          winnerMessage = "Game Over! Winner: AI (O)"
        } else {
          winnerMessage = "Game Over! Winner: Draw"
        }
      } else {
        winnerMessage = "Move successful. Waiting for AI..."
      }

      setGameState(gameData.board.get_state())
      setMessage(winnerMessage)

      if (!gameOver) {
        // Get AI move
        setTimeout(() => getAIMove(), 500)
      }
    } catch (error) {
      console.error("Move error:", error)
      setMessage("Failed to make move")
      setLoading(false)
    }
  }

  const getAIMove = async () => {
    if (!gameId) return

    try {
      const gameData = await getGame(gameId)
      if (!gameData) {
        setMessage("Game not found")
        setLoading(false)
        return
      }

      if (gameData.board.game_winner !== null) {
        setGameState(gameData.board.get_state())
        setMessage("Game is already over")
        setLoading(false)
        return
      }

      const move = gameData.ai_agent.get_best_move(gameData.board)
      
      if (!move) {
        setMessage("No valid moves available")
        setLoading(false)
        return
      }

      const [boardIndex, position] = move
      const [success, msg] = gameData.board.make_move(boardIndex, position, 2)
      
      if (!success) {
        setMessage(`AI move failed: ${msg}`)
        setLoading(false)
        return
      }

      await updateGame(gameId, gameData)
      const gameOver = gameData.board.game_winner !== null
      
      let winnerMessage = ""
      if (gameOver) {
        if (gameData.board.game_winner === 1) {
          winnerMessage = "Game Over! Winner: You (X)"
        } else if (gameData.board.game_winner === 2) {
          winnerMessage = "Game Over! Winner: AI (O)"
        } else {
          winnerMessage = "Game Over! Winner: Draw"
        }
      } else {
        winnerMessage = "Your turn."
      }

      setGameState(gameData.board.get_state())
      setMessage(winnerMessage)
    } catch (error) {
      console.error("AI move error:", error)
      setMessage("Failed to get AI move")
    }
    setLoading(false)
  }

  const resetGame = async () => {
    if (!gameId) return

    setLoading(true)
    try {
      const gameData = await getGame(gameId)
      if (!gameData) {
        setMessage("Game not found")
        setLoading(false)
        return
      }

      gameData.board.reset()
      await updateGame(gameId, gameData)
      
      setGameState(gameData.board.get_state())
      setMessage("Game reset. Make your move.")
    } catch (error) {
      console.error("Reset error:", error)
      setMessage("Failed to reset game")
    }
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="w-full max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-gradient">
              Ultimate Tic Tac Toe
            </h1>
            <p className="text-slate-300 text-lg font-medium">Battle against our AI in the ultimate strategy showdown</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                You (X)
              </span>
              <span className="text-slate-600">vs</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                AI (O)
              </span>
            </div>
          </div>

          {!gameId ? (
            <div className="flex justify-center">
              <button
                onClick={startNewGame}
                disabled={loading}
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-xl rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transform"
              >
                <span className="relative z-10">{loading ? "Starting..." : "🎮 Start New Game"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <GameStatus gameState={gameState} message={message} />
              <GameBoard gameState={gameState} onMove={handleMove} loading={loading} />
              <GameControls onReset={resetGame} loading={loading} />
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
