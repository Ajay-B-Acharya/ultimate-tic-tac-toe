"use client"

interface GameStatusProps {
  gameState: any
  message: string
}

export default function GameStatus({ gameState, message }: GameStatusProps) {
  if (!gameState) return null

  const getStatusColor = () => {
    if (gameState.game_winner === 1) return "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
    if (gameState.game_winner === 2) return "text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400"
    if (gameState.game_winner === 3) return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
    return "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
  }

  const getStatusIcon = () => {
    if (gameState.game_winner === 1) return "🎉"
    if (gameState.game_winner === 2) return "🤖"
    if (gameState.game_winner === 3) return "🤝"
    return "⚡"
  }

  return (
    <div className="bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
      <div className="relative z-10">
        <p className={`text-center font-bold text-xl flex items-center justify-center gap-2 ${getStatusColor()}`}>
          <span className="text-3xl">{getStatusIcon()}</span>
          {message}
        </p>
        {gameState.game_winner && (
          <div className="mt-3 text-center">
            <div className="text-lg font-semibold text-slate-200">
              {gameState.game_winner === 1 && "🏆 Victory is Yours! Congratulations! 🏆"}
              {gameState.game_winner === 2 && "🤖 AI Wins This Round! Try Again! 🤖"}
              {gameState.game_winner === 3 && "🤝 Perfectly Balanced! It's a Draw! 🤝"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
