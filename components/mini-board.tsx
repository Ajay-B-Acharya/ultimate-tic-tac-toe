"use client"

interface MiniBoardProps {
  boardIndex: number
  board: any
  metaBoardWinner: number
  onMove: (boardIndex: number, position: number) => void
  loading: boolean
  isActive: boolean
}

export default function MiniBoard({ boardIndex, board, metaBoardWinner, onMove, loading, isActive }: MiniBoardProps) {
  const getSymbol = (value: number) => {
    if (value === 1) return "X"
    if (value === 2) return "O"
    return ""
  }

  const getWinnerText = (winner: number) => {
    if (winner === 1) return "X"
    if (winner === 2) return "O"
    if (winner === 3) return "Draw"
    return ""
  }

  const isWon = metaBoardWinner !== 0
  const isBoardWon = board.winner !== null

  return (
    <div
      className={`aspect-square rounded-2xl border-2 p-4 transition-all duration-300 ${
        isWon
          ? "bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/30 opacity-60"
          : isActive
            ? "bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-400 shadow-xl shadow-purple-500/30 scale-105 animate-pulse-slow"
            : "bg-gradient-to-br from-slate-700/70 to-slate-800/70 border-slate-600/50 hover:border-slate-500"
      }`}
    >
      {isWon ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center transform scale-110">
            <div className={`text-5xl font-black mb-2 ${
              metaBoardWinner === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400' :
              metaBoardWinner === 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400' :
              'text-yellow-400'
            }`}>
              {getWinnerText(metaBoardWinner)}
            </div>
            <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Winner</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 h-full">
          {board.board.map((cell: number, position: number) => (
            <button
              key={position}
              onClick={() => onMove(boardIndex, position)}
              disabled={loading || cell !== 0 || !isActive || isBoardWon}
              className={`rounded-xl text-2xl font-black transition-all duration-200 transform ${
                cell === 0 
                  ? "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 hover:scale-110 cursor-pointer shadow-lg" 
                  : "bg-gradient-to-br from-slate-500 to-slate-600 cursor-default"
              } ${
                cell === 1 ? "text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300 shadow-blue-400/50" : 
                cell === 2 ? "text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-rose-300 shadow-pink-400/50" : 
                "text-slate-700"
              } disabled:opacity-50 disabled:hover:scale-100`}
            >
              {getSymbol(cell)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
