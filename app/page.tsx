"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import GameBoard from "@/components/game-board"
import GameStatus from "@/components/game-status"
import GameControls from "@/components/game-controls"
import ModeSelect from "@/components/mode-select"
import WinnerDialog from "@/components/winner-dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { createNewGame, getGame, updateGame } from "@/lib/game-store"
import { useAuth } from "@/contexts/AuthContext"
import { useSound } from "@/hooks/use-sound"

export default function Home() {
  const { user } = useAuth()
  const { playMoveSound } = useSound()
  const [gameId, setGameId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [gameMode, setGameMode] = useState<"ai" | "local" | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [showWinnerDialog, setShowWinnerDialog] = useState(false)

  const startNewGame = async (mode: "ai" | "local", difficulty?: "easy" | "medium" | "hard") => {
    if (mode === "ai" && difficulty) {
      setAiDifficulty(difficulty)
    }
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
      setGameMode(mode)
      setCurrentPlayer(1)
      setGameState(gameData.board.get_state())
      setMessage(mode === "ai" 
        ? "New game created. You are X. Make your move."
        : "New game created. Player 1 (X) to move first.")
    } catch (error) {
      console.error("Exception creating game:", error)
      setMessage("Failed to create game")
    }
    setLoading(false)
  }

  const handleModeSelect = (mode: "ai" | "local", difficulty?: "easy" | "medium" | "hard") => {
    setGameMode(mode)
    startNewGame(mode, difficulty)
  }

  const backToMenu = () => {
    setGameId(null)
    setGameMode(null)
    setGameState(null)
    setCurrentPlayer(1)
    setMessage("")
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

      // Use currentPlayer for local mode, always 1 for AI mode
      const player = gameMode === "local" ? currentPlayer : 1
      const [success, msg] = gameData.board.make_move(boardIndex, position, player)
      
      if (!success) {
        setMessage(msg)
        setLoading(false)
        return
      }

      await updateGame(gameId, gameData)
      const gameOver = gameData.board.game_winner !== null
      
      let winnerMessage = ""
      if (gameOver) {
        setShowWinnerDialog(true)
        if (gameData.board.game_winner === 1) {
          winnerMessage = gameMode === "ai" 
            ? "Game Over! Winner: You (X)"
            : "Game Over! Winner: Player 1 (X)"
        } else if (gameData.board.game_winner === 2) {
          winnerMessage = gameMode === "ai"
            ? "Game Over! Winner: AI (O)"
            : "Game Over! Winner: Player 2 (O)"
        } else {
          winnerMessage = "Game Over! Draw"
        }
      } else {
        if (gameMode === "ai") {
          winnerMessage = "Move successful. Waiting for AI..."
        } else {
          // Switch player for local mode
          const nextPlayer = currentPlayer === 1 ? 2 : 1
          setCurrentPlayer(nextPlayer)
          winnerMessage = `Player ${nextPlayer}'s turn (${nextPlayer === 1 ? 'X' : 'O'})`
        }
      }

      setGameState(gameData.board.get_state())
      setMessage(winnerMessage)

      // Only get AI move in AI mode
      if (!gameOver && gameMode === "ai") {
        setTimeout(() => getAIMove(), 500)
      } else {
        setLoading(false)
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
      const gameData = await getGame(gameId, aiDifficulty)
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
        setShowWinnerDialog(true)
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
    setShowWinnerDialog(false)
    try {
      const gameData = await getGame(gameId)
      if (!gameData) {
        setMessage("Game not found")
        setLoading(false)
        return
      }

      gameData.board.reset()
      await updateGame(gameId, gameData)
      
      setCurrentPlayer(1)
      setGameState(gameData.board.get_state())
      setMessage(gameMode === "ai"
        ? "Game reset. Make your move."
        : "Game reset. Player 1 (X) to move first.")
    } catch (error) {
      console.error("Reset error:", error)
      setMessage("Failed to reset game")
    }
    setLoading(false)
  }

  const handlePlayAgain = () => {
    resetGame()
  }

  const handleBackToMenu = () => {
    setShowWinnerDialog(false)
    backToMenu()
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden cyberpunk-grid">
        {/* Animated background elements - Tron circuit grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
          {/* Neon orbs with electric glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="w-full max-w-3xl relative z-10">
          {!gameMode ? (
            // Mode selection screen
            <ModeSelect onSelectMode={handleModeSelect} />
          ) : !gameId ? (
            // Loading state
            <div className="flex justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4 neon-border" style={{boxShadow: '0 0 20px #00d9ff, inset 0 0 20px #00d9ff'}}></div>
                <p className="text-cyan-300 text-lg neon-text">Starting game...</p>
              </div>
            </div>
          ) : (
            // Game screen
            <div className="space-y-6">
              {/* Mode label */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${
                    gameMode === "ai" 
                      ? "bg-cyan-500/10 text-cyan-300 border-cyan-400"
                      : "bg-cyan-500/10 text-cyan-300 border-cyan-400"
                  }`} style={{boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)'}}>
                    {gameMode === "ai" ? "🎮 Mode: AI" : "👥 Mode: 1v1 Local"}
                  </span>
                  {gameMode === "ai" && (
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                      aiDifficulty === "easy" ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                      aiDifficulty === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
                      "bg-red-500/20 text-red-400 border border-red-500/50"
                    }`}>
                      Difficulty: {aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              
              <GameStatus 
                gameState={gameState} 
                message={message} 
                gameMode={gameMode}
                currentPlayer={currentPlayer}
              />
              <GameBoard gameState={gameState} onMove={handleMove} loading={loading} />
              <GameControls 
                onReset={resetGame} 
                onBackToMenu={backToMenu}
                loading={loading} 
              />
              <WinnerDialog
                isOpen={showWinnerDialog}
                winner={gameState?.game_winner || null}
                gameMode={gameMode}
                onPlayAgain={handlePlayAgain}
                onBackToMenu={handleBackToMenu}
              />
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}