"use client"

interface GameStatusProps {
  gameState: any
  message: string
  gameMode?: "ai" | "local" | null
  currentPlayer?: 1 | 2
}

export default function GameStatus({ gameState, message, gameMode, currentPlayer }: GameStatusProps) {
  if (!gameState) return null

  const getStatusColor = () => {
    if (gameState.game_winner === 1) return "text-cyan-400"
    if (gameState.game_winner === 2) return "text-amber-500"
    if (gameState.game_winner === 3) return "text-yellow-400"
    return "text-cyan-300"
  }

  const getStatusIcon = () => {
    if (gameState.game_winner === 1) return "🎉"
    if (gameState.game_winner === 2) return "🤖"
    if (gameState.game_winner === 3) return "🤝"
    return "⚡"
  }

  return (
    <div className="holographic-panel rounded-2xl p-6 relative overflow-hidden" style={{boxShadow: '0 0 40px rgba(0, 217, 255, 0.3), inset 0 0 40px rgba(0, 217, 255, 0.1)'}}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5"></div>
      <div className="relative z-10">
        <p className={`text-center font-bold text-xl flex items-center justify-center gap-2 ${getStatusColor()}`} style={
          gameState.game_winner === 1 ? {textShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff'} :
          gameState.game_winner === 2 ? {textShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b'} :
          gameState.game_winner === 3 ? {textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24'} :
          {textShadow: '0 0 15px #00d9ff'}
        }>
          <span className="text-3xl">{getStatusIcon()}</span>
          {message}
        </p>
        {!gameState.game_winner && gameMode === "local" && currentPlayer && (
          <div className="mt-3 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
              currentPlayer === 1 
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                : "bg-amber-500/20 text-amber-400 border-amber-400"
            }`} style={currentPlayer === 1 ? {
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)'
            } : {
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              <span className={`w-3 h-3 rounded-full ${currentPlayer === 1 ? "bg-cyan-400" : "bg-amber-400"}`} style={currentPlayer === 1 ? {boxShadow: '0 0 8px #00d9ff'} : {boxShadow: '0 0 8px #f59e0b'}}></span>
              {currentPlayer === 1 ? "Player 1 (X)" : "Player 2 (O)"} to move
            </div>
          </div>
        )}
        {gameState.game_winner && (
          <div className="mt-3 text-center">
            <div className="text-lg font-semibold text-cyan-200" style={{textShadow: '0 0 15px #00d9ff'}}>
              {gameState.game_winner === 1 && (gameMode === "ai" ? "🏆 Victory is Yours! Congratulations! 🏆" : "🏆 Player 1 Wins! Congratulations! 🏆")}
              {gameState.game_winner === 2 && (gameMode === "ai" ? "🤖 AI Wins This Round! Try Again! 🤖" : "🏆 Player 2 Wins! Congratulations! 🏆")}
              {gameState.game_winner === 3 && "🤝 Perfectly Balanced! It's a Draw! 🤝"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}